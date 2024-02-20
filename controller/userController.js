

const User = require('../model/userModel');

const getAllUsers = async (req, res) => {
    const { skip, search } = req.query
    const limit = 20
    const skipUser = skip ? parseInt(skip) : 0
    let searchQuery = {}
    if (search) {
        searchQuery = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
                {role: { $regex: search, $options: 'i' } }
            ],
        }
    }
    try {
        const users = await User.find(searchQuery)
            .skip(skipUser)
            .limit(limit)
            .sort({ createdAt: 1 })
            .select('-password')
        const totalUser = await User.countDocuments(searchQuery)
        res.json({ success: true, users: users, totalUsers: totalUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {getAllUsers};