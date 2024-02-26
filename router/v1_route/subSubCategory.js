const { getSubSubCategories, createSubSubCategory, deleteSubSubCategory, getSpecificSubSubCategories } = require('../../controller/subSubCategoriesController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.get('/', adminTokenVerify, getSubSubCategories)
router.get('/:subCategoryId', adminTokenVerify, getSpecificSubSubCategories)
router.post('/', adminTokenVerify, createSubSubCategory)
router.delete('/:subSubCategoryId', adminTokenVerify, deleteSubSubCategory)

module.exports = router;