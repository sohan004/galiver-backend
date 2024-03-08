const { find } = require("../../model/categoryModel");
const User = require("../../model/userModel");

let activeUsers = [];

const setNewActiveUsers = async (socket) => {
    const { userID } = socket.handshake.query;
    let user = {};
    if (userID) {
        const findUser = await User.findById(userID).select('name email role')
        if (findUser) {
            user['name'] = findUser.name;
            user['email'] = findUser.email;
            user['role'] = findUser.role;
            user['userID'] = findUser._id;
        }
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