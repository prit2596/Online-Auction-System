var userCtrl = require('../api/user/user.controller');
var itemCtrl = require('../api/items/items.controller');
var liveAuctionCtrl = require('./live.controller');
var bidCtrl = require('./bid.controller');

exports.auctionEnd = function(io, socket, data){
//user item updated
    itemCtrl.checkItemSold(data.itemId, function(err, soldFlag){
        if(err) throw err;
        console.log('checking Item sold', soldFlag)
        if(soldFlag === false){
            bidCtrl.getHighestBid(data.itemId, function(err, user){
                if(user){
                    var userData = {
                        itemId: data.itemId,
                        userId: user.userId,
                        price: user.bid
                    }
                    console.log('hightest bid' + userData);
                    userCtrl.updateItems(userData);
                    //item updated
                    var itemData ={
                        itemId: data.itemId,
                        price: user.bid,
                    }
                    console.log(JSON.stringify(itemData))
                    itemCtrl.itemSold(itemData);
                    //delete auction from live
                    liveAuctionCtrl.deleteAuction(data, function(err, socketIds){
                        console.log('deleteing auction after timeout'+ socketIds);
                        if(err) throw err;
                        socketIds.forEach(socket => {
                            io.sockets.connected[socket].emit('winner',{user: user.userId, price: user.bid});        
                        })
                    });    
                }
                else{
                    liveAuctionCtrl.deleteAuction(data, function(err, socketIds){
                        if(err) throw err;
                        console.log('deleteing auction after timeout'+ socketIds);
                        socketIds.forEach(socket => {
                            io.sockets.connected[socket].emit('winner', {user: "No winners"});
                        })
                    });

                }
            }); 
        }
    })
}