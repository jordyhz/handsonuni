//importing modules
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utilities/messages');
const {addUser, getUser, removeUser, getRoomUsers} = require('./utilities/users');

const app = express();


//access server directly in order to use socket.io
const server = http.createServer(app);

//initialize socket io and pass it to server
const io = socketio(server);

//Set staic folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'NAXY Bot';

//runs when user connects
io.on('connect', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user1 = addUser(socket.id, username, room);

    socket.join(user1.room);
//emitting a message after connection   
 // emit will emit to the single user that is connecting
    socket.emit('message', formatMessage(botName, 'Welcome to NAXY Messenger!'));

    //broadcast when a user connects
    //(broadcast.emit will emit to all users except the one connecting)
    //to emit to all the clients if a new connection is made, we use io.emit
    //broadcast.to().emit helps to broadcast to a specific room
    socket.broadcast.to(user1.room).emit('message', formatMessage(botName, `${user1.username} has joined the room`));


    //return users and info of room
    io.to(user1.room).emit('roomUsers', {
        room: user1.room,
        users: getRoomUsers(user1.room)
    });
    });

//Listen to incoming message
    socket.on('chatMessage', msg => {
    const user2 = getUser(socket.id);
//emitting incoming message back to everybody
    io.to(user2.room).emit('message', formatMessage(user2.username, msg));
    });

//runs when user disconnects
    socket.on('disconnect', () => {
        const user3 = removeUser(socket.id);
        if (user3) {
            io.to(user3.room).emit('message', formatMessage(botName, `${user3.username} has left the room`)); 
//return users and info of room
    io.to(user3.room).emit('roomUsers', {
        room: user3.room,
        users: getRoomUsers(user3.room)
    });

        }
    
});
});




const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));