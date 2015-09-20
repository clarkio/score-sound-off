
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    parseScores: parseScores
};

function parseScores(data, sport) {
    return new Promise(function (resolve, reject) {
        var rawGameItems = data.match(/left([^&;]+)/g);
        cleanTheData(rawGameItems);
        var parsedGames = parseIntoGames(rawGameItems);
        
        resolve(parsedGames);
    });
}

function cleanTheData (array) {
    array.forEach(function (item, index) {
        // Game info starts after '=', clean up %20 between strings and add a | between teams
        console.log('line item', item);
        var replaceItem = '   ';
        if (item.indexOf('%20at%20') > -1) {
            replaceItem = ' at ';
        } else {
            replaceItem = '   ';
        }
        console.log('replace item = ', replaceItem);
        array[index] = item.substring(item.indexOf('=') + 1).replace(/%20/g, ' ').replace(replaceItem, '|');
    });
}

function parseIntoGames (rawData) {
    var result = [];
    rawData.forEach(function (item, index) {
        result.push(parseIntoGame(item));
    });
    return result;
}

function parseIntoGame (data) {
    var game = {};
    var homeTeamParse = true;
    var awayTeamParse = false;
    console.log('raw game data:', data);
    game.time = parseGameTime(data);
    // console.log('parsed game time:', game.time);
    game.homeTeam = parseTeam(data, homeTeamParse, game.time.active);
    // console.log('parsed home team', game.homeTeam);
    game.awayTeam = parseTeam(data, awayTeamParse);
    // console.log('parsed away team', game.awayTeam);
    
    if (!game.time.active) {
        determineGameWinner(game);
    }
    
    return game;
}

function parseGameTime (data) {
    var time = {};
    
    time.clock = data.split('(').pop().split(')').shift();
    // TODO: clean this mess up
    if (time.clock.indexOf('IN 1ST') > -1 || time.clock.indexOf('IN 2ND') > -1 || time.clock.indexOf('IN 3RD') > -1 ||
            (time.clock.indexOf('IN 4TH') > -1 && time.clock !== '00:00 IN 4TH')) {
        time.active = true;
    } else {
        if (time.clock === 'FINAL' || time.clock === 'FINAL - OT' ||
            time.clock === '00:00 IN 4TH' || time.clock === 'END OF 4TH' || 
            time.clock === '00:00 IN OT' || time.clock === '00:00 IN 2OT') {
            
            time.clock = 'FINAL';
        }
        time.active = false;
    }
    
    return time;
}

function parseTeam (data, isHomeTeam, isActive) {
    var team = {};
    var indexToTake = isHomeTeam ? 0 : 1;
    var teamString = data.split('|');
    if (!teamString) {
        console.log('data does not contain |', data);
    } else {
        teamString = teamString[indexToTake];
    }
    
    if (!isHomeTeam) {
        console.log('teamString', teamString);
        teamString = teamString.split(' (')[0];
        team.score = teamString.substring(teamString.length - 2);
    } else {
        team.score = teamString.substring(teamString.length - 2);
    }
    
    if (team.score && team.score >= 0) {
        team.name = teamString.split(team.score)[0].trim().replace('^', '');
    } else {
        team.score = 0;
        team.name = teamString;
    }
    team.score = parseInt(team.score);
    
    return team;
}

function determineGameWinner (game) {
    if (game.homeTeam.score > game.awayTeam.score) {
        game.homeTeam.isWinner = true;
        game.awayTeam.isWinner = false;
    } else if (game.homeTeam.score === game.awayTeam.score) {
        game.homeTeam.isWinner = false;
        game.awayTeam.isWinner = false;
    } else {
        game.homeTeam.isWinner = false;
        game.awayTeam.isWinner = true;
    }
}
