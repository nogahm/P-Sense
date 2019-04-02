var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var DButilsAzure = require('../DButil');

// const secret = "ilanaKarin";

//add registered user test
/*router.post('/Reg/AddAnswers', function (req, res) {     //Add User
    var userName = req.body.userName;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var answers = req.body.answers;
    // var happyLevel = req.body.happyLevel;
    // var calmLevel = req.body.calmLevel;
    // var bpSYS = req.body.bpSYS;
    // var bpDIA = req.body.bpDIA;
    // var pulse = req.body.pulse;

    //create testId
    var testId=0;
    query1 = "SELECT MAX(testId) FROM RegUserTest";
    DButilsAzure.execQuery(query1).then(function (result) {
        if(result.length>0)
            testId=result[0].testId+1;
        else
            testId=0;
    }).catch(function (err) {
        res.status(400).send(req.body);
    });


    query2 = "INSERT INTO RegUserTest VALUES ('"
        + testId + "','"+ userName + "','" + startTime + "','" + endTime + "','" + happyLevel + "','" + calmLevel + "','" + bpSYS + "','" + bpDIA + "','" + pulse + "')";

    DButilsAzure.execQuery(query2).then(function (result) {
        for (var i = 0; i < answers.length; i++) {
            DButilsAzure.execQuery("insert into RegUserAnswer values ('" + testId + "', '" + answers[i].qId +"', '" + answers[i].answer + "')").then(function (result) {
                res.send(true)
            }).catch(function (err) { res.status(400).send(err); });
        }
    }).catch(function (err) {
        res.status(400).send(err);
    });
});*/

//add not-registered user test
router.post('/NotReg/AddAnswers', function (req, res) {     //Add User
    var userId = req.body.userId;
    var startTime= req.body.startTime;
    var endTime = req.body.endTime;
    var answers = req.body.answers;
    // var happyLevel = req.body.happyLevel;
    // var calmLevel = req.body.calmLevel;
    // var bpSYS = req.body.bpSYS;
    // var bpDIA = req.body.bpDIA;
    // var pulse = req.body.pulse;
    var x=0;
    //create testId
    var testId=0;
    query = "SELECT MAX(testId) as testId FROM UserTest";
    DButilsAzure.execQuery(query).then(function (result) {
        if(result.length>0)
            testId=result[0].testId+1;
        else
            testId=0;
        query1 = "INSERT INTO UserTest VALUES ('"+ testId + "', '"+ userId + "', '" + startTime + "', '" + endTime +"')";
    
        DButilsAzure.execQuery(query1).then(function (result2) {
            for (var i = 0; i < answers.length; i++) {
                DButilsAzure.execQuery("insert into UserAnswer values ('" + testId + "', '" + answers[i].qId +"', '" + answers[i].answer+"', '" + x + "')").then(function (result3) {
                    res.send(true)
                }).catch(function (err) { res.status(400).send(err+"3333333"); });
            }
        }).catch(function (err) {
            res.status(400).send(err+"2222222222222");
        });
    }).catch(function (err) {
        res.status(400).send(err+"111111111111");
    });

    
});



//add not-registered user test
router.post('/NotReg/Report', function (req, res) {     //Add User
    var userId = req.body.userId;
    var happyLevel = req.body.happyLevel;
    var calmLevel = req.body.calmLevel;
    var bpSYS = req.body.bpSYS;
    var bpDIA = req.body.bpDIA;
    var pulse = req.body.pulse;

    //create testId
    var reportId=0;
    query = "SELECT MAX(reportId) as reportId FROM Report";
    DButilsAzure.execQuery(query).then(function (result) {
        if(result.length>0)
            reportId=result[0].reportId+1;
        else
            reportId=0;
        query1 = "INSERT INTO Report VALUES ('"
            + reportId + "','"+ userId + "','" + happyLevel+ "','" + calmLevel + "','" + bpSYS + "','" + bpDIA + "','" + pulse  +"')";

        DButilsAzure.execQuery(query1).then(function (result2) {
            res.send(true)
            }).catch(function (err) {
                res.status(400).send(err);
            });
    }).catch(function (err) {
        res.status(400).send(err);
    });

    
});
module.exports = router;