var mangoose = require('mongoose');
var bidSchema = require('./bid.model');

bidSchema.statics = {
    createAuctionLog: function(data, cb){
        var auction = new this(data);
        auction.save(cb);
    },
    addBid: function(query, updateData, cb){
        this.findOneAndUpdate(query,{$set:updateData},{new: true},cb);
    },
    getAuction: function(query, cb){
        this.findOne(query, cb);
    }
}

var bidModel = mangoose.model('Bid', bidSchema, 'bid');
module.exports = bidModel;