require('dotenv').config()
var express = require('express')
var mongo = require('mongodb')
var bodyParser = require("body-parser")
var bcrypt = require('bcrypt')
var session = require('express-session');

const saltRounds = 10

var app = express()

var dbUrl = process.env.MONGO_URL

function generateID(callback) {
    var charCount = 12;
    var str = []
    var x = ''
    for (var i = 0; i < charCount; i++) {
        switch (Math.floor(Math.random() * (3))) {
            case 0: //number
                x = Math.random() * (57 - 48) + 48
                str.push(String.fromCharCode(x))
                break
            case 1: //uppercase
                x = Math.random() * (90 - 65) + 65
                str.push(String.fromCharCode(x))
                break
            case 2: //lowercase
                x = Math.random() * (122 - 97) + 97
                str.push(String.fromCharCode(x))
                break
        }
    }
    str = str.join('')
    mongo.connect(dbUrl, function(err, db) {
        if (err) throw err
        
        var doc = db.collection('pa-polls')
        doc.find({
            id: str
        }).toArray(function(err, poll) {
            if (err) throw err
            else if (poll.length == 1)
                generateID() //generate new id if current id exists
            else
                callback(str)
        })
        
        db.close()
    })
}

function insertPollData(pollData) {
    mongo.connect(dbUrl, function(err, db) {
        if (err) throw err

        var doc = db.collection('pa-polls')
        doc.insert(pollData, function(err, data) {
            if (err) throw err
        })
    })
}

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/poll', function(req, res) {
    res.sendFile(__dirname + '/public/poll.html')
})

app.post('/login', function(req, res) {

    if (req.body.username && req.body.password) {
        mongo.connect(dbUrl, function(err, db) {
            if (err) throw err
            else {
                var doc = db.collection('pa-users')
                doc.find({
                    username: req.body.username
                }, {
                    _id: 0
                }).toArray(function(err, docs) {
                    if (err) throw err
                    
                    if (docs.length == 1) {
                        bcrypt.compare(req.body.password, docs[0].hash).then(function() {
                            req.session.username = req.body.username
                            res.status(200).json(docs)
                        })
                    }
                    else {
                        res.status(500).json({
                            error: 'not found'
                        })
                    }
                })
            }
            db.close();
        })
    }
    else
        res.status(500)
})

app.post('/logout', function(req, res) {
    req.session.destroy()
    res.status(200).json({
        msg: 'successfully logged out'
    })
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
                    
                    if (docs.length == 1) {
                        res.send({
                            success: false
                        })
                    }
                    else {

                        bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
                            var userinfo = {
                                username: req.body.username,
                                hash: hash
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

app.post('/check_user', function(req, res) {
    if (req.body.username == req.session.username)
        res.status(200).json({
            msg: 'user authorized'
        })
    else
        res.status(500).json({
            msg: 'user not authorized'
        })
})

app.post('/api/polls', function(req, res) {
    if (req.body.type == "all") {

    }
    else if (req.body.type == 'user') {
        
        mongo.connect(dbUrl, function(err, db) {
            if (err) throw err
            else {
                var doc = db.collection('pa-polls')
                doc.find({
                    username: req.body.username
                }, {
                    _id: 0
                }).toArray(function(err, docs) {
                    if (err) throw err
                    
                    if (docs.length > 0) {
                       res.status(200).json(docs)
                    }
                    else {

                    }
                })
            }
            db.close()
        })
        
        
    }
    else if (req.body.type == 'insert') {
        generateID(function(id) {
            var pollData = {
                id: id,
                username: req.body.username,
                title: req.body.title,
                options: req.body.options
            }
            insertPollData(pollData)
            res.status(200).json({
                id: id
            })
        })
    }
    else if (req.body.poll_id) {
        res.status(200).json({
            msg: 'hi'
        })
    }
    else {
        res.send('no parameters')
    }
})

// app.get('*', function(req, res) {

// })

app.listen(process.env.PORT)
