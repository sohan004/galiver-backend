const { createOrder, acceptOrder, getOrder, changeOrderStatus } = require('../../controller/orderController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.post('/', createOrder);
router.get('/', adminTokenVerify, getOrder);
router.post('/accept', adminTokenVerify, acceptOrder);
router.put('/', adminTokenVerify, changeOrderStatus);


module.exports = router;