var mangoose = require('mongoose');
var liveSchema = require('./live.model');

liveSchema.statics={
    createAuction: function(data, cb){
        var user = new this(data);
        user.save(cb);
    },
    getAuction: function(query, cb){
        this.findOne(query, cb);
    },
    deleteAuction: function(query,cb){
        this.findOneAndDelete(query,cb);
    },
    deleteUser: function(query,updateData, cb){
        this.findOneAndUpdate(query,{$set:updateData},{new: true},cb);
    },
    addUser: function(query, updateData, cb){
        this.findOneAndUpdate(query,{$set:updateData},{upsert: true ,new: true},cb);
    }
};

var liveModel = mangoose.model('live', liveSchema, 'live');
module.exports = liveModel;