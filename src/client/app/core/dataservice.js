(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'exception', 'logger'];
    /* @ngInject */
    function dataservice($http, $q, exception, logger) {
        var service = {
            getMessageCount: getMessageCount,
            retrieveActiveGamesCount: retrieveActiveGamesCount,
            totalNFLGamesCount: 0,
            totalNFLActiveGamesCount: 0,
            totalNCFGamesCount: 0,
            totalNCFActiveGamesCount: 0,
            retrieveNFLGames: retrieveNFLGames,
            retrieveNCFGames: retrieveNCFGames,
            nflGames: [],
            ncfGames: []
        };

        return service;

        function getMessageCount() { return $q.when(72); }
        
        function retrieveActiveGamesCount() { 
            return $q.when(service.totalNFLActiveGamesCount && service.totalNCFActiveGamesCount); 
        }
        
        function retrieveNFLGames() {
            return $http.get('/api/nfl/games')
                .then(success)
                .catch(fail);
                
            function success(response) {
                console.log(response.data);
                service.totalNFLGamesCount = response.data.length;
                service.totalNFLActiveGamesCount = response.data.reduce(function(n, game) {
                    return n + (game.status === 'in');
                }, 0);
                service.nflGames = response.data;
                return response.data;
            }
            
            function fail(e) {
                return exception.catcher('XHR Failed for retrieveNFLGames')(e);
            }
        }
        
        function retrieveNCFGames() {
            return $http.get('/api/ncf/games')
                .then(success)
                .catch(fail);
                
            function success(response) {
                console.log(response.data);
                service.totalNCFGamesCount = response.data.length;
                service.totalNCFActiveGamesCount = response.data.reduce(function(n, game) {
                    return n + (game.status === 'in');
                }, 0);
                service.ncfGames = response.data;
                console.log(service.ncfGames);
                return response.data;
            }
            
            function fail(e) {
                return exception.catcher('XHR Failed for retrieveNFLGames')(e);
            }
        }
    }
})();
