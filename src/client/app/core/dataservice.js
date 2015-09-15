(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'exception', 'logger'];
    /* @ngInject */
    function dataservice($http, $q, exception, logger) {
        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            retrieveActiveGamesCount: retrieveActiveGamesCount,
            totalNFLGamesCount: 0,
            totalNFLActiveGamesCount: 0,
            retrieveNFLGames: retrieveNFLGames,
            nflGames: {}
        };

        return service;

        function getMessageCount() { return $q.when(72); }
        
        function retrieveActiveGamesCount() { return $q.when(service.totalNFLActiveGamesCount); }
        
        function retrieveNFLGames() {
            return $http.get('/api/nfl/games')
                .then(success)
                .catch(fail);
                
            function success(response) {
                console.log(response.data);
                service.totalNFLGamesCount = response.data.length;
                service.totalNFLActiveGamesCount = response.data.reduce(function(n, game) {
                    return n + (game.time.active === true);
                }, 0);
                service.nflGames = response.data;
                console.log(service.nflGames);
                return response.data;
            }
            
            function fail(e) {
                return exception.catcher('XHR Failed for retrieveNFLGames')(e);
            }
        }

        function getPeople() {
            return $http.get('/api/people')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return exception.catcher('XHR Failed for getPeople')(e);
            }
        }
    }
})();
