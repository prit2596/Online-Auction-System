var Users = require('./user.controller');

module.exports = function(router){
    router.post('/create', Users.createUser);
    router.get('/getUsers', Users.getUsers);
    router.get('/getUser/:email', Users.getUserByEmail);
    router.put('/updateUser/:email', Users.updateUser);
    router.delete('/deleteUser/:email', Users.deleteUser)
}