var mongoose = require('mongoose');

var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var bidSchema = new Schema({
    itemId: {
        type: ObjectId,
        required: true
    },
    users: [{
        userId: {
            type: String,
            required: true
        },
        bid: {
            type: Number,
            required: true
        }
    }]
});

module.exports = bidSchema;