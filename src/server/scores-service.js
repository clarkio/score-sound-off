
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var scoreParser = require('./utils/score-parser-bottomline');

var sports = {
    nfl: 'nfl',
    ncf: 'ncf'
};

module.exports = {
    sports: sports,
    retrieveSportsData: retrieveSportsData
};

var useTestData = false;
var baseScoresUrl = 'http://sports.espn.go.com/';
var trailingScoresUrl = '/bottomline/scores';
// var baseScoresApiUrl = 'http://site.api.espn.com/apis/v2/scoreboard/';
//http://site.api.espn.com/apis/v2/scoreboard/header?weeks=3&sport=football&league=nfl

function retrieveSportsData(sport) {
    console.log('Sport Requested: ', sport);
    if (useTestData) {
        return retrieveTestData();
    }
    // From Bluebird: if a module has multiple success values use .spread instead of .then
    return request(baseScoresUrl + sports.nfl + trailingScoresUrl)
                .spread(readScoresData)
                .catch(handleError);
}

function retrieveSportsDataFromApi (sport, week) {
}

function readScoresData (response, body) {
    var result = scoreParser.parseScores(body, sports.nfl);
    return Promise.resolve(result);
}

function handleError(e) {
    console.log('An error occurred:', e);
    return Promise.reject(e);
}

function retrieveTestData () {
    var fs = Promise.promisifyAll(require('fs'));
    return fs.readFileAsync('src/client/test-helpers/test-data.txt', 'utf8')
        .then(function (data) {
            return readScoresData({}, data.toString());
        })
        .catch(function (error) {
            return error;
        });
}
