(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', 'dataservice', 'logger', '$timeout'];
    /* @ngInject */
    function DashboardController($q, dataservice, logger, $timeout) {
        var vm = this;
        vm.news = {
            title: 'Score Sound Off',
            description: 'An announcer for sports games'
        };
        
        vm.activeGamesCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';
        vm.activeGamesText = 'Active Games';
        vm.nflGames = [];

        activate();

        function activate() {
            //Hack for now to allow data service to retrieve games
            $timeout(function() {
                logger.info('Activated Dashboard View');
                updateActiveGamesText();
                updateNFLGamesCollection();
            }, 500);
            
            // var promises = [retrieveActiveGamesCount()];
            // return $q.all(promises).then(function() {
            //     logger.info('Activated Dashboard View');
            // });
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
            vm.activeGamesCount = dataservice.totalNFLActiveGamesCount;
            if (vm.activeGamesCount === 1) {
                vm.activeGamesText = 'Active Game';
            } else {
                vm.activeGamesText = 'Active Games';
            }
        }
        
        function updateNFLGamesCollection() {
            vm.nflGames = dataservice.nflGames;
        }
    }
})();
