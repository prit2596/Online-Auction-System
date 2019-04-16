var mongoose = require('mongoose');
var categorySchema = require('./category.model');


categorySchema.statics = {
    create : function(data, cb){
        var category = new this(data);
        category.save(cb);
    },

    get: function(query, cb){
        this.find(query, cb);
    }
}

var categoryModel = mongoose.model('Category', categorySchema, 'category')
module.exports = categoryModel;