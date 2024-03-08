const { categoryGetAdmin, createCategory, deleteCategory, getAllCategorySubCategory } = require('../../controller/categoryController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.get('/get-category-admin', adminTokenVerify, categoryGetAdmin)
router.get('/get-category-list', getAllCategorySubCategory)
router.post('/create-category', adminTokenVerify, createCategory)
router.delete('/delete-category/:categoryId', adminTokenVerify, deleteCategory)

module.exports = router;