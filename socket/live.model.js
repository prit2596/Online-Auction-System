var mongoose = require('mongoose');

var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var liveSchema = new Schema({
    itemId: {
        type: String,
        required: true
    },
    users: [{
        userId: {
            type: String,
            required: true
        },
        socketId: {
            type: String,
            required: true
        }
    }]
});

module.exports = liveSchema;