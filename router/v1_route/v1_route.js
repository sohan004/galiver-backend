const router = require('express').Router();

router.use('/auth', require('./auth/auth'));
router.use('/user', require('./user/user'));



module.exports = router;