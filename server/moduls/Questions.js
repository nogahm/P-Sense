var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var DButilsAzure = require('../DButil');

router.get('/Pictures/:picId', function (req, res) {
    var picId = req.params.picId;
    DButilsAzure.execQuery("SELECT pictureUrl FROM Pictures WHERE picId='"+picId+"'").then(function (result) {
        res.send(result).catch(function (err) { res.status(400).send(err); });
    });
});

router.get('/Sentences/:sentenceId', function (req, res) {
    var sentenceId = req.params.sentenceId;
    DButilsAzure.execQuery("SELECT sentenceText FROM Sentences WHERE sentenceId='"+sentenceId+"'").then(function (result) {
        res.send(result).catch(function (err) { res.status(400).send(err); });
    });
});

router.get('/getQuestionId/:picSentenceId', function (req, res) {
    var picSentenceId = req.params.picSentenceId;
    DButilsAzure.execQuery("SELECT qId FROM QuestionId WHERE picSentenceId='"+picSentenceId+"'").then(function (result) {
        res.send(result).catch(function (err) { res.status(400).send(err); });
    });
});

router.get('/getQuestionsAnswers', function (req, res) {
    var qIds = req.body.qIds;
    var stringID="";
    for(let i=0;i<qIds.length-1;i++){
        stringID+=qIds[i]+" OR picSentenceId= ";
    }
    stringID+=qIds[i];
    DButilsAzure.execQuery("SELECT * FROM QuestionId WHERE picSentenceId='"+stringID+"'").then(function (result) {
        res.send(result).catch(function (err) { res.status(400).send(err); });
    });
});

router.get('/getRandomQuestions/:n', function (req, res) {
    var n = req.params.n;
    DButilsAzure.execQuery("SELECT * FROM QuestionId").then(function (result) {
        if (result.length==0)
            res.status(400).send();
        else {
            var size = result.length;
            if(size<=3)
            {
                res.send(result);
            }
            var rand1 = Math.floor((Math.random() * size));
            var rand2 = Math.floor((Math.random() * size));
            while (rand2 == rand1) {
                var rand2 = Math.floor((Math.random() * size));
            }
            var rand3 = Math.floor((Math.random() * size));
            while (rand3 == rand1 || rand3 == rand2) {
                var rand3 = Math.floor((Math.random() * size));
            }
            var ans = {};
            ans[0] = result[rand1];
            ans[1] = result[rand2];
            ans[2] = result[rand3];
            res.send(ans);
        }
        res.send(result);
    }).catch(function (err) { res.status(400).send(err); });
});

module.exports = router;