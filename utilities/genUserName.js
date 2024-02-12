const User = require("../model/userModel");

const genUserName = async (name, num = 1000) => {
        const fullName = await name.replace(/\s/g, '').toLowerCase().slice(0, 10);
        const randomNum = await Math.floor(Math.random() * num);
        const userName = await `${fullName}_${randomNum}`;
        const checkUserName = await User.findOne({ userName });
        if (checkUserName) {
                return genUserName(name, num + 1000);
        }
        return userName;
}


module.exports = genUserName;