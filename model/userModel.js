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
        subDistrict: {
            type: String,
        },
    },
    avatar: {
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
}, {
    timestamps: true
}))