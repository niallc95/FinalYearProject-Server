var express = require("express");
var logfmt = require("logfmt");
var mongoose = require('mongoose');
var config = require("./config");
var User = require('./models/user');
var Item = require('./models/item');
var bodyParser = require('body-parser');
var moment = require('moment');
var app = express();
mongoose.connect(config.mongoUri);

app.use(logfmt.requestLogger());
app.use(bodyParser());

app.get('/', function (req, res) {
    res.json("Welcome to the hoarder server!");
});
//##########################################################################################
//                                Payment
//##########################################################################################

app.post('/payment', function (req, res) {
    var payment = {
        "amount": req.body.amount,
        "description": "Hoarder payment",
        "card": {
            "expMonth": req.body.card.expMonth,
            "expYear": req.body.card.expYear,
            "cvc": req.body.card.cvc,
            "number": req.body.card.number
        },
        "currency": "EUR"
    };
    config.SimplifyPay.payment.create(payment, function (errData, data) {
        if (errData) {
            console.log(errData);
            console.log(data);
            res.json({code: "400", message: errData.data.error.fieldErrors});
            console.log(errData.data.error.fieldErrors);
            console.error("Error Message: " + errData.data.error.message);
            // handle the error
            return;
        }
        else {
            res.json({code: "200", message: "Payment Successful"})
        }
        console.log("Payment Status: " + data.paymentStatus);
    });
});

//##########################################################################################
//                                User Creation
//##########################################################################################

// creation of user
app.post('/user', function (req, res) {
    var user = new User();
    if (!req.body.email || !req.body.password || !req.body.name) {
        var error_message = {
            code: '400',
            message: 'You must have a valid email along with a password and name to create an account!'
        };
        res.send(error_message);
    } else {
        User.find({email: req.body.email}, function (err, users) {	// Check users in the DB for the same email
            if (users.length > 0) {
                res.json({code: '400', message: 'E-mail already exists!'});
            } else {
                user.name = req.body.name;
                user.password = req.body.password;
                user.email = req.body.email;
                user.phoneNumber = req.body.phoneNumber;
                user.address = req.body.address;


                user.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({code: "200", message: 'User account created successfully'});
                });
            }
        });
    }
});

//##########################################################################################
//                                Login
//##########################################################################################

app.post('/login', function (req, res) {
    if (!req.body.password || !req.body.email) {
        res.json({code: "400", message: "You must have a valid email and password"});
    } else {
        console.log(req.body);

        User.find({email: req.body.email, password: req.body.password}, function (err, users) {
            if (err) {
                res.json({code: "502", message: "Cannot connect to the database!"});
            } else {
                if (users.length == 1) {
                    //successful login response
                    if (req.body.password == users[0].password) {
                        res.json({code: "200", message: "Welcome back " + users[0].name});
                    } else {
                        res.json({code: "401", message: "Not allowed!"});
                    }
                } else {
                    res.json({message: "No account found with those credentials!"});
                }
            }
        });
    }
});

//##########################################################################################
//                                Find user by email
//##########################################################################################

app.param('email', function(req, res, next, email) {
    req.email = email;
    next();
});

app.get('/api/users/:email', function(req, res) {
     var user = new User();
     user.email = req.email; 
     User.find({email: user.email}, function (err, users){
        if(users.length > 0){
            res.json(users);
        }
        else{
            res.json({message: 'There is no product with this barcode in our system. We apologise for any inconvenience!!'});
        }
    });
//##########################################################################################
//                                Add item to catalogue
//##########################################################################################

app.post('/addItem', function (req, res) {
    var item = new Item();
    if (!req.body.productName||!req.body.productPrice||!req.body.scanContent) {
        var error_message = {
            code: '400',
            message: 'Invalid product. Please try again'
        };
        res.send(error_message);
    } else {
        Item.find({productName: req.body.productName}, function (err, items) {
            if (items.length > 0) {
                res.json({code: '400', message: 'product is already registered'});
            } else {
                item.productName = req.body.productName;
                item.productPrice = req.body.productPrice;
                item.scanContent = req.body.scanContent;
                item.productCategory = req.body.productCategory;


                item.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({code: "200", message: 'Product successfully added to catalogue!!'});
                });
            }
        });
    }
});

//##########################################################################################
//                                Find item by barcode
//##########################################################################################

app.post('/findItem', function (req, res) {
    var item = new Item();

    item.scanContent = req.body.scanContent;

    Item.find({scanContent: item.scanContent}, function (err, items){
        if(items.length > 0){
            res.json(items);
        }
        else{
            res.json({message: 'There is no product with this barcode in our system. We apologise for any inconvenience!!'});
        }
    });
});

//##########################################################################################
//                                Server Port Config
//##########################################################################################

var port = Number(process.env.PORT || 4000);
app.listen(port, function () {
    console.log("Listening on " + port);
});
