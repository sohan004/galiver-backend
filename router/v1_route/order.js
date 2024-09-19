const { createOrder, acceptOrder, getOrder, changeOrderStatus, editOrder, getProfitSummery } = require('../../controller/orderController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.post('/', createOrder);
router.get('/', adminTokenVerify, getOrder);
router.post('/accept', adminTokenVerify, acceptOrder);
router.put('/', adminTokenVerify, changeOrderStatus);
router.put('/edit', adminTokenVerify, editOrder);
router.get('/summery', getProfitSummery);


module.exports = router;