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
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.json({
				error: errors.array()
			})
		}
		else {
			console.log(Date.now());
			var start_time = new Date(req.body.start_time);
			var end_time = new Date(req.body.end_time);

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
					var item = {
						name: req.body.name,
						desc: req.body.desc,
						// image: [req.file.path],
						category: req.body.category,
						time: {
							start_time: req.body.start_time,
							end_time: req.body.end_time
						},
						bid_price: {
							starting_bid: req.body.starting_bid
						}
					}
					Items.update({ _id: req.params.id }, item, function (err, user) {
						if (err) {
							return next(res.json({
								error: err
							}));
						}
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

exports.getStartBid = function(itemId){
	Items.getById({_id: itemId}, function(err, item){
		if(err) throw err;
		return item.bid_price.starting_bid;
	})
}

exports.itemSold = function(data){
	Items.getById({itemId: data.itemId}, function(err, item){
		if(err) throw err;
		item.bid_price.final_price = data.price;
		item.sold = true;

		Items.update({itemId: data.itemId}, item, function(err, item){
			if(err) throw err;
		});
	});
}