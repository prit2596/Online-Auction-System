var express = require('express');
var log = require('morgan')('dev');
var bodyParser = require('body-parser');

//user routes
var userRoutes = require('./api/user/user.routes');
var properties = require('./config/properties');
var db = require('./config/database');
var app = express();


//configure bodyParser
var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({extended: true});

//initialize express router
var router = express.Router();

//call database connectivity
db();
app.use(log);
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

// Error handling
// app.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//      res.setHeader("Access-Control-Allow-Credentials", "true");
//      res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//      res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
//    next();
//  });


// use express router
app.use('/api',router);

//call heros routing
userRoutes(router);

app.listen(properties.PORT, (req, res) =>{
    console.log(` Server is running on ${properties.PORT} port`);
})