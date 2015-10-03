(function () {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.widgets',
        'app.admin',
        'app.dashboard',
        'app.layout',
        'btford.socket-io',
        'angularMoment'
    ]).
    factory('nflSocket', function (socketFactory) {
        return socketFactory();
    });

})();
