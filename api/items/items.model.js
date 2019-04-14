var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var SchemaType = mongoose.Schema.Types;
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemsSchema = new Schema({
	name:{
		type: String,
		required: true
	},
	desc:{
		type: String,
		required: true
	},
	image:[{
		path : {type: String}
	}],
	category:{
		type: String
	},
	time:[{
		start_time :{type: Date},
		end_time : {type: Date}
	}],
	bid_price: [
	{
		starting_bid : {type: Double}
	}],
	archive:{
        type:Boolean,
        default: false
    } 
});

module.exports = itemsSchema;