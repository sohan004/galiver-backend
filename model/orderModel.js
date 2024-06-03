const { default: mongoose } = require("mongoose");
const { galiver_DB } = require("../db.config");

module.exports = galiver_DB.model('Order', new mongoose.Schema({
    orderProduct: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            color: {
                type: String,
            },
            size: {
                type: String,
            },
            height: {
                type: String,
            },
            width: {
                type: String,
            },
            material: {
                type: String,
            },
            variant: {
                type: String,
            },
        }
    ],
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    subDistrict: {
        type: String,
        required: true,
    },
    deliveryCharge: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'shipped', 'delivered', 'canceled', 'returned'],
        default: 'pending',
    },
    consignment_id: {
        type: String,
    },
    tracking_id: {
        type: String,
    },
}))