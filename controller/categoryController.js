const Category = require('../model/categoryModel');
const fs = require('fs');
const path = require('path');
const genUniqFileName = require('../utilities/genUniqFileName');

const categoryGetAdmin = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ categories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


const createCategory = async (req, res) => {
    const image = req.files.image;
    const { name } = JSON.parse(req.body.data);
    try {
        const mediaDir = path.join(__dirname, '../media');
        if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir);
        }
        const fileNewName = await genUniqFileName(image.name);
        const filePath = await path.join(mediaDir, fileNewName);
        const category = new Category({
            name,
            avatar: fileNewName,
        });
        await category.save();
        await image.mv(filePath)
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await Category.findByIdAndDelete(categoryId);
        const mediaDir = path.join(__dirname, '../media');
        const filePath = path.join(mediaDir, category.avatar);
        if (fs.existsSync(filePath)) {
            await fs.unlinkSync(filePath);
        }
        res.status(200).json({ message: 'Category deleted successfully', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}



module.exports = { categoryGetAdmin, createCategory, deleteCategory };