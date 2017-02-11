require('dotenv').config()
var express = require('express')
var mongo = require('mongodb')
var bodyParser = require("body-parser")

var app = express()

var dbUrl = process.env.MONGO_URL

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.static('public'))

var temp = false;

app.get('/', function(req, res) {
    // if (temp)
        res.sendFile(__dirname + '/public/home.html')
    // else
    //     res.sendFile(__dirname + '/public/login.html')
})

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/public/login.html')
})

app.post('/login', function(req, res) {
    console.log('inside')
    if (req.body.username == 'test' && req.body.password == 'test') { //temp
        res.sendStatus(200)
    }
    else
        res.sendStatus(500)
})

app.post('/signup', function(req, res) {
    
})

app.get('/api/polls', function(req, res) {
    if (req.query.type == "all"){
        res.send('send all polls')
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
