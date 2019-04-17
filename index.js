var express = require('express');
var log = require('morgan')('dev');
var bodyParser = require('body-parser');

//user routes
var userRoutes = require('./api/user/user.routes');
var categoryRoutes = require('./api/category/category.routes');
var itemsRoutes = require('./api/items/items.routes');
var properties = require('./config/properties');
var db = require('./config/database');
var app = express();

//configure bodyParser
var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({extended: true});

//call database connectivity
db();
app.use(log);
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
app.use(express.static('uploads'));

// use express router
app.use('/api/user', userRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/items',itemsRoutes);


//socket
var http = require('http').Server(app);
var io = require('socket.io')(http);
var live_auction = require('./socket/live.controller');
var timeout  = require('./socket/timeout.controller');
var bid = require('./socket/bid.controller');
io.sockets.on('connection',function(socket){
    socket.on('join_auction', function(data){
        //itemid, userid, socketid
        live_auction.addUser(io,socket,data);
    });
    socket.on('new_bid', function(data){
        bid.addBid(io, socket, data);
    });
    socket.on('timeout', function(data){
        timeout.auctionEnd(io, socket, data);
    });
    socket.on('disconnect', function(data){
        live_auction.deleteUser(io,socket, data);
    });
})







app.listen(properties.PORT, (req, res) =>{
    console.log(` Server is running on ${properties.PORT} port`);
});
