/*jslint node: true, nomen: true, es5: true */
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var fs = require('fs');

var dbFile = './postit.data';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

if (!fs.existsSync(dbFile)) {
    db.serialize(function () {
        // Initialize database    
        db.run('CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, created TEXT, author TEXT, contents TEXT)');

        var stmt = db.prepare('INSERT INTO notes (created, author, contents) VALUES (?, ?, ?);');
        stmt.run(new Date().toISOString(), 'Anonymous', 'Sample note containing important information...');
        stmt.run(new Date().toISOString(), 'Anonymous', 'Some didn\'t believe that notes could be awesome');
        stmt.run(new Date().toISOString(), 'Anonymous', 'More than awesome...');
        stmt.run(new Date().toISOString(), 'Anonymous', 'Buy milk, and bread');
        stmt.run(new Date().toISOString(), 'Anonymous', 'Technologies to use:\n- NodeJS\n- JavaScript\n- AngularJS');
        stmt.run(new Date().toISOString(), 'Anonymous', 'I couldn\'t come up with anything interesting to type');
        stmt.finalize();
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Get list of notes
app.get('/rest/notes', function (req, res) {
    var data = [];
    db.each('SELECT * FROM notes', function onRow(err, row) {
        data.push(row);
    }, function onComplete() {
        res.json(data);
    });
});

// Create a new note
app.post('/rest/note', function (req, res) {
    var stmt = db.prepare('INSERT INTO notes (created, author, contents) VALUES (?, ?, ?);'),
        // Vales to insert
        created = new Date().toISOString(),
        author = 'Anonymous',
        contents = req.body.contents;
    
    // Execute statement
    stmt.run(created, author, contents, function (err) {
        var id = this.lastID;
        if (err) {
            res.status(500).json({
                message: 'Unable to create a note',
                cause: err
            });
        } else {
            res.json({
                id: id,
                created: created,
                author: author,
                contents: contents
            });
        }
    });
    stmt.finalize();
});

// Update note identified by id
app.put('/rest/note/:id', function (req, res) {
    var stmt = db.prepare('UPDATE notes SET contents = ? WHERE id = ?;'),
        // Vales to update
        id = req.params.id,
        contents = req.body.contents;
    
    // Execute statement
    stmt.run(req.body.contents, req.params.id, function (err) {
        if (err) {
            res.status(500).json({
                message: 'Unable to update a note',
                cause: err
            });
        } else {
            res.status(200);
        }
    });
    stmt.finalize();
});

// Delete note identified by id
app.delete('/rest/note/:id', function (req, res) {
    // Execute statement
    var stmt = db.prepare('DELETE FROM notes WHERE id = ?;');
    stmt.run(req.params.id);
    stmt.finalize(function onFinalized() {
        res.status(200);
    });
});

// Serve static frontend files
app.use('/', express.static(__dirname + '/../frontend'));

var server = app.listen(1337, function () {
    console.log('Post-it Note app listening at http:/127.0.0.1:1337/');
});