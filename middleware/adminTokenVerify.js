const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const adminTokenVerify = async (req, res, next) => {
    try {
        const headersToken = await req.headers['authorization']
        const token = await headersToken?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'Unauthorize Request' });
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const findUser = await User.findById(decode.userID).select('role')
        if (!findUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (findUser.role !== 'admin') {
            return res.status(400).json({ message: 'Unauthorize Request' });
        }
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminTokenVerify;