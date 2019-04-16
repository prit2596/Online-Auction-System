var mongoose = require('mongoose');

var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var categorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = categorySchema;