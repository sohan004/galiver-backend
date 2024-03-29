const Product = require("../model/productModel");
const genUniqFileName = require("../utilities/genUniqFileName");
const path = require('path');
const fs = require('fs');
const { default: mongoose } = require("mongoose");
const Review = require('../model/reviewModel');
const SearchKey = require("../model/searchKeyModel");
const FavProduct = require("../model/favProductModel");

const searchProducts = async (req, res) => {
    try {
        const { skip, search, category, sub, subsub, limit } = await req.query;
        let query = [];
        if (search) {
            query.push({ title: { $regex: search, $options: 'i' } });
            query.push({ tags: { $regex: search, $options: 'i' } });
            query.push({ brand: { $regex: search, $options: 'i' } });
            const searchKey = await SearchKey.findOne({ name: search });
            if (searchKey) {
                searchKey.count = searchKey.count + 1;
                await searchKey.save();
            } else {
                await new SearchKey({ name: search, count: 1 }).save();
            }
        }
        if (category) {
            query.push({ category: new mongoose.Types.ObjectId(category) });
        }
        if (sub) {
            query.push({ subCategory: new mongoose.Types.ObjectId(sub) });
        }
        if (subsub) {
            query.push({ subSubCategory: new mongoose.Types.ObjectId(subsub) });
        }
        if (query.length === 0) {
            query.push({});
        }
        const products = await Product.aggregate([
            {
                $match: {
                    $and: [
                        { status: 'active' },
                        {
                            $or: [
                                ...query
                            ]
                        },
                    ]
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    avgRating: { $avg: '$reviews.rating' },
                    reviews: { $size: '$reviews' }
                }
            },
            {
                $addFields: {
                    avgRating: {
                        $cond: {
                            if: { $eq: ['$avgRating', null] },
                            then: 0,
                            else: '$avgRating'
                        }
                    }
                }
            },
            {
                $sort: {
                    avgRating: -1,
                    createdAt: -1,
                }
            },
            {
                $skip: skip ? +skip : 0
            },
            {
                $limit: limit ? +limit : 16
            },
            {
                $sample: { size: limit ? +limit : 16 }
            },
            {
                $unwind: {
                    path: '$media',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    price: { $first: '$price' },
                    discount: { $first: '$discount' },
                    media: { $first: '$media' },
                    tags: { $first: '$tags' },
                    reviews: { $first: '$reviews' },
                    avgRating: { $first: '$avgRating' }
                }
            },
            {
                $sort: {
                    avgRating: -1
                }
            },
            {
                $project: {
                    title: 1,
                    price: 1,
                    discount: 1,
                    media: {
                        name: 1,
                        type: 1
                    },
                    reviews: 1,
                    avgRating: 1
                }
            }
        ])
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json([]);
    }
}

const productInDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const {user} = req.query;
        const product = await Product.findOne({
            _id: id,
            status: { $in: ['active', 'inactive'] }
        }).populate([
            {
                path: 'category',
            },
            {
                path: 'subCategory',
                select: '-category'
            },
            {
                path: 'subSubCategory',
                select: '-category -subCategory'
            }
        ]).select('-createdAt -updatedAt -__v -click');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const reviews = await Review.find({ product: id }).sort({ createdAt: -1 }).populate('user', 'name avatar -_id').limit(5);
        const totalReview = await Review.find({ product: id }).countDocuments();
        const fav = await FavProduct.findOne({ user: user || null, product: id });

        res.json({ ...product.toObject(), reviews, totalReview, isFavorite: fav ? true : false });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


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
    inactive,
    searchProducts,
    productInDetail
}