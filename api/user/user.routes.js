var Users = require('./user.controller');
var express = require('express');
var path = require('path');
var router = express.Router();

var multer = require('multer');

var storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req, file, callback){
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        callback(null, Date.now() + ext)
        // let extension_arr = file.mimetype.split('/');
        // let extension = extension_arr[extension_arr.length-1];
        // callback(null, file.fieldname);
    }
});
  

var validateFile = function(file, cb ){
    allowedFileTypes = /jpeg|jpg|png/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType  = allowedFileTypes.test(file.mimetype);
    console.log(file);
    if(extension && mimeType){
      return cb(null, true);
    }else{
      cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
    }
  }


var upload = multer({ storage: storage,
    fileFilter: function(req, file, callback){
        validateFile(file, callback);
      }
});

router.post('/create',upload.single('profilePic'), Users.createUser);
router.get('/getUsers', Users.getUsers);
router.get('/getUser/:email', Users.getUserByEmail);
router.put('/updateUser/:email', Users.updateUser);
router.delete('/deleteUser/:email', Users.deleteUser);
router.get('/me', Users.verifyToken, Users.checkUser);
router.post('/login', Users.login);
router.get('/logout', Users.logout);

module.exports = router;