var mongoose = require('mongoose');

var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var liveSchema = new Schema({
    itemId: {
        type: ObjectId,
        required: true
    },
    users: [{
        userId: {
            type: String,
            required: true
        },
        socketId: {
            type: ObjectId,
            required: true
        }
    }]
});

module.exports = liveSchema;