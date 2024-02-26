const { getSubCategories, createSubCategory, deleteSubCategory, getSpecificSubCategories } = require('../../controller/subCategoriesController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.get('/', adminTokenVerify, getSubCategories)
router.get('/:categoryId', adminTokenVerify, getSpecificSubCategories)
router.post('/', adminTokenVerify, createSubCategory)
router.delete('/:subCategoryId', adminTokenVerify, deleteSubCategory)


module.exports = router;