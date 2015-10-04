
var util = require('util');

module.exports = {
    determineScoreChangeAudio: determineAllScoreChangeAudio
};

function determineAllScoreChangeAudio (scoreChanges) {
    var allAudioFilesToPlay = [];
    for (var i = 0; i < scoreChanges.length; i++) {
        var gameScoreChangeAudio = determineScoreChangeAudio(scoreChanges[i]);
        allAudioFilesToPlay.push.apply(allAudioFilesToPlay, gameScoreChangeAudio);
    }
    return allAudioFilesToPlay;
}

function determineScoreChangeAudio (scoreChange) {
    // TODO: make it configurable what voice is used
    var audioFileMainUrl = 'http://www.myfantasyleague.com/sounds/shouty/';
    var audioFilesToPlay = [];
    var teamCityToPlay = getTeamCityAudioFile(scoreChange);
    var teamScoreToPlay = getTeamScoreChangeAudioFile(scoreChange);
    var teamNameToPlay = getTeamNameAudioFile(teamCityToPlay);
    
    for (var i = 0; i < teamScoreToPlay.length; i++) {
        audioFilesToPlay.push(audioFileMainUrl + teamScoreToPlay[i] + '.wav');
    }
    audioFilesToPlay.push(audioFileMainUrl + teamCityToPlay + teamNameToPlay + '.wav');
    
    return audioFilesToPlay;
}

function getTeamCityAudioFile (scoreChange) {
    var teamCity = scoreChange.split(':')[0].toLowerCase();
    if (teamCity.indexOf('ny ') > -1) {
        // for new york jets and giants
        teamCity = teamCity.replace('ny ', 'newyork');
    }
    teamCity = teamCity.replace(' ', '');
    teamCity = teamCity.replace('.', ''); // for St. Louis
    return teamCity;
}

function getTeamScoreChangeAudioFile (scoreChange) {
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

function getTeamNameAudioFile (teamCity) {
    /*jshint maxcomplexity:33 */
    var teamName = '';
    var lowerCaseCityName = teamCity.toLowerCase();
    switch (lowerCaseCityName) {
        case 'arizona':
            teamName = 'cardinals';
            break;
        case 'atlanta':
            teamName = 'falcons';
            break;
        case 'baltimore':
            teamName = 'ravens';
            break;
        case 'buffalo':
            teamName = 'bills';
            break;
        case 'carolina':
            teamName = 'panthers';
            break;
        case 'chicago':
            teamName = 'bears';
            break;
        case 'cincinnati':
            teamName = 'bengals';
            break;
        case 'cleveland':
            teamName = 'browns';
            break;
        case 'dallas':
            teamName = 'cowboys';
            break;
        case 'denver':
            teamName = 'broncos';
            break;
        case 'detroit':
            teamName = 'lions';
            break;
        case 'greenbay':
            teamName = 'packers';
            break;
        case 'houston':
            teamName = 'texans';
            break;
        case 'indianapolis':
            teamName = 'colts';
            break;
        case 'jacksonville':
            teamName = 'jaguars';
            break;
        case 'kansascity':
            teamName = 'chiefs';
            break;
        case 'miami':
            teamName = 'dolphins';
            break;
        case 'minnesota':
            teamName = 'vikings';
            break;
        case 'newengland':
            teamName = 'patriots';
            break;
        case 'neworleans':
            teamName = 'saints';
            break;
        case 'newyorkgiants':
            teamName = '';//already set in city parsing
            break;
        case 'newyorkjets':
            teamName = '';//already set in city parsing
            break;
        case 'oakland':
            teamName = 'raiders';
            break;
        case 'philadelphia':
            teamName = 'eagles';
            break;
        case 'pittsburgh':
            teamName = 'steelers';
            break;
        case 'sandiego':
            teamName = 'chargers';
            break;
        case 'sanfrancisco':
            teamName = '49ers';
            break;
        case 'seattle':
            teamName = 'seahawks';
            break;
        case 'stlouis':
            teamName = 'rams';
            break;
        case 'tampabay':
            teamName = 'buccaneers';
            break;
        case 'tennessee':
            teamName = 'titans';
            break;
        case 'washington':
            teamName = 'redskins';
            break;
        default:
            console.log('Team Name could not be determined for city: ', teamCity);
            break;
    }
    return teamName;
}
