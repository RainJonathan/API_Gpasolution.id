const whatsapp = require("wa-multi-session");
const ValidationError = require("../../../utils/error");
const {AssetsPool} = require("../../../db/config");

exports.sendMessage = async (req, res, next) => {
    try {
        // Get the session ID from the request
        const sessionId = req.body.session || req.query.session || req.headers.session;
        if (!sessionId) throw new ValidationError("Session Not Found");

        // Get a connection from the pool
        const connection = await AssetsPool.getConnection();

        try {
            // Fetch data from the database
            const [rows] = await connection.query('SELECT * FROM outbox WHERE send_status = "N"');

            if (rows.length === 0) {
                connection.release(); // Release the connection back to the pool
                res.status(200).json({ message: 'No data found to send messages.' });
                return;
            }

            // Send WhatsApp messages and collect results
            const results = await Promise.all(rows.map(async (row) => {
                try {
                    const send = await whatsapp.sendTextMessage({
                        sessionId,
                        to: row.wa_no,
                        isGroup: false, // Assuming individual messages, adjust if needed
                        text: row.wa_text,
                    });

                    // Update the sent_status and created_by fields in the database
                    await connection.query(
                        'UPDATE outbox SET send_status = ?, created_by = ? WHERE id = ?',
                        ['Y', 'asset', row.id]
                    );

                    return {
                        id: row.id,
                        status: send?.status,
                        message: send?.message?.extendedTextMessage?.text || "Not Text",
                        remoteJid: send?.key?.remoteJid,
                        error: null,
                    };
                } catch (sendError) {
                    return {
                        id: row.id,
                        status: 'failed',
                        message: null,
                        remoteJid: null,
                        error: sendError.message,
                    };
                }
            }));

            // Release the connection back to the pool
            connection.release();

            // Send the results as a JSON response
            res.status(200).json(results);

        } catch (queryError) {
            connection.release(); // Release the connection back to the pool if a query error occurs
            next(queryError);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = exports;
