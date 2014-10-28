/*global angular: false*/
/*jslint es5: true */
(function (angular) {
    'use strict';

    var app = angular.module('postit', ['ngSanitize']),
        template = { id: undefined, author: 'Anonymous', contents: '' };
    
    app.controller('ListCtrl', function ($scope, Backend) {
        $scope.selected = undefined;
        $scope.notes = [];
        
        this.select = function selectNote(note) {
            $scope.selected = note;
        };
        
        this.add = function addNote(text) {
            var note = angular.copy(template);
            note.created = Date.now();
            if (text) {
                note.contents = text;
            }
            $scope.notes.push(note);
        };
        
        this.remove = function removeNote(note) {
            var idx = $scope.notes.indexOf(note);
            if (idx > -1) {
                $scope.selected = undefined;
                $scope.notes.splice(idx, 1);
            }
            // If note has an id, then it must have been persisted previously - delete!
            if (note.id) {
                Backend.remove(note.id);
            }
        };
        
        this.save = function saveNote(note) {
            if (note.id) {
                Backend.update(note);
            } else {
                Backend.create(note).then(function (response) {
                    note.id = response.data.id;
                });
            }
            $scope.selected = undefined;
        };
        
        Backend.list().then(function (response) {
            $scope.notes = response.data;
        });
    });
    
    app.filter('nl2br', function () {
        return function (text) {
            return text && text.replace(/\n/g, '<br>');
        };
    });
    
    app.service('Backend', function ($http) {
        this.list = function () {
            return $http.get('/rest/notes');
        };
        this.create = function (note) {
            return $http.post('/rest/note', {
                contents: note.contents
            });
        };
        this.update = function (note) {
            return $http.put('/rest/note/' + note.id, {
                contents: note.contents
            });
        };
        this.remove = function (id) {
            return $http.delete('/rest/note/' + id);
        };
    });
}(angular));