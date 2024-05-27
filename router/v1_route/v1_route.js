const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/category', require('./category'));
router.use('/media', require('./media'));
router.use('/sub-category', require('./subCategory'));
router.use('/sub-sub-category', require('./subSubCategory'));
router.use('/product', require('./product'));
router.use('/order', require('./order'));

module.exports = router;