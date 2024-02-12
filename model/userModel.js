const mongoose = require("mongoose");
const { galiver_DB } = require("../db.config");

module.exports = galiver_DB.model('User', new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    verifiedEmail: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'seller'],
        required: true,
        default: 'user',
    },
    address: {
        fullAddress: {
            type: String,
        },
        district: {
            type: String,
        },
        area: {
            type: String,
        },
    },
    avatar: {
        type: String,
    },
    country: {
        type: String,
    },
    dob: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    loginType: {
        type: String,
        enum: ['local', 'google'],
        required: true,
        default: 'local',
    },
}, {
    timestamps: true
}))