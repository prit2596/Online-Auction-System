var userCtrl = require('../api/user/user.controller');
var itemCtrl = require('../api/items/items.controller');
var liveAuctionCtrl = require('./live.controller');
var bidCtrl = require('./bid.controller');

exports.auctionEnd = function(io, socket, data){
//user item updated
    var user = bidCtrl.getHighestBid(data.itemId);
    var userData = {
        itemId: data.itemId,
        userId: user.userId,
        price: user.bid
    }
    userCtrl.updateItems(userData);
//item updated
    var itemData ={
        itemId: data.itemId,
        price: user.bid,
    }
    itemCtrl.itemSold(itemData);
//delete auction from live
    var socketIds = liveAuctionCtrl.deleteAuction(data);
    io.sockets.connected[socketIds].emit('winner',{user: user.userId, price: user.bid});
}
