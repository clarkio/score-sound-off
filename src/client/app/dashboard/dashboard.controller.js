(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', 'dataservice', 'logger', '$timeout', 'nflSocket'];
    /* @ngInject */
    function DashboardController($q, dataservice, logger, $timeout, nflSocket) {
        var vm = this;
        vm.news = {
            title: 'Score Sound Off',
            description: 'An announcer for sports games'
        };
        
        vm.title = 'Dashboard';
        vm.activeNflGamesCount = 0;
        vm.activeNflGamesText = 'Active Games';
        vm.activeNflGamesCount = 0;
        vm.activeNflGamesText = 'Active Games';
        vm.nflGames = [];
        vm.ncfGames = [];
        vm.updateNflScores = updateNflScores;
        vm.updateNcfScores = updateNcfScores;
        vm.lastUpdatedScoresTime = new Date();

        activate();
        
        nflSocket.on('NFL-ALL-UPDATE', function (data) {
            vm.nflGames = data;
            vm.lastUpdatedNflScoresTime = new Date();
            console.log(data);
        });
        
        nflSocket.on('NCF-ALL-UPDATE', function (data){
            vm.ncfGames = data;
            vm.lastUpdatedNcfScoresTime = new Date();
            console.log('college games:', data);
        });

        function activate() {
            //Hack for now to allow data service to retrieve games
            $timeout(function() {
                logger.info('Activated Dashboard View');
                updateActiveGamesText();
                updateNFLGamesCollection();
                // updateNCFGamesCollection();
            }, 1000);
        }

        function retrieveActiveGamesCount() {
            return dataservice.retrieveActiveGamesCount().then(function (data) {
                vm.activeGamesCount = data;
                if (data === 1) {
                    vm.activeGamesText = 'Active Game';
                }
                return vm.activeGamesCount;
            });
        }
        
        function updateActiveGamesText() {
            vm.activeNflGamesCount = dataservice.totalNFLActiveGamesCount;
            vm.activeNcfGamesCount = dataservice.totalNCFActiveGamesCount;
            
            if (vm.activeNflGamesCount === 1) {
                vm.activeNflGamesText = 'Active NFL Game';
            } else {
                vm.activeNflGamesText = 'Active NFL Games';
            }
            
            if (vm.activeNcfGamesCount === 1) {
                vm.activeNcfGamesText = 'Active College Football Game';
            } else {
                vm.activeNcfGamesText = 'Active College Football Games';
            }
        }
        
        function updateNFLGamesCollection() {
            vm.nflGames = dataservice.nflGames;
        }
        
        function updateNCFGamesCollection() {
            vm.ncfGames = dataservice.ncfGames;
        }
        
        function updateNflScores () {
            dataservice.retrieveNFLGames()
                .then(successfullyRetrievedGames)
                .catch(errorFunction);
            
            function successfullyRetrievedGames (result) {
                vm.nflGames = result;
                updateActiveGamesText();
                retrieveActiveGamesCount();
            }
        }
        
        function updateNcfScores () {
            dataservice.retrieveNCFGames()
                .then(successfullyRetrievedGames)
                .catch(errorFunction);
            
            function successfullyRetrievedGames (result) {
                vm.ncfGames = result;
                updateActiveGamesText();
                retrieveActiveGamesCount();
            }
        }
        
        function errorFunction (error) {
            console.log(error);
        }
    }
})();
