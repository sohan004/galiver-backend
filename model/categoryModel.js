const { default: mongoose } = require("mongoose");
const { galiver_DB } = require("../db.config");

module.exports = galiver_DB.model('Category', new mongoose.Schema({
   name: {
       type: String,
       required: true,
   },
   avatar: {
       type: String,
   },
}, {
    timestamps: true,
}))