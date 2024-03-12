const { default: mongoose } = require("mongoose");
const { galiver_DB } = require("../db.config");

module.exports = galiver_DB.model('SearchKey', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
}))