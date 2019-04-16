var mongoose = require('mongoose');
// require('mongoose-double')(mongoose);

// var SchemaType = mongoose.Schema.Types;
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic:{
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    admin: {
        type: Boolean,
        default: 0
    },
    items_bought: [{
        item: {
            type: ObjectId
        },
        price: {
            type: Number
        }
    }],
    wish_list: [{
        item: {
            type: ObjectId
        }
    }],
    archive:{
        type:Boolean,
        default: false
    }  
});

module.exports = userSchema;