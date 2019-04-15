var mongoose = require('mongoose');
var itemsSchema = require('./items.model');

itemsSchema.statics = {
	create : function(data, cb){
        var item = new this(data);
        item.save(cb);
    },

    get: function(query, cb){
        this.find(query, cb);
    },

    getNyName: function(query, cb){
        this.findOne(query, cb);
    },

    update: function(query, updateData, cb){
        this.findOneAndUpdate(query,{$set:updateData},{new: true},cb);
    },

    delete: function(query, cb){
        deleteData ={
            archive:0
        }
        this.findOneAndUpdate(query,{$set:deleteData}, cb);
    }
}

var itemsModel = mongoose.model('Items', itemsSchema, 'item');
module.exports = itemsModel;