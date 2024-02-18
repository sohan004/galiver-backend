const { default: mongoose } = require("mongoose");
const { galiver_DB } = require("../db.config");

module.exports = galiver_DB.model('Order', new mongoose.Schema({
    customer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    products: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            avatar: {
                type: String,
            },
        }
    ],
    deliveryCharge: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    payment: {
        method: {
            type: String,
            required: true,
            enum: ['cash', 'card', 'bkash', 'rocket', 'card', 'bank'],
        },
        transaction_id: {
            type: String,
        },
        paid: {
            type: Boolean,
            required: true,
        }
    },
    shipping: {
        status: {
            type: String,
        },
        tracking_number: {
            type: String,
        },
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    },
    default: 'pending'
}, {
    timestamps: true,
}))