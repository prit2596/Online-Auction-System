/** create separate api for updating and deleting images
1. update by price
2. update imgae
3. basically many updates
4. get item by name or description like query
test

*/

var Items = require('./items.dao');
var { check, validationResult } = require('express-validator/check');

exports.createItem = [
	check('name').withMessage('Name required'),
	check('desc').withMessage('description required'),
	check('category').withMessage('Category required'),
	check('start_time').withMessage('Start time required'),
	check('end_time').withMessage('End time required'),
	check('starting_bid').withMessage('Starting Bid required'),
	
	(req, res, next) => {
		//.log("Here")
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.json({
				error: errors.array()
			})
		}
		else {
			////.log(Date.now());
			var start_time = new Date(req.body.start_time).getTime();
			var end_time = new Date(req.body.end_time).getTime();
			//.log(start_time + "  " + end_time);
			//.log(req.body);
			////.log(start_time +" "+ end_time);
			if (start_time <= Date.now()) {
				res.json({
					error: "Start time cannot be smaller than present time"
				})
			}
			else if (end_time <= start_time) {
				res.json({
					error: "End time cannot be smaller than start time"
				})
			}
			else {
				var item = {
					name: req.body.name,
					desc: req.body.desc,
					image: {path: req.file.path},
					category: req.body.category,
					time: {
						start_time: start_time,
						end_time: end_time
					},
					bid_price: {
						starting_bid: req.body.starting_bid
					}
				}

				Items.create(item, function (err, item) {
					if (err) {
						res.json({
							error: err
						})
					}

					res.json({
						message: "Item created successfully"
					})
				})
			}
		}
	}
];

exports.getItems = function (req, res, next) {
	Items.get({ archive: 0 }, function (err, items) {
		if (err) {
			return res.json({
				error: err
			})
		}

		return res.json({
			items: items
		})
	})
}

// exports.getItemByName = function (req, res, next) {
// 	Items.getByName({ name: req.params.name, archive: 0 }, function (err, items) {
// 		if (err) {
// 			return res.json({
// 				error: err
// 			})
// 		}

// 		return res.json({
// 			items: items
// 		})
// 	})
// }

exports.getById = function (req, res, next) {
 	Items.getById({ _id: req.params.id, archive: 0 }, function (err, items) {
 		if (err) {
 			return res.json({
 				error: err
 			})
 		}
 		////.log(items)
 		return res.json({
 			items: items
 		})
 	})
 }

exports.updateItem = [
	check('name').withMessage('Name required'),
	check('desc').withMessage('description required'),
	check('category').withMessage('Category required'),
	check('start_time').withMessage('Start time required'),
	check('end_time').withMessage('End time required'),
	check('starting_bid').withMessage('Starting Bid required'),
	(req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.json({
				error: errors.array()
			})
		}
		else {
			Items.getById({ _id: req.params.id, archive: 0 }, function (err, item) {
				if (err) {
					return res.json({
						error: err
					})
				}
				else {
					item.image.push({path: req.file.path})
					////.log(item.image)
					var newItem = {
						name: req.body.name,
						desc: req.body.desc,
						image: item.image,
						category: req.body.category,
						time: {
							start_time: req.body.start_time,
							end_time: req.body.end_time
						},
						bid_price: {
							starting_bid: req.body.starting_bid
						}
					}
					//.log("Upate Item" + JSON.stringify(newItem))
					Items.update({ _id: req.params.id }, newItem, function (err, user) {
						if (err) {
							return next(res.json({
								error: err
							}));
						}
						//.log("successfully")
						return next(res.json({
							message: "Item updated successfully"
						}));
					})
				}

			})
		}
	}
];

exports.deleteItem = function (req, res, next) {
	if (req.params.id == null) {
		return res.json({
			error: "Provide Id for item"
		})
	}

	Items.delete({ _id: req.params.id }, function (err, item) {
		if (err) {
			return res.json({
				error: err
			})
		}

		if (item === null && Object.keys(item).length !== 0) {
			return res.json({
				message: "Item doesn't exist"
			})
		}
		else {
			return res.json({
				message: "Item deleted successfully"
			})
		}
	})
}

exports.getStartBid = function(itemId, cb){
	Items.getById({_id: itemId}, function(err, item){
		if(err) throw err;
		cb(null,item.bid_price.starting_bid);
	})
}
//to set the final price of item after auction end
exports.itemSold = function(data){
	Items.getById({_id: data.itemId}, function(err, item){
		if(err) throw err;
		//.log(JSON.stringify(item));
		item.bid_price.final_price = data.price;
		item.sold = true;

		Items.update({_id: data.itemId}, item, function(err, updatedItem){
			if(err) throw err;
			//.log(JSON.stringify(updatedItem));
		});
	});
}

exports.checkItemSold = function(data, cb){
	Items.getById({_id: data}, function(err, item){
		if(err) throw err;
		//.log("ItemSold Flag" + data);
		//.log("ItemSold Flag" + item.sold);
		cb(null, item.sold);
	})
}

exports.getLiveItems = function(req, res, next){
	var query = {
		"time.start_time" : {$lt : new Date()},
		"time.end_time" : {$gt : new Date()},
		archive: false,
		sold: false
	}
	////.log(new Date())

	////.log(Date.now());
	
	Items.get(query, function(err, items){
	//	//.log(items);
		if(err){
			res.json({
				error: err
			})
		}

		res.json({
			items: items
		})
	})
}

exports.getSoldItems = function(req, res, next){
	var query = {
		archive: false,
		sold: true
	}

	Items.get(query, function(err, items){
		if(err){
			res.json({
				error: err
			})
		}

		res.json({
			items: items
		})
	})
}

exports.getUpcomingItems= function(req, res, next){
	var query = {
		"time.start_time" : {$gt : new Date()},
		archive: false,
		sold: false
	}
	////.log(new Date())
	Items.get(query, function(err, items){
		//.log(items);
		if(err){
			res.json({
				error: err
			})
		}

		res.json({
			items: items
		})
	})
}