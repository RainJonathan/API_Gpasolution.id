const express = require('express');
const router = express.Router();
const kebunController = require('../../controllers/panen_mobile/kebunController');

// Routes
router.get('/', kebunController.getAllItems);
router.get('/:id', kebunController.getById);
// router.post('/', kebunController.createItem);
// router.put('/:id', kebunController.updateItem);
// router.delete('/:id', kebunController.deleteItem);

module.exports = router;
