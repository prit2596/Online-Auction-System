/*

1. Password: Hash
2. Forgot Password
3. Session
4. Wishlist
5. Authentication


*/



var Users = require('./user.dao');
var { check, validationResult } = require('express-validator/check');
var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');
var config = require('../../config/properties');



exports.createUser = [
    check('first_name').withMessage('FirstName empty'),
    check('last_name').withMessage('LastName empty'),
    check('email').withMessage('Email Empty').isEmail().withMessage('Invalid Email'),
    check('password').withMessage('Password Empty'),
    check('confirm_password', 'Confirm Password Empty'),
    (req, res, next) => {
        //.log('userController_create');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                error: errors.array()
            })
        }
        else if (req.body.password !== req.body.confirm_password) {
            return res.json({
                error: {
                    "msg": "Password doesn't match"
                }
            });
        }
        else {

            Users.getByEmail({ email: req.body.email }, function (err, user) {
                //.log(user + "before");
                if (err) {
                    return res.json({
                        error: err
                    })
                }
                else if (user != null && Object.keys(user).length !== 0) {

                    return res.json({
                        error: "Email already exists"
                    });
                }
                else {
                    //.log(user);
                    var hashPassword = bcrypt.hashSync(req.body.password, 10);

                    var user = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        password: hashPassword,
                        address: req.body.address,
                        profilePic: req.file.filename
                    }

                    Users.create(user, function (err, user) {
                        if (err) {
                            return next(res.json({
                                error: err
                            }));
                        }

                        //creating a token and sending it back
                        //.log('here');
                        var token = jwt.sign({ id: user.email }, config.KEY, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                        // return next(res.json({
                        //     message: "User create successfully"
                        // }));
                    })
                }
            });
        }
    }
];


exports.getUsers = function (req, res, next) {
    Users.get({ archive: 0 }, function (err, users) {
        if (err) {
            return res.json({
                error: err
            })
        }

        return res.json({
            users: users
        })
    })
}

exports.getUserByEmail = function (req, res, next) {
    Users.getByEmail({ email: req.params.email, archive: 0 }, function (err, user) {
        if (err) {
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
        if (!errors.isEmpty()) {
            return res.json({
                error: errors.array()
            })
        }
        else {
            Users.getByEmail({ email: req.params.email, archive: 0 }, function (err, user) {
                if (err) {
                    return res.json({
                        error: err
                    })
                }
                else if (user == null || Object.keys(user).length == 0) {
                    return res.json({
                        error: "User doesn't exists"
                    })
                }
                else {
                    var user = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name
                    }

                    Users.update({ email: req.params.email }, user, function (err, user) {
                        if (err) {
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

exports.deleteUser = function (req, res, next) {
    if (req.params.email == null) {
        return res.json({
            error: "Provide Email address"
        })
    }

    Users.delete({ email: req.params.email }, function (err, user) {
        if (err) {
            return res.json({
                error: err
            })
        }

        if (user == null) {
            return res.json({
                message: "User doesn't exist"
            })
        }
        else {
            return res.json({
                message: "User deleted successfully"
            })
        }
    })
}

exports.updateItems = function (data) {
    var itemBought = {
        item: data.itemId,
        price: data.price
    }
    Users.getByEmail({ email: data.userId }, function (err, user) {
        if (err) throw err;
        user.items_bought.push(itemBought);
        Users.update({ email: data.userId }, user, function (err, user) {
            if (err) throw err;
        })
    })
}

exports.checkUser = function (req, res) {
    // res.status(200).send(user);
    //.log(req.userId);
    Users.getByEmail({ email: req.userId }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        user.password = 0;
        res.status(200).send(user);
        // next(user);
    });
}

exports.verifyToken = function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(200).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.KEY, function (err, user) {
        if (err) return res.status(200).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = user.id;
    });

    next();
}

exports.login = function (req, res) {
    // //.log(req.body);
    Users.getByEmail({ email: req.body.email }, function (err, user) {
        //.log(user);
        if (err) return res.status(500).send({message: 'Error on the server.'});
        if (!user) return res.status(200).send({message: 'Invalid username or password'});
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user.email }, config.KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
        let userDetails = user;
        userDetails.password = 0;
        res.status(200).send({ auth: true, token: token, message: 'login success', user: userDetails });
    });
}

exports.logout = function (req, res) {
    res.status(200).send({ auth: false, token: null });
}