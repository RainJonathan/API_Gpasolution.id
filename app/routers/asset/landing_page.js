const express = require('express');
const router = express.Router();
const landingPageController = require('../../controllers/aset/landing_page_controller');

// Routes
router.get('/', landingPageController.get);

module.exports = router;
