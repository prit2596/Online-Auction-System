var Items = require('./items.dao');
var {check, validationResult} = require('express-validator/check');

exports.createItem = [
	check('name').withMessage('Name required');
	check('desc').withMessage('description required');
	(req,res,next)=>{
		const error = validationResult(req);
		if(!error.isEmpty()){
			return res.json({
				error:errors.array()
			})
		}
		else{
			Items.getByName({name:req.body.name},function(err,item){
				if(err){
					return res.json({
						error:err
					})
				}
				else{
					val item = {
						name: req.body.name,
						desc: req.body.desc,
						image: req.body.images,
						category: req.body.cat,
						time.start_time: req.body.start,
						time.end_time : req.body.end,
						bid_price.starting_bid: req.price.s_bid 
					}
					Items.create(item,function(err,user){
						if(err){
							return next(res.json({
								error:err
							}));
						}
						return next(res.json({
                            message: "Item create successfully"
                        }));
					})
				}
			})
		}
	}
];

exports.getItems = function(req, res, next){
    Items.get({archive:0}, function(err, items){
        if(err){
            return res.json({
                error: err
            })
        }

        return res.json({
            items: items
        })
    })
}

exports.getItemByName = function(req, res, next){
    Items.getByName({name: req.params.name,archive:0}, function(err, items){
        if(err){
            return res.json({
                error: err
            })
        }

        return res.json({
            items: items
        })
    })
}

exports.updateItem = [
    check('name').withMessage('Name required');
	check('desc').withMessage('description required');
	(req,res,next)=>{
		const error = validationResult(req);
		if(!error.isEmpty()){
			return res.json({
				error:errors.array()
			})
		}
		else{
			Items.getByName({name:req.body.name,archive:0},function(err,item){
				if(err){
					return res.json({
						error:err
					})
				}
				else{
					val item = {
						name: req.body.name,
						desc: req.body.desc,
						image: req.body.images,
						category: req.body.cat,
						time.start_time: req.body.start,
						time.end_time : req.body.end,
						bid_price.starting_bid: req.price.s_bid 
					}
					Items.create(item,function(err,user){
						if(err){
							return next(res.json({
								error:err
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

exports.deleteItem = function(req, res, next){
    if(req.params.name == null){
        return res.json({
            error: "Provide Name for item"
        })
    }

    Items.delete({email: req.params.name}, function(err, item){
        if(err){
            return res.json({
                error: err
            })
        }
        
        if(item == null){
            return res.json({
                message: "Item doesn't exist"
            })
        }
        else{
            return res.json({
                message: "Item deleted successfully"    
            })
        }
    })
}