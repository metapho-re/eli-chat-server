const io = require('socket.io')();
const Message = require('../models/message');
const helpers = require('../helpers/helpers');

const socketio = {};
let userList = [];

socketio.io = io;

io.on('connection', (socket) => {
    socket.on('signup', (user) => {
        socket.join('authenticatedUsers');
        socket.to('authenticatedUsers').emit('newUser', user);
        userList = helpers.addUser(userList, user);
    });
    socket.on('login', (params) => {
        socket.join('authenticatedUsers');
        socket.to('authenticatedUsers').emit('activeUsers', userList = helpers.addUser(userList, [params[0], params[1]]));
        for (let i = 2; i < params.length; i += 1) socket.join(params[i]);
    });
    socket.on('logout', (params) => {
        socket.leave('authenticatedUsers');
        socket.to('authenticatedUsers').emit('activeUsers', userList = helpers.removeUser(userList, params[0]));
        for (let i = 1; i < params.length; i += 1) socket.leave(params[i]);
    });
    socket.on('createChat', (params) => {
        socket.join(params[0]);
        for (let i = 1; i < params.length; i += 1) {
            if (io.sockets.connected[params[i]] !== undefined) {
                io.sockets.connected[params[i]].join(params[0]);
            }
        }
    });
    socket.on('message', (msg) => {
        const msgObject = JSON.parse(msg);
        Message.create({
            chatId: msgObject.chatId,
            body: msgObject.message,
            username: msgObject.username,
        })
            .then(() => socket.to(helpers.getChatId(msg)).emit('message', msg))
            .catch(err => socket.emit('persistError', err.message));
    });
    socket.on('error', () => {
        socket.emit('socketError', 'socketError');
    });
});

module.exports = socketio;
