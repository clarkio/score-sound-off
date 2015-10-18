
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

module.exports = {
    sport: sport,
    leagues: leagues,
    retrieveSportsData: retrieveSportsDataFromBottomline,
    testRetrieveSportsData: retrieveSportsDataFromApi
};

var useTestData = false;
var baseScoresUrl = 'http://sports.espn.go.com/';
var trailingScoresUrl = '/bottomline/scores';
// var baseScoresApiUrl = 'http://site.api.espn.com/apis/v2/scoreboard/';
//http://site.api.espn.com/apis/v2/scoreboard/header?weeks=3&sport=football&league=nfl

//http://site.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl

function retrieveSportsDataFromBottomline(sportType) {
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
}

function retrieveSportsDataFromApi (sport, league) {
    // TODO
}

function retrieveTestData (sportType) {
    var fs = Promise.promisifyAll(require('fs'));
    return fs.readFileAsync('src/server/test-helpers/test-data-bottomline.json', 'utf8')
        .then(successFn)
        .catch(handleError);
        
    function successFn (data) {
        data = JSON.parse(data);
        return readBottomlineScoresData({}, data[sportType]);
    }
}

function readBottomlineScoresData (response, body) {
    return bottomlineScoreParser.parseScores(body, leagues.nfl)
            .then(successFn)
            .catch(errorFn);
    
    function successFn (result) {
        return Promise.resolve(result);
    }
                    
    function errorFn (error) {
        return handleError (error, 'Error getting latest data');
    }
}

function handleError(error, overrideMessage) {
    var message = overrideMessage;
    if (!overrideMessage) {
        message = 'An error occured';
    }
    console.log(message + ':', error);
    return Promise.reject(error);
}
