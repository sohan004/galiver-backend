const genUserName = require("../utilities/genUserName");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const emailOtp = require("../emailService/emailOtpSend");
const Otp = require("../model/otpModel");
const congratulationEmail = require("../emailService/congratulation");
const getOtp = require("../utilities/getOtp");



const signUp = async (req, res) => {
    try {
        const { email, password, name, otp } = await req.body;
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const findOtp = await Otp.findOne({ email: email });
        if (!findOtp) {
            return res.status(400).json({ message: 'Otp Time Expire' });
        }
        if (+findOtp.otp !== +otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const data = {
            email,
            name,
            userName,
            password: hashPassword,
        }
        const user = await new User(data).save();
        const newToken = await jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '30d' })
        delete user?.password;
        return res.json({ success: true, token: newToken, logInfo: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const sendOtp = async (req, res) => {
    try {
        const { email } = await req.body;
        const otp =  getOtp();
        await new Otp({
            email,
            otp: otp
        }).save();
        await emailOtp(email, 'OTP', otp, 'Login');
        res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = await req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' })
        }
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        const match = await bcrypt.compare(password, findUser.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = await jwt.sign({
            id: findUser._id,
        }, process.env.JWT_SECRET, { expiresIn: '30d' })
        delete findUser?.password;
        res.json({ success: true, token: token, logInfo: findUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const autoLogin = async (req, res) => {
    try {
        const { id } = await req.user;
        const findUser = await User.findById(id).select('-password');
        if (!findUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.json({ success: true, info: findUser });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = await req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' })
        }
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (findUser.role !== 'admin') {
            return res.status(400).json({ message: 'Unauthorized' });
        }
        const match = await bcrypt.compare(password, findUser.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = await jwt.sign({
            id: findUser._id,
        }, process.env.JWT_SECRET, { expiresIn: '30d' })
        let userData = findUser.toObject();
        delete userData?.password;
        res.json({ success: true, token: token, info: userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const adminAutoLogin = async (req, res) => {
    try {
        const userID = await req.user.id;
        const findUser = await User.findById(userID).select('-password');
        if (!findUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (findUser.role !== 'admin') {
            return res.status(400).json({ message: 'Unauthorized' });
        }
        res.json({ success: true, info: findUser });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = { signUp, autoLogin, login, adminLogin, adminAutoLogin,  sendOtp};