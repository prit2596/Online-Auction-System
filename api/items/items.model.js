var mongoose = require('mongoose');
// require('mongoose-double')(mongoose);

// var SchemaType = mongoose.Schema.Types;
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
		type: String,
		required: true
	},
	time:{
		start_time :{type: Date, required:true},
		end_time : {type: Date, required: true}
	},
	bid_price: {
		starting_bid : {type: Number, required: true},
		final_price: {type: Number, default: 0}
	},
	archive:{
        type:Boolean,
        default: false
	},
	sold:{
		type: Boolean,
		default: false
	} 
});

module.exports = itemsSchema;