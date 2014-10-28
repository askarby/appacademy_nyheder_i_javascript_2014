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
    });
}(angular));