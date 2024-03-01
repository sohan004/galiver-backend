const { default: mongoose } = require("mongoose");
const { galiver_DB } = require("../db.config");

const attributeProperty = [
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        extraCharge: {
            type: Number,
            required: true,
        }
    })
]

module.exports = galiver_DB.model('Product', new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    title: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    media: [
        new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
        })
    ],
    brand: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'suspended', 'pending', 'rejected'],
        default: 'pending',
        index: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        index: true,
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        index: true,
    },
    subSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSubCategory',
        index: true,
    },
    deliveryTime: {
        type: String,
        required: true,
    },
    deliveryCharge: {
        type: Number,
        required: true,
    },
    attributes: {
        size: attributeProperty,
        color: attributeProperty,
        material: attributeProperty,
        variant: attributeProperty,
        height: attributeProperty,
        width: attributeProperty,
    },
    tags: [
        {
            type: String,
            index: true,
        }
    ],
    click: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true,
}))