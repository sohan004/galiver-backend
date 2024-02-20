const { getSubSubCategories, createSubSubCategory, deleteSubSubCategory } = require('../../controller/subSubCategoriesController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.get('/', adminTokenVerify, getSubSubCategories)
router.post('/', adminTokenVerify, createSubSubCategory)
router.delete('/:subSubCategoryId', adminTokenVerify, deleteSubSubCategory)

module.exports = router;