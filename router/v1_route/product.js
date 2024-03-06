const { createProduct, inTotalProduct, getPendingProduct, approveProduct, rejectProduct, getApprovedProduct, getRejectedProduct, active, inactive } = require('../../controller/productController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.post('/', adminTokenVerify, createProduct)
router.get('/in-total-product', adminTokenVerify, inTotalProduct)
router.get('/pending', adminTokenVerify, getPendingProduct)
router.get('/approve', adminTokenVerify, getApprovedProduct)
router.get('/reject', adminTokenVerify, getRejectedProduct)
router.put('/approve/:id', adminTokenVerify, approveProduct)
router.put('/reject/:id', adminTokenVerify, rejectProduct)
router.put('/active/:id', adminTokenVerify, active)
router.put('/inactive/:id', adminTokenVerify, inactive)

module.exports = router;

