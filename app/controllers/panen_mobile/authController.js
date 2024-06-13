const {MobilePool} = require('../../../db/config');
function validateNotEmpty(value) {
    return value !== null && value !== undefined && value !== '';
}
// Controller methods
const getAllItems = (req, res) => {
    const { username, password } = req.body;

    // Validate if username and password are provided
    if (!validateNotEmpty(username) || !validateNotEmpty(password)) {
        return res.status(400).json({ error: true, message: "Username and password are required." });
    }

    // Check username and password in the database
    MobilePool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from MobilePool: ' + err);
            return res.status(500).json({ error: true, message: 'Error getting connection from MobilePool' });
        }

        connection.query('SELECT id, nik, jk, id_tempat FROM users WHERE nama = ? AND alias_unit_kerja = ?', [username, password], (error, results, fields) => {
            if (error) {
                console.error('Error querying database: ' + error);
                connection.release();
                return res.status(500).json({ error: true, message: 'Error querying database' });
            }

            if (results.length === 0) {
                connection.release();
                return res.status(200).json({ error: true, message: 'Invalid username or password' });
            }

            const userData = results[0]; // Assuming only one user with given username/password exists

            // Retrieve related data from mst_tempat using id_tempat
            const id_tempat = userData.id_tempat;
            connection.query('SELECT kebun, afdeling FROM mst_tempat WHERE id = ?', [id_tempat], (err, tempatResults) => {
                if (err) {
                    console.error('Error querying mst_tempat: ' + err);
                    connection.release();
                    return res.status(500).json({ error: true, message: 'Error querying related data' });
                }

                connection.release();

                // Assuming tempatResults has the related data from mst_tempat
                const { kebun, afdeling } = tempatResults[0]; // Extract kebun and afdeling from tempatResults

                // Construct the flattened response object
                const responseData = {
                    id: userData.id,
                    nik: userData.nik,
                    jk: userData.jk,
                    id_tempat: userData.id_tempat,
                    kebun: kebun,
                    afdeling: afdeling
                };

                return res.status(200).json({ error: false, message: 'User found', data: responseData });
            });
        });
    });
};


const createItem = (req, res) => {
    const newItem = req.body;
    MobilePool.query('INSERT INTO mst_kebun SET ?', newItem, (error, results) => {
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
    MobilePool.query('UPDATE mst_kebun SET ? WHERE id = ?', [updatedItem, id], (error, results) => {
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
    MobilePool.query('DELETE FROM mst_kebun WHERE id = ?', id, (error, results) => {
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
