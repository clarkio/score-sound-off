/* global angular */
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
        vm.activeNclGamesCount = 0;
        vm.activeNclGamesText = 'Active Games';
        vm.activeNflGamesCount = 0;
        vm.activeNflGamesText = 'Active Games';
        vm.nflGames = [];
        vm.ncfGames = [];
        vm.updateNflScores = updateNflScores;
        vm.updateNcfScores = updateNcfScores;
        vm.lastUpdatedNflScoresTime = new Date();
        vm.lastUpdatedNcfScoresTime = new Date();

        activate();

        nflSocket.on('NFL-ALL-UPDATE', function (data) {
            vm.nflGames = data;
            vm.lastUpdatedNflScoresTime = new Date();
        });

        nflSocket.on('NCF-ALL-UPDATE', function (data) {
            vm.ncfGames = data;
            vm.lastUpdatedNcfScoresTime = new Date();
            console.log('college games:', data);
        });

        nflSocket.on('NFL-SCORE-CHANGE', function (data) {
            console.log(data);
            var scoreAudio = document.getElementById('audioContainer');
            playSoundQueue(scoreAudio, data);
        });

        function activate() {
            //Hack for now to allow data service time to retrieve games
            $timeout(function() {
                logger.info('Activated Dashboard View');
                updateActiveGamesText();
                updateNFLGamesCollection();
                // updateNCFGamesCollection();
            }, 1000);
        }

        // The following function is used from: http://stackoverflow.com/a/16917814
        function playSoundQueue (container, files) {
            var index = 1;
            if (!container || !container.tagName || container.tagName !== 'AUDIO') {
                throw Error( 'Invalid container' );
            }
           /* if (!files || !files.length) {
                throw Error( 'Invalid files array' );
            }*/

            var playNext = function() {
                if (index < files.length) {
                    container.src = files[index];
                    index += 1;
                } else {
                    container.removeEventListener('ended', playNext, false);
                }
            };

            container.addEventListener('ended', playNext);

            container.src = files[0];
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
