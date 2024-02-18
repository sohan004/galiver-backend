const { getSubCategories, createSubCategory, deleteSubCategory } = require('../../controller/subCategoriesController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.get('/', adminTokenVerify, getSubCategories)
router.post('/', adminTokenVerify, createSubCategory)
router.delete('/:subCategoryId', adminTokenVerify, deleteSubCategory)


module.exports = router;