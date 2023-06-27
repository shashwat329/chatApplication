let users = [];
let i = 0;
const socket = io();
// const name = "Ayush";
// const name = prompt("Enter your name: ");
name = sessionStorage.getItem("name")
socket.emit('joined', name);

users[i++] = name;
const chatBox = document.querySelector('.box');
const messageInput = document.getElementById('msgInput');
const usersN = document.querySelector('.users');

const appendmsg = (name, message, position) => {
    const messageText = document.createElement('div');
    const user = document.createElement('span');
    user.innerText = name;
    user.classList.add('sender');
    messageText.append(user);
    //-->
    messageText.append(message);
    messageText.classList.add('message');
    messageText.classList.add(position);
    chatBox.append(messageText);
    scrollToBottom()
}
const join = (message) => {
    const messageText = document.createElement('div');
    messageText.innerText = message;
    messageText.classList.add('join');
    chatBox.append(messageText);
    scrollToBottom()
}
function sendmsg() {
    console.log(messageInput.value);
    if (messageInput.value.trim() != "") {
        appendmsg("You", messageInput.value, 'right')
        socket.emit('send', messageInput.value);
        messageInput.value = "";
        scrollToBottom()
    }
}
function addUser() {
    console.log(users);
}

socket.on('user-joined', name => {
    join(`${name} join the chat.`);
})

socket.on('userName', userName => {
    console.log(userName);
    usersN.innerHTML = "";
    let p = document.createElement('p');
    p.innerText = userName.join(', ');
    usersN.append(p);
})

socket.on('recieved', data => {
    appendmsg(data.name, data.message, 'left')
})

socket.on('leave', name => {
    join(`${name} leave the chat.`);
})

messageInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendmsg();
    }
});

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

