let activeUsers = [];

const setNewActiveUsers = async (socket) => {
    const { userID, role } = socket.handshake.query;
    let user = {};
    if (userID) {
        user['userID'] = userID;
        user['role'] = role;
    }
    user['socketID'] = socket.id;
    activeUsers.push(user);
}

const socketRoute = (socket, io) => {
    setNewActiveUsers(socket);

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(user => user.socketID !== socket.id);
    });
}

module.exports = { socketRoute, activeUsers };