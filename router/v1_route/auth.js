const { signUp, signUpOtpVerify, autoLogin, login, adminLogin, adminAutoLogin } = require('../../controller/authController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');
const tokenVerify = require('../../middleware/tokenVerify');

const router = require('express').Router();

router.post('/signup', signUp);
router.post('/signup-otp-verify', signUpOtpVerify);
router.get('/auto-login', tokenVerify, autoLogin);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/admin-auto-login',adminTokenVerify, adminAutoLogin);


module.exports = router;