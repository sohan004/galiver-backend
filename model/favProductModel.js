// Require Mongoose
var mongoose = require('mongoose');
const { galiver_DB } = require('../db.config');

module.exports = galiver_DB.model('FavoriteProduct', new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
}, {
    timestamps: true
}));