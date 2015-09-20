
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    parseScores: parseScores
};

function parseScores(data, sport) {
    return new Promise(function (resolve, reject) {
        var rawEventItems = data.match(/left([^&;]+)/g);
        cleanTheData(rawEventItems);
        var parsedEvents = parseIntoFootballEvents(rawEventItems);
        
        resolve(parsedEvents);
    });
}

function cleanTheData (array) {
    array.forEach(function (item, index) {
        // Game info starts after '=', clean up %20 between strings and add a | between teams
        // console.log('line item', item);
        var replaceItem = '   ';
        if (item.indexOf('%20at%20') > -1) {
            replaceItem = ' at ';
        } else {
            replaceItem = '   ';
        }
        // console.log('replace item = ', replaceItem);
        array[index] = item.substring(item.indexOf('=') + 1).replace(/%20/g, ' ').replace(replaceItem, '|');
    });
}

function parseIntoFootballEvents (rawData) {
    var result = [];
    rawData.forEach(function (item, index) {
        result.push(parseIntoFootballEvent(item, index));
    });
    return result;
}

function parseIntoFootballEvent (data, index) {
    var event = {};
    var homeTeamParse = true;
    var awayTeamParse = false;
    
    event = parseFootballEventTime(data);
    event.id = index + 1;
    event.competitors = [];
    event.competitors.push(parseCompetitor(data, homeTeamParse));
    event.competitors.push(parseCompetitor(data, awayTeamParse));
    
    determineEventWinner(event);
    
    return event;
}

function parseFootballEventTime (data) {
    var time = {
        period: '',
        clock: '',
        status: '',
        summary: ''
    };
    
    var rawTimeData = data.split('(').pop().split(')').shift();
    if (rawTimeData.indexOf('IN 1ST') > -1 || rawTimeData.indexOf('IN 2ND') > -1 || 
            rawTimeData.indexOf('HALFTIME') > -1 || rawTimeData.indexOf('IN 3RD') > -1 || 
            rawTimeData.indexOf('IN 4TH') > -1 && rawTimeData.indexOf('00:00 IN 4TH') < 0) {
        console.log(rawTimeData);
        time.status = 'in';
        checkIfHalftimeFound(rawTimeData, time);
        var summaryTense = determineSummaryTense(time.period);
        time.summary = time.clock + ' - ' + time.period + summaryTense; 
    } else if (rawTimeData.indexOf('FINAL') > -1 || rawTimeData === 'END OF 4TH' || 
            rawTimeData === '00:00 IN OT' || rawTimeData === '00:00 IN 2OT' ||
            rawTimeData.indexOf('00:00 IN 4TH') > -1) {
        time.status = 'post';
        time.period = '4';
        time.clock = '0:00';
        time.summary = 'Final';
    } else {
        time.status = 'pre';
        time.period = '0';
        time.clock = '0:00';
        // rawTimeData should contain the time of the event in ET (ex: 8:30 PM ET)
        time.summary = rawTimeData.replace('(','').replace(')','');
    }
    
    return time;
}

function parseCompetitor (data, isHomeTeam) {
    var competitor = {};
    competitor.id = '';
    competitor.homeAway = isHomeTeam ? 'home' : 'away';
    competitor.winner = false; // calculated later
    
    var indexToTake = isHomeTeam ? 1 : 0;
    var teamString = data.split('|');
    if (!teamString) {
        console.log('data does not contain |', data);
    } else {
        teamString = teamString[indexToTake];
    }
    
    if (isHomeTeam) {
        teamString = teamString.split(' (')[0];
        competitor.score = teamString.substring(teamString.length - 2);
    } else {
        competitor.score = teamString.substring(teamString.length - 2);
    }
    
    if (competitor.score && competitor.score >= 0) {
        competitor.name = teamString.split(competitor.score)[0].trim().replace('^', '');
    } else {
        competitor.score = 0;
        competitor.name = teamString;
    }
    competitor.score = parseInt(competitor.score);
    
    return competitor;
}

function determineEventWinner (event) {
    if (event.status === 'post') {
        if (event.competitors[0].score > event.competitors[1].score) {
            event.competitors[0].winner = true;
            event.competitors[1].winner = false;
        } else if (event.competitors[0].score === event.competitors[1].score) {
            event.competitors[0].winner = false;
            event.competitors[1].winner = false;
        } else {
            event.competitors[0].winner = false;
            event.competitors[1].winner = true;
        }
    }
}

function determineSummaryTense (period) {
    var tense;
    
    switch (period) {
        case '1':
            tense = 'st';
            break;
        case '2':
            tense = 'nd';
            break;
        case '3':
            tense = 'rd';
            break;
        case '4':
            tense = 'th';
            break;
        default:
            tense = '';
            break;
    }
    
    return tense;
}

function checkIfHalftimeFound (rawTimeData, time) {
    if (rawTimeData.indexOf('HALFTIME') > -1) {
        time.period = '2';
        time.clock = '0:00';
    } else {
        time.period = rawTimeData.substring(rawTimeData.length - 3, rawTimeData.length - 2);
        time.clock = rawTimeData.substring(0, 5);
    }
}
