const { default: mongoose } = require("mongoose");
const { galiver_DB } = require("../db.config");

module.exports = galiver_DB.model("LandingPage", new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    id: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
    },
    title1: {
        type: String,
        required: true,
    },
    title2: {
        type: String,
        required: true,
    },
    description1: {
        type: String,
        required: true,
    },
    description2: {
        type: String,
        required: true,
    },
    img1: {
        type: String,
        required: true,
    },
    img2: {
        type: String,
        required: true,
    },
    img3: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
}))