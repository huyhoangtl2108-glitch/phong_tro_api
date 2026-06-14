const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối MySQL
const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

app.get('/', (req, res) => {
    res.send('<h1>API Phong Tro AI đã sẵn sàng!</h1>');
});

// API Đồng bộ User
app.post('/sync-user', async (req, res) => {
    const { id, full_name, email, phone, avatar_url, role, created_at, is_banned } = req.body;
    try {
        const sql = `
            INSERT INTO users (id, full_name, email, phone, avatar_url, role, created_at, is_banned)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                full_name = VALUES(full_name),
                phone = VALUES(phone),
                avatar_url = VALUES(avatar_url),
                is_banned = VALUES(is_banned)
        `;
        await pool.execute(sql, [id, full_name, email, phone, avatar_url, role, created_at, is_banned]);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API Đồng bộ Room
app.post('/sync-room', async (req, res) => {
    const { id, title, description, price, area, address, city, district, category, images, owner_id, created_at } = req.body;
    try {
        const sql = `
            INSERT INTO rooms (id, title, description, price, area, address, city, district, category, images, owner_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                title = VALUES(title), price = VALUES(price), description = VALUES(description), images = VALUES(images)
        `;
        await pool.execute(sql, [id, title, description, price, area, address, city, district, category, images, owner_id, created_at]);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
