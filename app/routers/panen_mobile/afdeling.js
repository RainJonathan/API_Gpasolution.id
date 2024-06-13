const express = require('express');
const router = express.Router();
const afdelingController = require('../../controllers/panen_mobile/afdelingController');

// Routes
router.get('/', afdelingController.getAllItems);
router.get('/:id', afdelingController.getById);
// router.post('/', afdelingController.createItem);
// router.put('/:id', afdelingController.updateItem);
// router.delete('/:id', afdelingController.deleteItem);

module.exports = router;
