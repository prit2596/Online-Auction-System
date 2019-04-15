var mongoose = require('mongoose');
var userSchema = require('./user.model');

userSchema.statics = {
    create : function(data, cb){
        var user = new this(data);
        user.save(cb);
    },

    get: function(query, cb){
        this.find(query, cb);
    },

    getByEmail: function(query, cb){
        this.findOne(query, cb);
    },

    update: function(query, updateData, cb){
        this.findOneAndUpdate(query,{$set:updateData},{new: true},cb);
    },

    delete: function(query, cb){
        deleteData= {
            archive : true
        }
        this.findOneAndUpdate(query,{$set:deleteData}, cb);
    }
}


var userModel = mongoose.model('Users', userSchema, 'user');
module.exports = userModel;