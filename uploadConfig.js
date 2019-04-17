const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + new Date().toISOString());
    }
})

const fileFilter = function(req, file, cb){
    if(file.mimeType === 'image/jpeg' || file.mimeType === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
    });
