const express = require('express');
const router = express.Router();
const documentationController = require('../../controllers/documentations/documentationController');

// Routes
// router.get('/', documentationController.getAllItems);
router.get('/', documentationController.whatsapp);
// router.put('/:id', documentationController.updateItem);
// router.delete('/:id', documentationController.deleteItem);

module.exports = router;
