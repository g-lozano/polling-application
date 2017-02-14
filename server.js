require('dotenv').config()
var express = require('express')
var mongo = require('mongodb')
var bodyParser = require("body-parser")
var bcrypt = require('bcrypt')
const saltRounds = 10

var app = express()

var dbUrl = process.env.MONGO_URL

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

app.use(express.static('public'))

var temp = false;

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/public/login.html')
})

app.post('/login', function(req, res) {

    if (req.body.username && req.body.password) {
        mongo.connect(dbUrl, function(err, db) {
            if (err) throw err
            else {
                var doc = db.collection('pa-users')
                doc.find({
                    username: req.body.username,
                }, {
                    _id: 0
                }).toArray(function(err, docs) {
                    if (err) throw err
                    else if (docs.length == 1) {
                        bcrypt.compare(req.body.password, docs[0].hash).then(function() {
                            res.status(200).json(docs) 
                        })
                    }
                    else {
                        res.status(500).json({error: 'not found'})
                    }
                })
            }
            db.close();
        })
    }
    else
        res.status(500)
})

app.post('/signup', function(req, res) {

    if (req.body.username && req.body.password) {
        mongo.connect(dbUrl, function(err, db) {
            if (err) throw err
            else {
                var doc = db.collection('pa-users')
                doc.find({
                    username: req.body.username,
                }, {
                    _id: 0
                }).toArray(function(err, docs) {
                    if (err) throw err
                    else if (docs.length == 1) { //
                        res.send({
                            success: false
                        })
                    }
                    else {

                        bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
                            var userinfo = {
                                username: req.body.username,
                                hash: hash,
                                polls: []
                            }

                            doc.insert(userinfo, function(err, data) {
                                if (err) throw err
                                res.send({
                                    success: true
                                })
                            })
                        })

                        .then(function(data) {
                            db.close()
                        })
                    }
                })
            }
        })
    }
    else
        res.status(500)
})

app.get('/api/polls', function(req, res) {
    if (req.query.type == "all") {

    }
    else if (req.query.type == 'user') {
        res.send('send user\'s polls')
    }
    else {
        res.send('no parameters')
    }
})

// app.get('*', function(req, res) {

// })

app.listen(process.env.PORT)
