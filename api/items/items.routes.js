var express = require('express');
var router = express.Router();
var path = require('path');
var Items = require('./items.controller');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req, file, callback){
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        callback(null, Date.now() + ext)
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

router.post('/create',upload.single('image'), Items.createItem);
router.get('/getItems', Items.getItems);
//router.get('/getUser/:name', Items.getItemByName);
router.put('/updateItem/:id', Items.updateItem);
router.delete('/deleteItem/:id', Items.deleteItem)

module.exports = router;