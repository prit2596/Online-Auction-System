var Items = require('./items.controller');

module.exports = function(router){
    router.post('/create', Users.createItem);
    router.get('/getUsers', Users.getItems);
    router.get('/getUser/:name', Users.getItemByName);
    router.put('/updateUser/:name', Users.updateItem);
    router.delete('/deleteUser/:name', Users.deleteItem)
}