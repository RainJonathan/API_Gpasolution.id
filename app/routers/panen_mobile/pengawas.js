const express = require('express');
const router = express.Router();
const pengawasController = require('../../controllers/panen_mobile/pengawasController');

// Routes
router.get('/', pengawasController.getAllItems);
// router.post('/', pengawasController.createItem);
// router.put('/:id', pengawasController.updateItem);
// router.delete('/:id', pengawasController.deleteItem);

module.exports = router;
