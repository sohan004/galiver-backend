const { default: axios } = require("axios");
const orderEmail = require("../emailService/orderEmail");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const courierModel = require("../model/courierModel");

const createOrder = async (req, res) => {
    try {
        const data = await req.body;
        const product = await Product.findById(data.product).select("price title discount _id");
        const discountPrice = await product.price - product.discount;
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const totalOrder = await Order.countDocuments()
        const order = new Order({
            orderProduct: [
                {
                    product: product._id,
                    quantity: data.quantity,
                    color: data.color || 'N/A',
                    size: data.size || 'N/A',
                    height: data.height || 'N/A',
                    width: data.width || 'N/A',
                    material: data.material || 'N/A',
                    variant: data.variant || 'N/A',
                }
            ],
            name: data.name,
            phone: data.phone,
            address: data.address,
            quantity: data.quantity,
            district: data.district,
            subDistrict: data.subDistrict,
            deliveryCharge: data.deliveryCharge,
            total: (discountPrice * data.quantity) + data.deliveryCharge,
        });
        await order.save();
        await res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const createSteedFastOrder = async ({ _id, name, phone, address, subDistrict, district, total }, note, { api_key, secret_key }) => {
    try {
        const body = await {
            invoice: _id,
            recipient_name: name,
            recipient_phone: phone,
            recipient_address: `${address}, ${subDistrict}, ${district}`,
            cod_amount: total,
            note: note,
        }
        const headers = await {
            'Content-Type': 'application/json',
            'Api-Key': api_key,
            'Secret-Key': secret_key,
        }
        const response = await axios.post(`${process.env.STEED_FAST_URL}/create_order`, body, { headers });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return new Error(error)
    }
}


const acceptOrder = async (req, res) => {
    try {
        let consignment_id = '';
        let tracking_id = '';
        const { orderId, note = '' } = await req.body;
        const order = await Order.findById(orderId).populate("orderProduct.product", 'title price discount');
        const courier = await courierModel.findOne({ name: 'Steed Fast' });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (courier?.is_active) {
            const steedFast = await createSteedFastOrder(order, note, courier);
            consignment_id = steedFast.consignment.consignment_id;
            tracking_id = steedFast.consignment.tracking_code;
        }
        await Order.findByIdAndUpdate(orderId, {
            status: "accepted",
            consignment_id: consignment_id,
            tracking_id: tracking_id,
        });
        await res.status(200).json({ message: "Order accepted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const getOrder = async (req, res) => {
    try {
        const status = await req.query.status;
        let quary = {}
        if (status) {
            quary = { status: status }
        }
        const orders = await Order.find(quary).populate("orderProduct.product", 'title price discount').sort('-updatedAt');
        await res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const changeOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = await req.body;
        console.log(orderId, status);
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        await Order.findByIdAndUpdate(orderId, {
            status: status,
        });
        await res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createOrder,
    acceptOrder,
    getOrder,
    changeOrderStatus
};