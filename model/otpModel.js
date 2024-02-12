const { default: mongoose } = require("mongoose");
const { galiver_DB } = require("../db.config");

module.exports = galiver_DB.model('Otp', new mongoose.Schema({
    otp: {
        type: Number,
        required: true,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: 180 },
    }
}))