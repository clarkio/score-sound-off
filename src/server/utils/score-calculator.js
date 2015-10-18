var util = require('util');
var _ = require('lodash');
var jsondiffpatch = require('jsondiffpatch').create({
    arrays: {
        // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
        detectMove: true,
        // default false, the value of items moved is not included in deltas
        includeValueOnMove: false
    },
    textDiff: {
        // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
        minLength: 60
    }
});

module.exports = {
    determineScoreChanges: determineScoreChanges
};

function determineScoreChanges (originalScores, newScores) {
    var result = jsondiffpatch.diff(originalScores, newScores);
    var fullScoreChanges = [];
    console.log('The difference found:', util.inspect(result, false, null));
    if (result) {
        _.forEach(result, function (scoreDiffValue, key) {
            // Ignore the jsondiffpatch libraries '_t' notation/object
            if (key !== '_t') {
                checkAndPushScoreChangeForCompetitor(0, scoreDiffValue, newScores, key, fullScoreChanges);
                checkAndPushScoreChangeForCompetitor(1, scoreDiffValue, newScores, key, fullScoreChanges);
                console.log(fullScoreChanges);
            }
        });
    } else {
        console.log('No score changes found');
    }
    
    return fullScoreChanges;
}

function checkAndPushScoreChangeForCompetitor (competitor, scoreDiff, newScores, key, fullScoreChanges) {
    // checking and pushing because I don't want to push 'undefined' to the full list...
    // and because it makes the 'determineScoreChanges' function look cleaner...
    // and because I'm lazy
    var teamName;
    var scoreChange;
    var fullScoreChange;
    if (scoreDiff.competitors && scoreDiff.competitors[competitor] && scoreDiff.competitors[competitor].score) {
        var team = scoreDiff.competitors[competitor];
        console.log('competitor ' + competitor + ' score change');
        teamName = newScores[key].competitors[competitor].name;
        scoreChange = getScoreDifferenceTerm(team.score[0], team.score[1]);
        
        if (scoreChange) {
            fullScoreChange = teamName + ':' + scoreChange;
            fullScoreChanges.push(fullScoreChange);
        }
    }
}

function getScoreDifferenceTerm (oldScore, newScore) {
    var diff = newScore - oldScore;
    console.log('score changed by: ', diff);
    var scoreTerm;
    if (diff > 0) {
        switch (diff) {
            case 6:
                scoreTerm = 'touchdown';
                break;
            case 1:
                scoreTerm = 'extrapoint';
                break;
            case 3:
                scoreTerm = 'fieldgoal';
                break;
            case 2:
                // TODO: need to determine if it's 2 point conversion somehow
                scoreTerm = 'safety';
                break;
            case 7:
                scoreTerm = 'touchdown+extrapoint';
                break;
            case 8:
                //shouty only has 2pointconversionpass and 2pointconversionrush
                scoreTerm = 'touchdown+2pointconversionpass';
                break;
            default:
                scoreTerm = undefined;
                break;
        }
    }
    
    return scoreTerm;
}
