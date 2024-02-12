const { signUp, signUpOtpVerify } = require('../../../controler/authControler');

const router = require('express').Router();

router.post('/signup', signUp);
router.post('/signup-otp-verify', signUpOtpVerify);


module.exports = router;