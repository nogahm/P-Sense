var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var DButilsAzure = require('../DButil');

//login -get user information from server - use POST because GET is not secured.

router.post('/login', function (req, res) {
    var name = req.body.userName;
    var password = req.body.password;

    DButilsAzure.execQuery("Select * from Users where userName = '" + name + "' AND password = '" + password + "'").then(function (result) {
        if (result.length > 0) {

            var payload = {
                UserName: name,
                Password: password
            }

            var token = jwt.sign(payload, secret, {
                expiresIn: "1d"
            });
            res.json({
                success: true,
                massage: 'enjoy your token!',
                token: token
            });
            res.send("connectionSSSSSSSSS");

        }
        else {
            res.send("connection failed");
        }
    }).catch(function (err) { res.status(400).send(err); });
});


//register-save new user record in server.

router.post('/register', function (req, res) {     //Add User
    // console.print("aaaa");
    var userName = req.body.userName;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var age = req.body.age;
    var gender = req.body.gender;
    var email = req.body.email;

    
    query1 = "INSERT INTO Users VALUES ('"
        + userName + "','" + password + "','" + firstName + "','" + lastName + "','" + age + "','" + gender + "','" + email  + "')";

    DButilsAzure.execQuery(query1).then(function (result) {
        // console.print(result);
        res.send(true);
    }).catch(function (err) {
        res.status(400).send(err);
    });
});

//get user info {username, firstName, lastName, age, gender, email}
router.get('/Reginfo', function (req, res) {
    var userName = req.params.userName;
    DButilsAzure.execQuery("SELECT a.username, a.firstName, a.lastName, a.age, a.gender, a.email FROM Users a WHERE userId='"+userId+"'")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

//NotRegUser - save new not registered user and return userId
//firsName, lastName, age, gender, email
router.post('/NotRegUser', function (req, res) {     //Add User

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var age = req.body.age;
    var gender = req.body.gender;
    var email = req.body.email;
    var hand = req.body.hand;

    //create userId
    var userId=0;
    query1 = "SELECT MAX(userId) as maxId FROM NotRegUsers";
    DButilsAzure.execQuery(query1).then(function (result) {

        if(result.length>0)
        {
            userId=result[0].maxId+1;
            console.log(userId);
        }
        console.log(userId);
        query1 = "INSERT INTO NotRegUsers VALUES ('" +userId+"','"+ firstName + "','" + lastName + "','" + age + "','" + gender + "','" + email  + "','" + hand  + "')";
    
        DButilsAzure.execQuery(query1).then(function (result) {
            res.send(userId+"");
           
        }).catch(function (err) {
            res.status(400).send(err);
        });
    }).catch(function (err) {
        res.status(400).send(err);
    });
   
});




//return user email in order to send him a mail with his password
router.post('/passwordRecovery', function (req, res) {    
    var userName = req.body.userName;
    console.log(userName);
    query1 = "SELECT a.email FROM Users a WHERE userName='"+userName+"'";
    DButilsAzure.execQuery(query1).then(function (result) {  
        console.log(result[0]);
        res.send(result[0]);
    }).catch(function (err) {
        res.status(400).send(err);
    });
});

module.exports = router;