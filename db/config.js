const mysql = require('mysql2/promise');
const mysql2 = require('mysql2');
const { config } = require('dotenv');
config(); // Load environment variables

const MobilePool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB1_DATABASE
});
// Create a MySQL connection pool for database 1
const HoPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB1_DATABASE
});

// Create a MySQL connection pool for database 2
const AssetsPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB2_DATABASE
});

module.exports = {
    MobilePool,
    HoPool,
    AssetsPool
};
