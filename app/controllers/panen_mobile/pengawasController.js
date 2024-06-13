const {MobilePool} = require('../../../db/config');
// Controller methods
const getAllItems = (req, res) => {
    MobilePool.query('SELECT * FROM mst_pengawas', (error, results) => {
        if (error) {
            console.error('Error fetching mst_pengawas:', error);
            res.status(500).json({ error: true, message: "error fetching from mst_pengawas" });
        } else {
            res.send({ pengawas: results });
        }
    }); 
};

const createItem = (req, res) => {
    const newItem = req.body;
    MobilePool.query('INSERT INTO mst_pengawas SET ?', newItem, (error, results) => {
        if (error) {
            console.error('Error creating item:', error);
            res.status(500).json({ error: 'Error creating item' });
        } else {
            newItem.id = results.insertId;
            res.status(201).json(newItem);
        }
    });
};

const updateItem = (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;
    MobilePool.query('UPDATE mst_pengawas SET ? WHERE id = ?', [updatedItem, id], (error, results) => {
        if (error) {
            console.error('Error updating item:', error);
            res.status(500).json({ error: 'Error updating item' });
        } else {
            res.json(updatedItem);
        }
    });
};

const deleteItem = (req, res) => {
    const { id } = req.params;
    MobilePool.query('DELETE FROM mst_pengawas WHERE id = ?', id, (error, results) => {
        if (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ error: 'Error deleting item' });
        } else {
            res.sendStatus(204);
        }
    });
};

module.exports = {
    getAllItems,
    createItem,
    updateItem,
    deleteItem
};
