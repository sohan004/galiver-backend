const { createCourier, getCourier, updateCourier, trackCourier } = require('../../controller/coriurController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

// router.post('/', createCourier)
router.get('/', adminTokenVerify, getCourier)
router.put('/', adminTokenVerify, updateCourier)
router.get('/track/:id', adminTokenVerify, trackCourier)

module.exports = router;