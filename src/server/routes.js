var router = require('express').Router();
var four0four = require('./utils/404')();
var scoresService = require('./scores-service');
var util = require('util');

router.get('/nfl/games', getNFLGames);
router.get('/ncf/games', getNCFGames);
router.get('/nfl/games/:id', getNFLGame);
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////

function getNFLGames(req, res, next) {
    scoresService.retrieveSportsData('nfl')
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (error) {
            res.status(500).send(error);
        });
}

function getNCFGames(req, res, next) {
    scoresService.retrieveSportsData('ncf')
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (error) {
            res.status(500).send(error);
        });
}

function getNFLGame(req, res, next) {
    var id = +req.params.id;
    var nflGame = data.nflGames.filter(function(p) {
        return p.id === id;
    })[0];

    if (nflGame) {
        res.status(200).send(nflGame);
    } else {
        four0four.send404(req, res, 'NFL Game ' + id + ' not found');
    }
}
