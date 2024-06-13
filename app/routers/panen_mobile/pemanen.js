const express = require('express');
const router = express.Router();
const pemanenController = require('../../controllers/panen_mobile/pemanenController');

// Routes
// router.get('/', pemanenController.getAllItems);
router.post('/', pemanenController.createItem);
// router.put('/:id', pemanenController.updateItem);
// router.delete('/:id', pemanenController.deleteItem);

module.exports = router;
