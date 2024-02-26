const http = require('http');
const { app } = require('./index');
const server = http.createServer(app);
const socket = require('socket.io');
const { socketRoute } = require('./router/v1_route/socketRoute');

const io = socket(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
});

io.on('connection', (socket) => {
    socketRoute(socket, io);
});


module.exports = { server };