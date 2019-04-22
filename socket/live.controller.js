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

        io.sockets.connected[socket.id].emit('totalUsers',{numberOfUsers: 1});
    });

}

exports.addUser = function(io,socket,data){
    live.getAuction({itemId: data.itemId}, function(err, auction){
        if(err) throw err;
        
        if(auction){
            users = auction.users;
            var user = {
                userId : data.userId,
                socketId : socket.id
            }
            if(users){
                users.push(user);
            }
            else{
                users = [user];
            }
            var updateData = {users: users}; 
            live.addUser({itemId: data.itemId}, updateData, function(err, auction){
                if(err) throw err;
                // let socket_ids = [];
                // auction.users.forEach(user => {
                //     socket_ids.push(user.socketId);
                // });
                
                let socket_ids;
                if(auction && auction.users){
                    socket_ids = auction.users.map(user => user.socketId);
                }
                else{
                    socket_ids = [user.socketId];
                }
                console.log(socket_ids);
                io.sockets.connected[socket_ids].emit('totalUsers',{numberOfUsers: socket_ids.length});
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
    live.getAuction({itemId: data.itemId}, function(err, auction){
        if(err) throw err;
        if(auction !== null){
            let users = auction.users;
            console.log(users);
            if(users)
            {
                userUpdate = users.filter(function(user){
                    return user.userId !== data.userId
                })
                live.deleteUser({itemId: data.itemId}, userUpdate, function(err, auction){
                    if(err) throw err;
                    let socket_ids = auction.users.map(user => user.socketId);
                    io.sockets.connected[socket_ids].emit('totalUsers',{numberOfUsers: socket_ids.length});
                });
            }
            
        }
    });    
}

exports.getSocketIds = function(itemId){
    live.getAuction({itemId: itemId}, function(err, auction){
        if(err) throw err;
        if(auction !== null){
            let socket_ids = auction.users.map(user => user.socketId);
            return socket_ids;
        }
    })
}