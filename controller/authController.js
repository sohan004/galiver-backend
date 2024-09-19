const genUserName = require("../utilities/genUserName");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const emailOtp = require("../emailService/emailOtpSend");
const Otp = require("../model/otpModel");
const congratulationEmail = require("../emailService/congratulation");



const signUp = async (req, res) => {
    try {
        const { email, password, name } = await req.body;
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const userName = await genUserName(name);
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const otp = await Math.floor(1000 + Math.random() * 9000);
        const newOtp = await new Otp({
            otp: otp
        })
        await newOtp.save()
        const data = {
            email,
            name,
            userName,
            password: hashPassword,
            otp: newOtp._id
        }
        const token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '5m' });
        const otpSend = await emailOtp(
            email,
            'Signup OTP',
            otp,
            'Sign Up',
            name)
        res.json({ success: true, token: token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const signUpOtpVerify = async (req, res) => {
    try {
        const { otp, token } = await req.body;
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const findOtp = await Otp.findById(decode.otp);
        if (!findOtp) {
            return res.status(400).json({ message: 'OTP is expired' })
        }
        if (+findOtp.otp !== +otp) {
            return res.status(400).json({ message: 'Invalid OTP' })
        }
        const findUser = await User.findOne({ email: decode.email });
        if (findUser) {
            return res.status(400).json({ message: 'User already exists' })
        }
        delete decode?.otp;
        delete decode?.iat;
        delete decode?.exp;
        
        const newUser = await new User(decode);
        await newUser.save();
        const newToken = await jwt.sign({
            userID: newUser._id,
        }, process.env.JWT_SECRET, { expiresIn: '30d' })
        delete decode?.password;
        await congratulationEmail(decode.email, 'Successfully Sign up🎉🎉', "You've successfully signed up. Welcome to Galiver!");
        res.json({ success: true, token: newToken, info: decode });
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
            userID: findUser._id,
        }, process.env.JWT_SECRET, { expiresIn: '30d' })
        let userData = findUser.toObject();
        delete userData?.password;
        res.json({ success: true, token: token, info: userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const autoLogin = async (req, res) => {
    try {
        const { userID } = await req.user;
        const findUser = await User.findById(userID).select('-password');
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
            userID: findUser._id,
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
        const { userID } = await req.user;
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



module.exports = { signUp, signUpOtpVerify, autoLogin, login, adminLogin, adminAutoLogin };