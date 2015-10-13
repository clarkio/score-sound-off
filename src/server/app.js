/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var moment = require('moment');
var port = process.env.PORT || 8001;
var four0four = require('./utils/404')();
var scoreCalculator = require('./utils/score-calculator');
var scoreAudio = require('./utils/score-audio');

var environment = process.env.NODE_ENV;

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

app.use('/api', require('./routes'));

var scoresService = require('./scores-service');
var intervalInSeconds = 10;
var endInterval = false;
var gameData = [];

var util = require('util');
scoresService.retrieveSportsData('nfl')
    .then(function (result) {
        gameData = result;
        console.log('Original game data', util.inspect(result, false, null));
    });
// scoresService.retrieveSportsData('ncf');

var scoresUpdateIntervalId = setInterval(function () {
    checkNflScores();
}, intervalInSeconds * 1000);

function checkNflScores() {
    console.log(moment().format('MM-DD-YYYY h:mm:ss:SSS a') + ': begin update of NFL data');
    scoresService.retrieveSportsData('nfl')
        .then(function (result) {
            var scoreChanges = scoreCalculator.determineScoreChanges(gameData, result);

            if (scoreChanges.length) {
                console.log('Score changed:' + scoreChanges);
                gameData = result;
                io.emit('NFL-ALL-UPDATE', result);
                scoreAudio.determineScoreChangeAudio(scoreChanges)
                    .then(function (scoreChangeAudio) {
                        console.log('scoreChangeAudio changed:' + scoreChangeAudio.length);
                        if (scoreChangeAudio) {
                            io.emit('NFL-SCORE-CHANGE', scoreChangeAudio);
                        }
                        console.log(moment().format('MM-DD-YYYY h:mm:ss:SSS a') + ': end update of NFL data', '\n----------');
                        if (endInterval) {
                            clearInterval(scoresUpdateIntervalId);
                        }
                    })
                    .catch(function(err){
                        console.log('checkNflScores()', err);
                    });
            }
            else {
                console.log(moment().format('MM-DD-YYYY h:mm:ss:SSS a') + ': end update of NFL data', '\n----------');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function checkNcfScores() {
    // var ncfScoresUpdateIntervalId = setInterval(function () {
    //     console.log(moment().format('MM-DD-YYYY h:mm:ss:SSS a') + ': begin update of NCF data');
    //     scoresService.retrieveSportsData('ncf')
    //         .then(function (result) {
    //             io.emit('NCF-ALL-UPDATE', result);
    //             console.log(moment()
    //                  .format('MM-DD-YYYY h:mm:ss:SSS a') + ': end update of NCF data', '\n----------');
    //             if (endInterval) {
    //                 clearInterval(ncfScoresUpdateIntervalId);
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }, 10000);
}

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        // app.use('/app/*', function(req, res, next) {
        //     four0four.send404(req, res);
        // });
        // Any deep link calls should return index.html
        // app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        // app.use(express.static('./tmp'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        // app.use('/app/*', function(req, res, next) {
        //     four0four.send404(req, res);
        // });
        // Any deep link calls should return index.html
        // app.use('/*', express.static('./src/client/index.html'));
        // app.use('/socket.io/*',
        //     express.static('./node_modules/socket.io/node_modules/socket.io-client/socket.io.js'))
        break;
}

server.listen(port, function () {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});
