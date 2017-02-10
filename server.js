require('dotenv').config()
var express = require('express');
var mongo = require('mongodb');
var app = express()

var dbUrl = process.env.MONGO_URL

app.use(express.static('public'))

app.get('/login', function(req, res) {
    //handle login
})

app.get('/api/polls', function(req, res) {
    //return all polls or
    //return user's polls
})

app.get('*', function(req, res) {
    
})

app.listen(process.env.PORT);
