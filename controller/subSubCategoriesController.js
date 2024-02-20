const SubSubCategory = require('../model/subSubCategoryModel');
const genUniqFileName = require('../utilities/genUniqFileName');
const fs = require('fs');
const path = require('path');

const getSubSubCategories = async (req, res) => {
    try {
        const { name = '', skip = 0 } = await req.query;
        const limit = 20;
        let searchQuery = {};
        if (name) {
            searchQuery['name'] = { $regex: name, $options: 'i' }
        }
        const subSubCategories = await SubSubCategory.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(parseInt(skip))
            .limit(limit)
            .populate('subCategory', 'name');
        const totalSubSubCategories = await SubSubCategory.countDocuments(searchQuery);
        res.status(200).json({ subSubCategories, totalSubSubCategories });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


const createSubSubCategory = async (req, res) => {
    const image = await req.files.image;
    const { name, subCategoryId } = await JSON.parse(req.body.data);
    try {
        const mediaDir = path.join(__dirname, '../media');
        if (!fs.existsSync(mediaDir)) {
            await fs.mkdirSync(mediaDir);
        }
        const fileNewName = await genUniqFileName(image.name);
        const filePath = await path.join(mediaDir, fileNewName);
        const subSubCategory = new SubSubCategory({
            name,
            avatar: fileNewName,
            subCategory: subCategoryId,
        });
        await subSubCategory.save();
        await image.mv(filePath)
        const subSubCategoryPopulated = await SubSubCategory.findById(subSubCategory._id).populate('subCategory', 'name');
        res.status(201).json({ message: 'Sub Category created successfully', subSubCategory: subSubCategoryPopulated });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


const deleteSubSubCategory = async (req, res) => {
    try {
        const { subSubCategoryId } = req.params;
        const subSubCategory = await SubSubCategory.findById(subSubCategoryId);
        if (!subSubCategory) {
            return res.status(404).json({ message: 'Sub Sub Category not found' });
        }
        await SubSubCategory.findByIdAndDelete(subSubCategoryId);
        const mediaDir = path.join(__dirname, '../media');
        const filePath = path.join(mediaDir, subSubCategory.avatar);
        if (fs.existsSync(filePath)) {
            await fs.unlinkSync(filePath);
        }
        res.status(200).json({ message: 'Sub Category deleted successfully', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getSubSubCategories, createSubSubCategory, deleteSubSubCategory };   