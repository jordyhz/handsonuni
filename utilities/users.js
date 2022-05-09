const users = [];


//Add user to chat room
function addUser(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;
}

//Getting the actual user
function getUser(id) {
    return users.find(user => user.id === id);
}

//user disconnects from room
function removeUser(id) {
    const _id = users.findIndex(user => user.id === id);

    if (_id !== -1) {
        return users.splice(_id, 1)[0];
    }
}

//get the room users

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    addUser, getUser, getRoomUsers, removeUser
};