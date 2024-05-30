const { createProduct, inTotalProduct, getPendingProduct, approveProduct, rejectProduct, getApprovedProduct, getRejectedProduct, active, inactive, searchProducts, productInDetail, getRandomProducts, updateProduct, deleteProduct } = require('../../controller/productController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');
const Product = require('../../model/productModel');

const router = require('express').Router();

router.post('/', adminTokenVerify, createProduct)
router.put('/:id', adminTokenVerify, updateProduct)
router.delete('/:id', adminTokenVerify, deleteProduct)
router.get('/in-total-product', adminTokenVerify, inTotalProduct)
router.get('/detail/:id', productInDetail)
router.get('/pending', adminTokenVerify, getPendingProduct)
router.get('/approve', adminTokenVerify, getApprovedProduct)
router.get('/reject', adminTokenVerify, getRejectedProduct)
router.put('/approve/:id', adminTokenVerify, approveProduct)
router.put('/reject/:id', adminTokenVerify, rejectProduct)
router.put('/active/:id', adminTokenVerify, active)
router.put('/inactive/:id', adminTokenVerify, inactive)
router.get('/search', searchProducts)
router.get('/random', getRandomProducts)

module.exports = router;

