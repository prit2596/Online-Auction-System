var bid = require('./bid.dao');
var item = require('../api/items/items.controller');
var liveAuction = require('./live.controller');
var liveDao = require('./live.dao');

//
createBidLogTable = function (io, socket, data) {
    console.log('in create')
    item.getStartBid(data.itemId, function(err, starting_bid){
        console.log(starting_bid)
        if(err) throw err;
        console.log('check inside');
        var user = {
            userId: data.userId,
            bid: starting_bid + parseInt(data.bid)
        }
        var auction = {
            itemId: data.itemId,
            users: [user]
        }
        bid.createAuctionLog(auction, function (err, auction) {
            if (err) throw err
            liveAuction.getSocketIds(data.itemId, function(err, socketIds){
                console.log(auction);
                socketIds.forEach(socket => {
                    io.sockets.connected[socket].emit('posted_bid', { user: user });    
                })
            });
        });
    })

}

exports.addBid = function (io, socket, data) {
    liveDao.getAuction({ itemId: data.itemId }, function (err, liveAuc) {
        if (err) throw err;
        if (liveAuc) {

            bid.getAuction({ itemId: data.itemId }, function (err, auction) {
                if (err) throw err;
                if (auction){
                    console.log('m here' + auction)
                    var user = {
                        userId: data.userId,
                        bid: auction.users[auction.users.length - 1].bid + parseInt(data.bid)
                    }
                    auction.users.push(user);
                    bid.addBid({ itemId: data.itemId }, auction, function (err, changedAuction) {
                        if (err) throw err;
                        liveAuction.getSocketIds(data.itemId, function(err, socketIds){
                            // console.log(socketIds)
                            // console.log('after bid log' + changedAuction)
                            socketIds.forEach(socket => {
                                io.sockets.connected[socket].emit('posted_bid', { user: user });
                            })
                        });
                    })
                }
                else {
                    createBidLogTable(io, socket, data);
                }
            });

        }
    })
}

exports.getHighestBid = function (itemId) {
    bid.getAuction({ itemId: itemId }, function (err, auction) {
        if (err) throw err;
        if(auction === null) return null;
        return auction.users[auction.users.length - 1];
    })
}

exports.getBidLogs = function(io,socket,data){
    //console.log("bidLogs"+ data.itemId)
    bid.getAuction({ itemId : data.itemId }, function(err,auction){
        if (err) throw err;
        //console.log("bidLogs: Auction"+ auction);
        socket.emit('bid_logs', { users: auction.users});        
    })
}