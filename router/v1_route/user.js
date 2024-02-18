const { getAllUsers } = require('../../controller/userController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.get('/get-all-user', adminTokenVerify, getAllUsers);

module.exports = router;