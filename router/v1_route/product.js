const { createProduct } = require('../../controller/productController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.post('/', adminTokenVerify, createProduct)

module.exports = router;