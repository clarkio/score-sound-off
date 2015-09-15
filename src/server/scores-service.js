
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var scoreParser = require('./utils/score-parser');

var sports = {
    nfl: 'nfl',
    ncf: 'ncf'
};

module.exports = {
    sports: sports,
    retrieveSportsData: retrieveSportsData
};

var baseScoresUrl = 'http://sports.espn.go.com/';
var trailingScoresUrl = '/bottomline/scores';

function retrieveSportsData(sport) {
    console.log('Sport Requested: ', sport);
    // From Bluebird: if a module has multiple success values use .spread instead of .then
    return request(baseScoresUrl + sports.nfl + trailingScoresUrl)
                .spread(readScoresData)
                .catch(handleError);
}

function readScoresData (response, body) {
    var result = scoreParser.parseScores(body, sports.nfl);
    return Promise.resolve(result);
}

function handleError(e) {
    console.log('An error occurred:', e);
    return Promise.reject(e);
}
