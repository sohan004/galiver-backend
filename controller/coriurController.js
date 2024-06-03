const { default: axios } = require("axios");
const courierModel = require("../model/courierModel");

const createCourier = async (req, res) => {
    try {
        const courier = await new courierModel({
            name: 'Steed Fast',
            image: 'steadfast-app@2x-100.jpg',
        })
        await courier.save();
        await res.status(201).json({ message: "Courier created successfully" });
    } catch (error) {

    }
}


const getCourier = async (req, res) => {
    try {
        const courier = await courierModel.find().select('-api_key -secret_key')
        await res.status(200).json(courier);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


const updateCourier = async (req, res) => {
    try {
        const { courierId, api = '', secret = '' } = await req.body;
        const courier = await courierModel.findById(courierId);
        if (!courier) {
            return res.status(404).json({ message: "Courier not found" });
        }
        await courierModel.findByIdAndUpdate(courierId, {
            is_active: !courier?.is_active,
            api_key: api,
            secret_key: secret,
        });
        await res.status(200).json({ message: "Courier updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


const trackCourier = async (req, res) => {
    try {
        const { id } = await req.params;
        const courier = await courierModel.findOne()
        if (!courier?.is_active) {
            return res.status(400).json({ message: "Courier is not active" });
        }
        const headers = await {
            'Content-Type': 'application/json',
            'Api-Key': courier.api_key,
            'Secret-Key': courier.secret_key,
        }
        const response = await axios.get(`${process.env.STEED_FAST_URL}/status_by_trackingcode/${id}`, { headers });
        console.log(response.data);
        return res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


module.exports = { createCourier, getCourier, updateCourier , trackCourier };