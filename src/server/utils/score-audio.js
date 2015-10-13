
var util = require('util');
var fs = require('fs');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    determineScoreChangeAudio: determineAllScoreChangeAudio
};

function determineAllScoreChangeAudio(scoreChanges) {
    var audioPromises = [];
    for (var i = 0; i < scoreChanges.length; i++) {
        var audioPromise = determineScoreChangeAudio(scoreChanges[i]);
        audioPromises.push(audioPromise);
    }
    console.log(audioPromises.length);
    return Promise.all(audioPromises)
        .then(function (result) {
            console.log(result[0]);
            return result[0];
        })
        .catch(function (err) {
            console.log("determineAllScoreChangeAudio", err);
        });
}

function determineScoreChangeAudio(scoreChange) {
    // TODO: make it configurable what voice is used
    var audioFileMainUrl = 'http://www.myfantasyleague.com/sounds/shouty/';
    var audioFilesToPlay = [];
    return Promise.all([
        getTeamCityAudioFile(scoreChange),
        getTeamScoreChangeAudioFile(scoreChange),
        getTeamNameAudioFile(scoreChange)])
            .then(successAudioCallback)
            .catch(errorCallback);

    function successAudioCallback(results) {
        var teamCityToPlay = results[0].toLowerCase();
        var teamScoreToPlay = results[1];
        var teamNameToPlay = results[2].toLowerCase();
        for (var i = 0; i < teamScoreToPlay.length; i++) {
            audioFilesToPlay.push(audioFileMainUrl + teamScoreToPlay[i] + '.wav');
        }
        audioFilesToPlay.push(audioFileMainUrl + teamCityToPlay + teamNameToPlay + '.wav');
        return Promise.resolve(audioFilesToPlay);
    }

    function errorCallback(err) {
        return Promise.reject(err);
    }
}


function getTeamCityAudioFile(scoreChange) {
    var teamCity = scoreChange.split(':')[0].toLowerCase();
    return fs.readFileAsync('src/server/utils/nfl-team-mapping.json', 'utf8')
        .then(successFn)
        .catch(handleError);

    function successFn(result) {
        result = JSON.parse(result);
        var team = result.filter(function (obj) {
            return (obj && obj.abr && obj.abr.toLowerCase() === teamCity);
        });
        var removeSpaces = team[0].city.toLowerCase().split(" ").join("");
        var sanitizedCityName = removeSpaces.toLowerCase().split(".").join("");
        return Promise.resolve(sanitizedCityName);
    }

    function handleError(err) {
        console.log(err);
        return Promise.resolve(err);
    }
}

function getTeamScoreChangeAudioFile(scoreChange) {
    var result = [];
    var rawScoreTerm = scoreChange.split(':')[1];
    if (rawScoreTerm.indexOf('+') > -1) {
        // for scenarios such as touchdown + extra point
        result.push.apply(result, rawScoreTerm.split('+'));
    } else {
        result.push(rawScoreTerm);
    }
    return result;
}

function getTeamNameAudioFile(scoreChange) {
    return scoreChange.split(':')[2];
}
