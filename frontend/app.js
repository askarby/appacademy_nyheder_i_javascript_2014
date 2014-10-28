/*global angular: false*/
/*jslint es5: true */
(function (angular) {
    'use strict';

    var app = angular.module('postit', ['ngSanitize']),
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
        
        this.remove = function removeNote(note) {
            var idx = $scope.notes.indexOf(note);
            if (idx > -1) {
                $scope.selected = undefined;
                $scope.notes.splice(idx, 1);
            }
        };
        
        this.add('Sample note containing important information...');
        this.add('Some didn\'t believe that notes could be awesome');
        this.add('More than awesome...');
        this.add('Buy milk, and bread');
        this.add('Technologies to use:\n- NodeJS\n- JavaScript\n- AngularJS');
        this.add('I couldn\'t come up with anything interesting to type');
    });
    
    app.filter('nl2br', function () {
        return function (text) {
            return text && text.replace(/\n/g, '<br>');
        };
    });
}(angular));