const express = require('express');
const router = express.Router();
const landingPageController = require('../controllers/landingPageController');

// Routes
router.get('/', landingPageController.get);
// router.post('/', landingPageController.createItem);
// router.put('/:id', landingPageController.updateItem);
// router.delete('/:id', landingPageController.deleteItem);

module.exports = router;
