const genUserName = require("../utilities/genUserName");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const emailOtp = require("../utilities/emailOtpSend");
const Otp = require("../model/otpModel");
const requestIp = require('request-ip');
const geoip = require('geoip-lite');



const signUp = async (req, res) => {
    // const clientIp = await requestIp.getClientIp(req);
    // const geo = await geoip.lookup(clientIp);
    // console.log(clientIp, geo, req.connection.remoteAddress);
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
        decode['verifiedEmail'] = true;

        const newUser = await new User(decode);
        await newUser.save();
        const newToken = await jwt.sign({
            userID: newUser._id,
        }, process.env.JWT_SECRET, { expiresIn: '30d' })

        delete decode?.password;
        res.json({ success: true, token: newToken, info: decode });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = { signUp, signUpOtpVerify };