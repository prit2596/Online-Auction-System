var Category = require('./category.dao');
var {check, validationResult} = require('express-validator/check');


exports.createCategory = [
    check('name').withMessage('Category Name required'),
    (req, res, next) => {
        console.log(req.body);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({
                error: errors.array()
            });
        }
        else{
            var cat = {
                name : (req.body.name).toLowerCase()
            }
            
            Category.get(cat, function(err, category){
                if(err){
                    return res.json({
                        error: err
                    })
                }
                else if(category != null && Object.keys(category).length !== 0){
                    return res.json({
                        error: "Category already exists"
                    })
                }
                else{
                    Category.create(cat, function(err, category){
                        if(err){
                            return res.json({
                                error: err
                            })
                        }

                        return res.json({
                            message: "Category created successfully"
                        });
                    });
                }
            });
        }
    }

];

exports.getCategory = function(req, res, next){
    Category.get({}, function(err, category){
        if(err){
            res.json({
                error: err
            })
        }

        res.json({
            categories: category
        })
    })
}