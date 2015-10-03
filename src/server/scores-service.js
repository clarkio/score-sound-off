
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var bottomlineScoreParser = require('./utils/score-parser-bottomline');
var apiScoreParser = require('./utils/score-parser-api');
var data = require('./data');

var sport = {
    football: 'football',
    basketball: 'basketball',
    hockey: 'hockey'
};

var leagues = {
    nfl: 'nfl',
    collegeFootball: 'ncf',
    nhl: 'nhl',
    nba: 'nba',
    collegeBasketball: 'ncb'
};

var nflEventData = {};
var ncfEventData = {};

module.exports = {
    sport: sport,
    leagues: leagues,
    retrieveSportsData: retrieveSportsDataFromBottomline,
    testRetrieveSportsData: retrieveSportsDataFromApi,
    nflGames: nflEventData,
    ncfGames: ncfEventData
};

var useTestData = true;
var baseScoresUrl = 'http://sports.espn.go.com/';
var trailingScoresUrl = '/bottomline/scores';
// var baseScoresApiUrl = 'http://site.api.espn.com/apis/v2/scoreboard/';
//http://site.api.espn.com/apis/v2/scoreboard/header?weeks=3&sport=football&league=nfl

//http://site.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl

function getNflData () {
    return Promise.resolve(nflEventData);
}

function retrieveSportsDataFromBottomline(sportType) {
    // console.log('Sport Requested: ', sport);
    if (useTestData) {
        console.log('USING TEST DATA');
        return retrieveTestData(sportType);
    } else {
        console.log('USING LIVE DATA');
    }
    // From Bluebird: if a module has multiple success values use .spread instead of .then
    return request(baseScoresUrl + sportType + trailingScoresUrl)
                .spread(readBottomlineScoresData)
                .catch(handleError);
    
    function readBottomlineScoresData (response, body) {
        return bottomlineScoreParser.parseScores(body, leagues.nfl)
                .then(function (result) {
                    if (sportType === leagues.nfl) {
                        nflEventData = result;
                        data.nflGameData = result;
                    } else {
                        ncfEventData = result;
                        data.ncfGameData = result;
                    }
                    // data.setNflGames(result);
                    // console.log('Latest data:', nflEventData);
                    return Promise.resolve(result);
                })
                .catch(function (error) {
                    console.log('Error getting latest data:', error);
                    return Promise.reject(error);
                });
    };
}

function retrieveSportsDataFromApi (sport, league) {
}

function handleError(e) {
    console.log('An error occurred:', e);
    return Promise.reject(e);
}

function retrieveTestData (sportType) {
    var fs = Promise.promisifyAll(require('fs'));
    return fs.readFileAsync('src/server/test-helpers/test-data-bottomline.json', 'utf8')
        .then(function (data) {
            data = JSON.parse(data);
            return readBottomlineScoresData({}, data[sportType]);
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });
        
    function readBottomlineScoresData (response, body) {
        return bottomlineScoreParser.parseScores(body, leagues.nfl)
                .then(function (result) {
                    if (sportType === leagues.nfl) {
                        nflEventData = result;
                        data.nflGameData = result;
                    } else {
                        ncfEventData = result;
                        data.ncfGameData = result;
                    }
                    // data.setNflGames(result);
                    // console.log('Latest data:', nflEventData);
                    return Promise.resolve(result);
                })
                .catch(function (error) {
                    console.log('Error getting latest data:', error);
                    return Promise.reject(error);
                });
    };
}

function repeatUpdateOfScores() {
    console.log('update in progress');
    setInterval(retrieveSportsDataFromBottomline('nfl'), 5000);
}
