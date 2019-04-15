/*

1. Password: Hash
2. Forgot Password
3. Session
4. Wishlist
5. Authentication


*/



var Users = require('./user.dao');
var {check, validationResult} = require('express-validator/check');
var bcrypt = require('bcrypt');

exports.createUser = [
    check('first_name').withMessage('FirstName empty'),
    check('last_name').withMessage('LastName empty'),
    check('email').withMessage('Email Empty').isEmail().withMessage('Invalid Email'),
    check('password').withMessage('Password Empty'),
    check('confirm_password','Confirm Password Empty'),
    (req, res, next) => {
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({
                error: errors.array()
            })
        }
        else if(req.body.password !== req.body.confirm_password){
            return res.json({
                error: {
                    "msg": "Password doesn't match"
                }
            });
        }
        else{
            
            Users.getByEmail({email: req.body.email}, function(err, user){
                console.log(user + "before");
                if(err){
                    return res.json({
                        error: err
                    })
                }
                else if(user != null && Object.keys(user).length !== 0){
                    
                    return res.json({
                        error: "Email already exists"
                    });    
                }
                else{
                    console.log(user);
                    var hashPassword = bcrypt.hashSync(req.body.password, 10);

                    var user = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        password: hashPassword,
                        address: req.body.address,
                    }
            
                    Users.create(user, function(err, user){
                        if(err){
                            return next(res.json({
                                error: err
                            }));
                        }
            
                        return next(res.json({
                            message: "User create successfully"
                        }));
                    })
                }
            });
        }
    }
];


exports.getUsers = function(req, res, next){
    Users.get({archive : 0}, function(err, users){
        if(err){
            return res.json({
                error: err
            })
        }

        return res.json({
            users: users
        })
    })
}

exports.getUserByEmail = function(req, res, next){
    Users.getByEmail({email: req.params.email,archive:0}, function(err, user){
        if(err){
            return res.json({
                error: err
            })
        }

        return res.json({
            user: user
        })
    })
}

exports.updateUser = [
    check('first_name').withMessage('FirstName empty'),
    check('last_name').withMessage('LastName empty'),
    (req, res, next) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({
                error: errors.array()
            })
        }
        else{
            Users.getByEmail({email: req.params.email, archive:0}, function(err, user){
                if(err){
                    return res.json({
                        error: err
                    })
                }
                else if(user == null || Object.keys(user).length == 0){
                    return res.json({
                        error: "User doesn't exists"
                    })
                }
                else{
                    var user = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name
                    }

                    Users.update({email: req.params.email}, user, function(err, user){
                        if(err){
                            res.json({
                                error: err
                            })
                        }

                        return res.json({
                            message: "User updated successfully"
                        })
                    })
                }
            })
        }
    }
];

exports.deleteUser = function(req, res, next){
    if(req.params.email == null){
        return res.json({
            error: "Provide Email address"
        })
    }

    Users.delete({email: req.params.email}, function(err, user){
        if(err){
            return res.json({
                error: err
            })
        }
        
        if(user == null){
            return res.json({
                message: "User doesn't exist"
            })
        }
        else{
            return res.json({
                message: "User deleted successfully"    
            })
        }
    })
}