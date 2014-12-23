//dependencies
var http = require('http');
var https = require('https');
var express = require('express');
var route = require('./route');

//new instance of modules
var app = express();

//--------------------------------

//middlewares
//app.use(express.logger());
/*
app.use(function(req,res,next){
    console.log(req.header('User-Agent'));
    next();
});
*/

//static file render
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
//app.engine('jade', require('jade').__express);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
});

app.use('/static',express.static(__dirname + '/public'));

//fetch images
app.all('/fetch',route.fetch);

//intro page
app.all('*',function(req,res){
    res.render('index.html');
});

//Error handlers
app.use(express.errorHandler);


//--------------------------------

//run the server
console.log('starting server on 9999..');
http.createServer(app).listen(9999);
//https.createServer(options, app).listen(443);
console.log('server running on 9999..');
