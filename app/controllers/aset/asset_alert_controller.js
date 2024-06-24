const whatsapp = require("wa-multi-session");
const ValidationError = require("../../../utils/error");
const { AssetsPool } = require("../../../db/config");

exports.queryMessage = async (req, res, next) => {
    try {
        const sessionId = req.body.session || req.query.session || req.headers.session;
        const delay = req.body.delay;
        if (!sessionId) throw new ValidationError("Session Not Found");

        const connection = await AssetsPool.getConnection();

        try {
            const [rows] = await connection.query('SELECT * FROM outbox WHERE send_status = "N"');

            if (rows.length === 0) {
                connection.release();
                return res.status(200).json({ message: 'No data found to send messages.' });
            }

            res.status(200).json({ status: true, message: "Bulk Message is Processing" });

            const results = [];

            for (const row of rows) {
                try {
                    const send = await whatsapp.sendTextMessage({
                        sessionId,
                        to: row.wa_no,
                        isGroup: false,
                        text: row.wa_text,
                    });

                    await connection.query(
                        'UPDATE outbox SET send_status = ?, created_by = ? WHERE id = ?',
                        ['Y', 'asset', row.id]
                    );

                    results.push({
                        id: row.id,
                        status: send?.status,
                        message: send?.message?.extendedTextMessage?.text || "Not Text",
                        remoteJid: send?.key?.remoteJid,
                        error: null,
                    });

                    await whatsapp.createDelay(delay ?? 1000);

                } catch (sendError) {
                    results.push({
                        id: row.id,
                        status: 'failed',
                        message: null,
                        remoteJid: null,
                        error: sendError.message,
                    });

                    console.error(`Failed to send message to ${row.wa_no}: ${sendError.message}`);
                }
            }

            connection.release();
            // res.status(200).json({ status: true, data: { results } }); // Sending response once

        } catch (queryError) {
            connection.release();
            next(queryError);
        }

    } catch (error) {
        next(error);
    }
};

module.exports = exports;
