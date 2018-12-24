var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var DButilsAzure = require('../DButil');


/*----------------------------------------------------------------------------------------------------------------*/
//login
router.post('/login', function (req, res) {
    var name = req.body.userName;
    var password = req.body.password;

    DButilsAzure.execQuery("Select * from Users where UserName = '" + name + "' AND Password = '" + password + "'").then(function (result) {
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
        }
        else {
            res.send("connection failed");
        }
    }).catch(function (err) { res.status(400).send(err); });
});
/*----------------------------------------------------------------------------------------------------------------*/

//register
router.post('/register', function (req, res) {     //Add User
    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var age = req.body.age;
    var country = req.body.Country;
    var email = req.body.email;
    var gender = req.body.gender;
    
    query1 = "INSERT INTO Users VALUES ('"
        + username + "','" + password + "','" + firstName + "','" + lastName + "','" + age + "','" + gender + "','" + email  + "')";

    DButilsAzure.execQuery(query1).then(function (result) {
    }).catch(function (err) {
        res.status(400).send(err);
    });
});


/*----------------------------------------------------------------------------------------------------------------*/
//get user info {username, firstName, lastName, age, gender, email}
router.get('/Reginfo', function (req, res) {
    var userId = req.params.userId;
    DButilsAzure.execQuery("SELECT a.username, a.firstName, a.lastName, a.age, a.gender, a.email FROM Users a WHERE userId='"+userId+"'")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});


/*----------------------------------------------------------------------------------------------------------------*/
//save new not registered user and return userId
firsName, lastName, age, gender, email
router.post('/NotRegUser', function (req, res) {     //Add User
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var age = req.body.age;
    var country = req.body.Country;
    var email = req.body.email;
    var gender = req.body.gender;
    
    query1 = "INSERT INTO NotRegUsers VALUES ('" + firstName + "','" + lastName + "','" + age + "','" + gender + "','" + email  + "')";

    DButilsAzure.execQuery(query1).then(function (result) {
       
    }).catch(function (err) {
        res.status(400).send(err);
    });
});


/*----------------------------------------------------------------------------------------------------------------*/
//GET not register user info {firsName, lastName, age, gender, email}
router.get('/NotRegUser', function (req, res) {
    var userId = req.params.userId;
    DButilsAzure.execQuery("SELECT a.firstName, a.lastName, a.age, a.gender, a.email FROM NotRegUsers a  WHERE userId='"+userId+"'"")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

//return user email in order to send him a mail with his password
router.get('/NotRegUser', function (req, res) {
    var userId = req.params.userId;
    DButilsAzure.execQuery("SELECT a.email FROM NotRegUsers a  WHERE userId='"+userId+"'"")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});