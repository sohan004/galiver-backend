const Product = require("../model/productModel");
const genUniqFileName = require("../utilities/genUniqFileName");
const path = require('path');
const fs = require('fs');

const createProduct = async (req, res) => {
    try {
        const file = await req.files?.media;
        const { shop, size, color, material, variant, height, width, price, discount, deliveryCharge, subCategory, subSubCategory, ...otherData } = await JSON.parse(req.body.data);
        const productImg = Array.isArray(file) ? file : [file]
        const fileUniqName = await Promise.all(productImg.map(async (img) => {
            img.name = await genUniqFileName(img.name);
            return img;
        }))

        const fileNameType = await Promise.all(fileUniqName.map(img => {
            return { name: img.name, type: img.mimetype }
        }))

        let extraData = {}
        if (subCategory) {
            extraData['subCategory'] = subCategory;
        }
        if (subSubCategory) {
            extraData['subSubCategory'] = subSubCategory;
        }
        if (shop) {
            extraData['shop'] = shop;
        }

        const product = await new Product({
            ...otherData,
            ...extraData,
            price: +price,
            discount: +discount || 0,
            media: fileNameType,
            deliveryCharge: +deliveryCharge || 0,
            attributes: {
                size: size || [],
                color: color || [],
                material: material || [],
                variant: variant || [],
                height: height || [],
                width: width || []
            }
        });
        const mediaPath = path.join(__dirname, '../media');
        if (!fs.existsSync(mediaPath)) {
            fs.mkdirSync(mediaPath);
        }
        await Promise.all(fileUniqName.map((async (img) => {
            const imagePath = path.join(mediaPath, img.name);
            await img.mv(imagePath);
        })))
        const savedProduct = await product.save();
        res.json({ message: 'Product created successfully', success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const inTotalProduct = async (req, res) => {
    const activeQuery = { status: { $in: ['active', 'inactive'] } }
    const pendingQuery = { status: 'pending' }
    const rejectedQuery = { status: { $in: ['suspended', 'rejected'] } }
    try {
        const approvedProduct = await Product.find(activeQuery).countDocuments();
        const pendingProduct = await Product.find(pendingQuery).countDocuments();
        const rejectedProduct = await Product.find(rejectedQuery).countDocuments();

        res.json({ approvedProduct, pendingProduct, rejectedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getPendingProduct = async (req, res) => {
    try {
        const pendingProduct = await Product.find({ status: 'pending' }).sort({ createdAt: -1 })
        res.json(pendingProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getApprovedProduct = async (req, res) => {
    try {
        const approvedProduct = await Product.find({ status: { $in: ['active', 'inactive'] } }).sort({ createdAt: -1 })
        res.json(approvedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getRejectedProduct = async (req, res) => {
    try {
        const rejectedProduct = await Product.find({ status: { $in: ['suspended', 'rejected'] } }).sort({ createdAt: -1 })
        res.json(rejectedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const approveProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.status = 'active';
        await product.save();
        res.json({ message: 'Product approved successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const rejectProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.status = 'rejected';
        await product.save();
        res.json({ message: 'Product rejected successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const suspendProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.status = 'suspended';
        await product.save();
        res.json({ message: 'Product suspended successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const active = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.status = 'active';
        await product.save();
        res.json({ message: 'Product activated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const inactive = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.status = 'inactive';
        await product.save();
        res.json({ message: 'Product inactivated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    createProduct,
    inTotalProduct,
    getPendingProduct,
    getApprovedProduct,
    getRejectedProduct,
    approveProduct,
    rejectProduct,
    suspendProduct,
    active,
    inactive
}