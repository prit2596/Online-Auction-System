var userCtrl = require('../api/user/user.controller');
var itemCtrl = require('../api/items/items.controller');
var liveAuctionCtrl = require('./live.controller');
var bidCtrl = require('./bid.controller');

exports.auctionEnd = function(io, socket, data){
//user item updated
    itemCtrl.checkItemSold(data.itemId, function(err, soldFlag){
        if(err) throw err;
        if(soldFlag === false){
            bidCtrl.getHighestBid(data.itemId, function(err, user){
                if(user === null){
                    liveAuctionCtrl.deleteAuction(data, function(err, socketIds){
                        if(err) throw err;
                        io.sockets.connected[socketIds].emit('winner', {user: "No winners"});
                    });
                }
                else{
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
                    liveAuctionCtrl.deleteAuction(data, function(err, socketIds){
                        if(err) throw err;
                        io.sockets.connected[socketIds].emit('winner',{user: user.userId, price: user.bid});        
                    });    
                }
            }); 
        }
    })
}