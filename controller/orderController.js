const orderEmail = require("../emailService/orderEmail");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");

const createOrder = async (req, res) => {
    try {
        const data = await req.body;
        const product = await Product.findById(data.product).select("price title discount");
        const discountPrice = await product.price - product.discount;
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const totalOrder = await Order.countDocuments()
        const order = new Order({
            product: data.product,
            name: data.name,
            phone: data.phone,
            address: data.address,
            quantity: data.quantity,
            district: data.district,
            subDistrict: data.subDistrict,
            deliveryCharge: data.deliveryCharge,
            total: (discountPrice * data.quantity) + data.deliveryCharge,
            color: data.color || 'N/A',
            size: data.size || 'N/A',
            height: data.height || 'N/A',
            width: data.width || 'N/A',
            material: data.material || 'N/A',
            variant: data.variant || 'N/A',
        });
        await order.save();
        await orderEmail(data, discountPrice, totalOrder + 1, (discountPrice * data.quantity) + data.deliveryCharge, product.title);
        await res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createOrder };