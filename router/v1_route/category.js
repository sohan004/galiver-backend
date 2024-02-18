const { categoryGetAdmin, createCategory, deleteCategory } = require('../../controller/categoryController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.get('/get-category-admin', adminTokenVerify, categoryGetAdmin)
router.post('/create-category', adminTokenVerify, createCategory)
router.delete('/delete-category/:categoryId', adminTokenVerify, deleteCategory)

module.exports = router;