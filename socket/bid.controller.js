var bid = require('./bid.dao');
var item = require('../api/items/items.controller');
var liveAuction = require('./live.controller');
var liveDao = require('./live.dao');


createAuction = function (io, socket, data) {
    var user = {
        userId: data.userId,
        bid: item.getStartBid(data.itemId) + data.bid
    }
    var auction = {
        itemId: data.itemId,
        users: [user]
    }
    bid.createAuctionLog(auction, function (err, auction) {
        if (err) throw err
        socketIds = liveAuction.getSocketIds(data.itemId);
        io.sockets.connected[socketIds].emit('posted_bid', { user: user });
    });
}

exports.addBid = function (io, socket, data) {
    liveDao.getAuction({ itemId: data.itemId }, function (err, liveAuction) {
        if (err) throw err;
        if (liveAuction !== null) {


            bid.getAuction({ itemId: data.itemId }, function (err, auction) {
                if (err) throw err;
                if (auction === null)
                    createAuction(io, socket, data);
                else {
                    var user = {
                        userId: data.userId,
                        bid: auction.users[auction.users.length - 1].bid + data.bid
                    }
                    auction.users.push(user);
                    bid.addBid({ itemId: data.itemId }, auction, function (err, auction) {
                        if (err) throw err;
                        socketIds = liveAuction.getSocketIds(data.itemId);
                        io.sockets.connected[socketIds].emit('posted_bid', { user: user });
                    })
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

