const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 8000;
const user = {};
const userName = [];

// for sending our css and other staff's
app.use(express.static(path.join(__dirname , './public')));

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/user.html'))
// })

io.on('connection', socket => {
    console.log("User is connected");
    socket.on('joined', name => {
        user[socket.id] = name;
        userName.push(name);
        socket.broadcast.emit('user-joined', name)
        socket.emit('userName', userName)
        socket.broadcast.emit('userName', userName)
        // console.log(userName);
        // console.log(Object.keys(user).length);
    })
    socket.on('send', msg => {
        socket.broadcast.emit('recieved', {message: msg, name: user[socket.id]})
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', user[socket.id]);
        console.log("User is disconnected");
        // delete user[socket.id];
        let index = userName.indexOf(user[socket.id])
        if (index > -1)
            userName.splice(index, 1);
        // socket.emit('userName', userName)
        socket.broadcast.emit('userName', userName)
    })
})

http.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
})