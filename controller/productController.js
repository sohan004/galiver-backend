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
            discount: +discount,
            media: fileNameType,
            deliveryCharge: +deliveryCharge,
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


module.exports = {
    createProduct
}