//access the chat form
const chatForm = document.getElementById('chat-form');
//bring from the DOM 'chat-messages div
const chatMessages = document.querySelector('.chat-messages');

const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

//Get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);


//we use the io variable that was passed to the server
const socket = io();

//Join chatroom
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({room, users}) => {
    showRoomName(room);
    showUsers(users);
})



//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

//scroll down after new message has arrived
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//Message submit
chatForm.addEventListener('submit', (e) => {

//preventing the form to be submitted to a file
    e.preventDefault();

//getting the text input
    const msg = e.target.elements.msg.value;
//emitting the message to the server
    socket.emit('chatMessage', msg);

//clear Input
e.target.elements.msg.value = '';
e.target.elements.msg.focus();
});

//show incoming message in the DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class = "meta">${message.username} <span>${message.time}</span> </p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//show room name in the DOM
function showRoomName(room) {
    roomName.innerText = room;
}


//show users in the DOM
function showUsers(users) {
    usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}