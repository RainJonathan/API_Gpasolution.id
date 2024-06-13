const express = require('express');
const router = express.Router();
const blokController = require('../../controllers/panen_mobile/blokController');

// Routes
router.get('/', blokController.getAllItems);
router.get('/:id', blokController.getById);
// router.post('/', blokController.createItem);
// router.put('/:id', blokController.updateItem);
// router.delete('/:id', blokController.deleteItem);

module.exports = router;
