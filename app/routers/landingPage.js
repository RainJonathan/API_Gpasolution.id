// landingPageRouter.js

const express = require('express');
const router = express.Router();
const landingPageController = require('../controllers/landingPageController');

router.get('/', landingPageController.getLandingPage);
router.get('/login', landingPageController.getLoginPage);
router.post('/login', landingPageController.postLogin);
router.get('/logout', landingPageController.logout);

module.exports = router;
