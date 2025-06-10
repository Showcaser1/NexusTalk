const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username);
        io.emit('update-users', Object.values(users));
    });

    socket.on('send-message', (message) => {
        io.emit('chat-message', { username: users[socket.id], message });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
        io.emit('update-users', Object.values(users));
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
