const path = require('path');
const fs = require('fs');
const genUniqFileName = require('../utilities/genUniqFileName');
const ladingPageModel = require('../model/ladingPageModel');
const productModel = require('../model/productModel');

const createLandingPage = async (req, res) => {
    try {
        const file = await req.files.file
        const data = await JSON.parse(req.body.data)
        const { title } = await productModel.findById(data.product).select('title')
        console.log(title);
        const id = await title.toLowerCase().replaceAll(' ', '-')
        const mediaDir = await path.join(__dirname, '../media');
        const [img1, img2, img3] = await Promise.all(file.map(async (f) => {
            const fileNewName = await genUniqFileName(f.name)
            const fileDir = await path.join(mediaDir, fileNewName)
            await f.mv(fileDir)
            return fileNewName
        }))
        const newLandingPage = await new ladingPageModel({
            id: id,
            img1,
            img2,
            img3,
            ...data
        }).save()
        await res.status(201).json({ message: "landing page create successfully", data: newLandingPage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getAllLandingPage = async (req, res) => {
    try {
        const landingPages = await ladingPageModel.find().populate('product', 'title price')
        await res.status(200).json({ message: "landing pages fetched successfully", data: landingPages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getLandingPageDetails = async (req, res) => {
    try {
        const id = await req.params.id
        const landingPage = await ladingPageModel.findOne({ id }).populate('product')
        await res.status(200).json({ message: "landing page fetched successfully", data: landingPage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const deleteLandingPage = async (req, res) => {
    try {
        const id = await req.params.id
        const landingPage = await ladingPageModel.findById(id)
        const mediaDir = await path.join(__dirname, '../media');
        await Promise.all([landingPage.img1, landingPage.img2, landingPage.img3].map(async (img) => {
            const imgPath = await path.join(mediaDir, img)
            await fs.unlink(imgPath, (err) => {
                if (err) throw err;
                console.log('File deleted!');
            });
        }))
        await ladingPageModel.findByIdAndDelete(id)
        await res.status(200).json({ message: "landing page deleted successfully", data: landingPage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createLandingPage,
    getAllLandingPage,
    getLandingPageDetails,
    deleteLandingPage
}