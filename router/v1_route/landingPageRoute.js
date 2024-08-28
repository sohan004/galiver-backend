const { createLandingPage, getAllLandingPage, getLandingPageDetails, deleteLandingPage } = require('../../controller/landingPageController');
const adminTokenVerify = require('../../middleware/adminTokenVerify');

const router = require('express').Router();

router.post('/create', adminTokenVerify, createLandingPage)
router.get('/', getAllLandingPage)
router.get('/:id', getLandingPageDetails)
router.delete('/:id', adminTokenVerify, deleteLandingPage)


module.exports = router