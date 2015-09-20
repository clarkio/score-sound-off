
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var bottomlineScoreParser = require('./utils/score-parser-bottomline');
var apiScoreParser = require('./utils/score-parser-api');

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

function retrieveSportsDataFromBottomline(sport) {
    // console.log('Sport Requested: ', sport);
    if (useTestData) {
        return retrieveTestData();
    }
    // From Bluebird: if a module has multiple success values use .spread instead of .then
    return request(baseScoresUrl + leagues.nfl + trailingScoresUrl)
                .spread(readBottomlineScoresData)
                .catch(handleError);
}

function retrieveSportsDataFromApi (sport, league) {
}

function readBottomlineScoresData (response, body) {
    var result = bottomlineScoreParser.parseScores(body, leagues.nfl);
    return Promise.resolve(result);
}

function handleError(e) {
    console.log('An error occurred:', e);
    return Promise.reject(e);
}

function retrieveTestData () {
    var fs = Promise.promisifyAll(require('fs'));
    return fs.readFileAsync('src/client/test-helpers/test-data-bottomline.txt', 'utf8')
        .then(function (data) {
            return readBottomlineScoresData({}, data.toString());
        })
        .catch(function (error) {
            return error;
        });
    // return fs.readFileAsync('src/client/test-helpers/test-data-api.txt', 'utf8')
    //     .then(function (data) {
    //         return readScoresData({}, data.toString());
    //     })
    //     .catch(function (error) {
    //         return error;
    //     });
}
