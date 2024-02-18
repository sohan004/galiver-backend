const { categoryGetAdmin, createCategory } = require('../../controller/categoryController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.get('/get-category-admin', adminTokenVerify, categoryGetAdmin)
router.post('/create-category', adminTokenVerify, createCategory)

module.exports = router;