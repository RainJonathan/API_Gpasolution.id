const express = require('express');
const router = express.Router();
const authController = require('../../controllers/panen_mobile/authController');

// Routes
router.post('/', authController.getAllItems);
// router.post('/', authController.createItem);
// router.put('/:id', authController.updateItem);
// router.delete('/:id', authController.deleteItem);

module.exports = router;
