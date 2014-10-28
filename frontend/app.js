/*global angular: false*/
/*jslint es5: true */
(function (angular) {
    'use strict';

    var app = angular.module('postit', []),
        template = { id: undefined, author: 'Anonymous', contents: '' };
    
    app.controller('ListCtrl', function ($scope) {
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
        
        this.add('Sample note containing important information...');
        this.add('Some didn\'t believe that notes could be awesome');
        this.add('More than awesome...');
        this.add('Buy milk, and bread');
        this.add('Technologies to use:\n- NodeJS\n- JavaScript\n- AngularJS');
        this.add('I couldn\'t come up with anything interesting to type');
    });
}(angular));