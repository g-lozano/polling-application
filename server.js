var express = require('express');
var mongo = require('mongodb');
var app = express()

var dbUrl = ""

app.use(express.static('public'))

app.get('/login', function(req, res) {
    //handle login
})

app.get('*', function(req, res) {
  
})

app.listen(process.env.PORT);
