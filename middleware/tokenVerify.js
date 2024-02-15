 const jwt = require('jsonwebtoken');
const tokenVerify = async (req, res, next) => {
    try {
        const headersToken = await req.headers['authorization']
        const token = await headersToken?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'Unauthorize Request' });
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = tokenVerify;