const {MobilePool} = require('../../../db/config');

const createItem = (req, res) => {

    const {
        no_lereng,
        pengawas,
        total_janjang,
        total_berondolan,
        tonase_terkirim,
        janjang_terkirim,
        total_karyawan,
        id_kebun,
        id_afdeling,
        id_blok,
        tahun_tanam,
        komidel,
        status_bayar,
        created_user,
        aktif,
        detail,
    } = req.body;
    if (
        no_lereng === null || no_lereng === undefined ||
        pengawas === null || pengawas === undefined ||
        total_janjang === null || total_janjang === undefined ||
        total_berondolan === null || total_berondolan === undefined ||
        tonase_terkirim === null || tonase_terkirim === undefined ||
        janjang_terkirim === null || janjang_terkirim === undefined ||
        total_karyawan === null || total_karyawan === undefined ||
        id_kebun === null || id_kebun === undefined ||
        id_afdeling === null || id_afdeling === undefined ||
        id_blok === null || id_blok === undefined ||
        tahun_tanam === null || tahun_tanam === undefined ||
        komidel === null || komidel === undefined ||
        status_bayar === null || status_bayar === undefined ||
        created_user === null || created_user === undefined ||
        aktif === null || aktif === undefined
    ) {
        return res.status(400).json({ error: true, message: 'One or more required fields are missing or null' });
    }
    const headerQuery = `
        INSERT INTO sm_trs_header_gaji (
            no_lereng,
            pengawas,
            total_janjang,
            total_berondolan,
            tonase_terkirim,
            janjang_terkirim,
            total_karyawan,
            id_kebun,
            id_afdeling,
            id_blok,
            tahun_tanam,
            komidel,
            status_bayar,
            created_user,
            aktif
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const headerValues = [
        no_lereng,
        pengawas,
        total_janjang,
        total_berondolan,
        tonase_terkirim,
        janjang_terkirim,
        total_karyawan,
        id_kebun,
        id_afdeling,
        id_blok,
        tahun_tanam,
        komidel,
        status_bayar,
        created_user,
        aktif,
    ];

    const noSeriValues = detail.map((item) => item.no_seri);

    // Construct a SELECT query to retrieve existing no_seri values from the database
    const checkNoSeriQuery = `
    SELECT DISTINCT no_seri
    FROM mst_karyawan 
    WHERE no_seri IN (?);
`;

    // Execute the SELECT query to check the existence of all no_seri values
    MobilePool.query(checkNoSeriQuery, [noSeriValues], (checkError, checkResults) => {
        if (checkError) {
            console.error('Error checking existence of no_seri values:', checkError);
            return res.status(500).json({ error: true, message: 'Internal Server Error' });
        }

        // Extract existing no_seri values from the query results
        const existingNoSeris = checkResults.map((result) => result.no_seri);

        // Validate that all expected no_seri values exist in the database
        const allNoSerisExist = noSeriValues.every((no_seri) => existingNoSeris.includes(no_seri));

        if (!allNoSerisExist) {
            // If any expected no_seri does not exist in the database, return an error response
            console.error('Some no_seri values do not exist in the database:', noSeriValues);
            return res.status(400).json({ error: true, message: 'Some no_seri values do not exist in the database' });
        }

        // If all no_seri values exist, proceed with inserting detail records
        MobilePool.query(headerQuery, headerValues, (headerError, headerResult) => {
            if (headerError) {
                console.error('Error inserting transaction header:', headerError);
                return res.status(500).json({ error: true, message: 'Failed to insert transaction header' });
            }

            const id_transaksi = headerResult.insertId;

            // Insert detail records if there are any
            if (detail && detail.length > 0) {
                let allSucceeded = true; // Flag to track if all operations succeeded

                const promises = detail.map((item) => {
                    const { no_seri, afdeling_asal, totaljanjang } = item;

                    // Construct the SELECT query to find nama and nik based on no_seri
                    const findQuery = `
                    SELECT nik, nama, jabatan_pekerjaan
                    FROM mst_karyawan 
                    WHERE no_seri = ? AND alias_unit_kerja = ?;
                `;

                    // Execute the SELECT query to find nama and nik
                    return new Promise((resolve, reject) => {
                        MobilePool.query(findQuery, [no_seri, afdeling_asal], (error, results) => {
                            if (error) {
                                console.error('Error querying for nama and nik:', error);
                                allSucceeded = false; // Set flag to false on error
                                reject({ error: true, message: 'Internal Server Error' });
                            } else {
                                const supirPanenCount = results.filter((result) => result.jabatan_pekerjaan === 'Supir Panen').length;

                                // Calculate totaljanjang to be distributed
                                let totaljanjangRemaining = totaljanjang;
                                if (results && results.length > 0) {

                                    let isFirstRecord = true;

                                    results.forEach(({ nik, nama, jabatan_pekerjaan }) => {
                                        let insertjanjang;
                                        // console.log(totaljanjangRemaining, results.length)
                                        if (jabatan_pekerjaan === 'Supir Panen') {
                                            // Calculate insertjanjang for 'Supir Panen'
                                            insertjanjang = Math.ceil(totaljanjangRemaining / (supirPanenCount + (results.length - supirPanenCount))); // Round up for 'Supir Panen'
                                            totaljanjangRemaining -= insertjanjang;
                                        } else {
                                            // Calculate insertjanjang for normal employees
                                            insertjanjang = Math.floor(totaljanjangRemaining / (supirPanenCount + (results.length - supirPanenCount))); // Round down for others
                                        }
                                        // Deduct the allocated janjang from totaljanjangRemaining
                                        const nikTertulis = isFirstRecord ? item.nik : '';

                                        // console.log(`nama: ${nama}, nik: ${nik}, jabatan_pekerjaan: ${jabatan_pekerjaan}, insertjanjang: ${insertjanjang}`);

                                        // Prepare data for inserting into sm_trs_gaji table
                                        const insertQuery = `
                                        INSERT INTO sm_trs_gaji (
                                            id_transaksi,
                                            nik,
                                            nik_tertulis,
                                            nama,
                                            afdeling_asal,
                                            komidel,
                                            no_seri,
                                            lereng,
                                            pasar,
                                            luas,
                                            no_tph,
                                            totaljanjang,
                                            totalberondolan,
                                            tj_bm,
                                            tn_bm,
                                            td_bm,
                                            tj_bmtp,
                                            td_bmtp,
                                            tj_btdp,
                                            td_btdp,
                                            pg,
                                            td_pg,
                                            ptds,
                                            tn_btp,
                                            td_btp,
                                            long_coor,
                                            lat_coor,
                                            status_bayar
                                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                                    `;

                                        const insertValues = [
                                            id_transaksi,
                                            nik,
                                            nikTertulis,
                                            nama,
                                            item.afdeling_asal,
                                            item.komidel,
                                            item.no_seri,
                                            item.lereng,
                                            item.pasar,
                                            item.luas,
                                            item.no_tph,
                                            insertjanjang,
                                            item.totalberondolan,
                                            item.tj_bm,
                                            item.tn_bm,
                                            item.td_bm,
                                            item.tj_bmtp,
                                            item.td_bmtp,
                                            item.tj_btdp,
                                            item.td_btdp,
                                            item.pg,
                                            item.td_pg,
                                            item.ptds,
                                            item.tn_btp,
                                            item.td_btp,
                                            item.long_coor,
                                            item.lat_coor,
                                            item.status_bayar,
                                        ];

                                        // Execute the INSERT query for each employee record
                                        MobilePool.query(insertQuery, insertValues, (insertError) => {
                                            if (insertError) {
                                                // console.error('Error inserting data into sm_trs_gaji:', insertError);
                                                allSucceeded = false; // Set flag to false on error
                                                reject({ error: true, message: 'Internal Server Error' });
                                            } else {
                                                // console.log(`Inserted data for nama: ${nama}, nik: ${nik}`);
                                                resolve(); // Resolve promise on successful insert
                                            }
                                        });
                                        if (isFirstRecord) {
                                            isFirstRecord = false;
                                        }
                                    });
                                }
                            }
                        });
                    });
                });

                // Wait for all promises to settle
                Promise.all(promises)
                    .then(() => {
                        if (allSucceeded) {
                            res.status(201).json({ error: false, message: 'Transaction inserted successfully', id_transaksi });
                        } else {
                            res.status(500).json({ error: true, message: 'Failed to process all detail records' });
                        }
                    })
                    .catch((error) => {
                        console.error('Error processing detail records:', error);
                        res.status(500).json({ error: true, message: 'Internal Server Error' });
                    });
            } else {
                res.status(201).json({ error: false, message: 'Transaction inserted successfully', id_transaksi });
            }
        });
    });


};

module.exports = {
    createItem,
};