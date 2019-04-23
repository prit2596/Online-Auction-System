var live = require('./live.dao');

//for creating an auction
createAuction=function(io, socket, data){
    var user = {
        userId : data.userId,
        socketId : socket.id
    }
    var auction = {
        itemId : data.itemId,
        users : [user]
    }

    live.createAuction(auction, function(err, auction){
        if(err) throw err
        console.log(socket.id)
        console.log(typeof(socket.id))
        io.sockets.connected[socket.id].emit('totalUsers',{numberOfUsers: 1});
    });

}

exports.addUser = function(io,socket,data){
    live.getAuction({itemId: data.itemId}, function(err, auction){
        if(err) throw err;
        console.log("adding new user");
        if(auction){
            users = auction.users;
            var user = {
                userId : data.userId,
                socketId : socket.id
            }
            
            if(users){
                var found = users.find(u => u.socketId === user.socketId)
                if(found){

                }
                else{
                    users.push(user);
                }
            }
            else{
                users = [user];
            }
            var updateData = {users: users}; 
            live.addUser({itemId: data.itemId}, updateData, function(err, auction){
                if(err) throw err;

                if(auction && auction.users){
                    socket_ids = [];
                    auction.users.forEach(user => {
                        socket_ids.push(user.socketId);
                    })
                    //socket_ids = auction.users.map(user => user.socketId);
                }
                else{
                    socket_ids = [user.socketId];
                }
                console.log(socket_ids)
                socket_ids.forEach(socket => {
                    io.sockets.connected[socket].emit('totalUsers',{numberOfUsers: socket_ids.length});
                })
            });       
        }
        else{
            //console.log('new auction');
            createAuction(io, socket, data);
        }
    });
}

exports.deleteAuction = function(data){
    live.deleteAuction({itemId : data.itemId}, function(err, auction){
        if(err) throw err;
        socket_ids = auction.users.map(user => user.socketId);
        return socket_ids;
    })
}

exports.deleteUser = function(io, socket, data){
    var query = {
        users: {$elemMatch: {
            socketId: socket.id
        }
        }
    }
    live.getAuction(query, function(err, auction){
        console.log('Delete: getAuction');
        if(err) throw err;
        if(auction){
            console.log('delete: auction')
            let users = auction.users;
            if(users)
            {
                console.log(socket.id)
                userUpdate = users.filter(function(user){
                    return user.socketId !== socket.id
                });
                console.log("User Update: " + userUpdate)
                auction.users = userUpdate;
                live.deleteUser({itemId: auction.itemId}, auction, function(err, chngedAuction){
                    console.log("changed AUction:" +chngedAuction)
                    if(err) throw err;
                    let socket_ids = chngedAuction.users.map(user => user.socketId);
                    socket_ids.forEach(socket => {
                        io.sockets.connected[socket].emit('totalUsers',{numberOfUsers: socket_ids.length});
                    })
                });
            }
            
        }
    });    
}

exports.getSocketIds = function(itemId, cb){
    live.getAuction({itemId: itemId}, function(err, auction){
        if(err) throw err;
        if(auction){
            console.log(auction)
            var socket_ids = auction.users.map(user => user.socketId);
            console.log(socket_ids )
            cb(null, socket_ids);
        }
    })
}