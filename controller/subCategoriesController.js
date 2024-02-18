const SubCategory = require('../model/subCategoryModel');
const genUniqFileName = require('../utilities/genUniqFileName');
const fs = require('fs');
const path = require('path');

const getSubCategories = async (req, res) => {
    try {
        const { name = '' } = await req.query;
        const subCategories = await SubCategory.find({ name: { $regex: name, $options: 'i' } })
            .sort({ createdAt: -1 })
            .populate('category', 'name');
        res.status(200).json({ subCategories });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


const createSubCategory = async (req, res) => {
    const image = await req.files.image;
    const { name, categoryId } = await JSON.parse(req.body.data);
    try {
        const mediaDir = path.join(__dirname, '../media');
        if (!fs.existsSync(mediaDir)) {
            await fs.mkdirSync(mediaDir);
        }
        const fileNewName = await genUniqFileName(image.name);
        const filePath = await path.join(mediaDir, fileNewName);
        const subCategory = new SubCategory({
            name,
            avatar: fileNewName,
            category: categoryId,
        });
        await subCategory.save();
        await image.mv(filePath)
        const subCategoryPopulated = await SubCategory.findById(subCategory._id).populate('category', 'name');
        res.status(201).json({ message: 'Sub Category created successfully', subCategory : subCategoryPopulated });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


const deleteSubCategory = async (req, res) => {
    try {
        const { subCategoryId } = req.params;
        const subCategory = await SubCategory.findById(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: 'Sub Category not found' });
        }
        await SubCategory.findByIdAndDelete(subCategoryId);
        const mediaDir = path.join(__dirname, '../media');
        const filePath = path.join(mediaDir, subCategory.avatar);
        if (fs.existsSync(filePath)) {
            await fs.unlinkSync(filePath);
        }
        res.status(200).json({ message: 'Sub Category deleted successfully', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getSubCategories, createSubCategory, deleteSubCategory };