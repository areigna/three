//dependencies
var http = require('http');
var https = require('https');
var express = require('express');

//new instance of modules
var app = express();

//--------------------------------

//middlewares
//app.use(express.logger());
app.use(function(req,res,next){
    console.log(req.header('User-Agent'));
    next();
});
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
//app.engine('jade', require('jade').__express);

app.use('/static',express.static(__dirname + '/public'));


//mobile download
app.all('/d', function(req, res){
    var agent = req.header('User-Agent').toLowerCase();
    //iphone
    if(agent.indexOf('iphone') > -1){
        res.redirect('https://itunes.apple.com/us/app/ricepo-chinese-food-delivery/id844835003?mt=8');
    }
    //android
    else if(agent.indexOf('android') > -1){
        //res.sendfile(__dirname + '/public/Ricepo-release 1.1.1.apk');
        res.redirect('https://play.google.com/store/apps/details?id=com.ricepo.app');
    }
    //else
    else{
        res.render('index.html');
    }
});

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
