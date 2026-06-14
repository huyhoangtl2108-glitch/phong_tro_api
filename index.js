const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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
    res.send('<h1>Web API Phong Tro AI đang chạy online!</h1>');
});

// 1. Đồng bộ User
app.post('/sync-user', async (req, res) => {
    const { id, full_name, email, phone, avatar_url, is_verified, role, created_at, is_banned } = req.body;
    try {
        const sql = `
            INSERT INTO users (id, full_name, email, phone, avatar_url, is_verified, role, created_at, is_banned)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                full_name = VALUES(full_name),
                phone = VALUES(phone),
                avatar_url = VALUES(avatar_url),
                is_verified = VALUES(is_verified),
                is_banned = VALUES(is_banned)
        `;
        await pool.execute(sql, [id, full_name, email, phone, avatar_url, is_verified, role, created_at, is_banned]);
        res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Đồng bộ Room
app.post('/sync-room', async (req, res) => {
    const data = req.body;
    try {
        const sql = `
            INSERT INTO rooms (
                id, title, description, price, area, address, city, district, category,
                images, amenities, bedroom_count, kitchen_count, bathroom_count, gender,
                capacity, electricity_price, water_price, has_parking, is_verified_post,
                is_available, is_featured, latitude, longitude, owner_id, owner_name,
                owner_phone, created_at, view_count, ai_summary
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                price = VALUES(price),
                description = VALUES(description),
                images = VALUES(images),
                amenities = VALUES(amenities),
                is_available = VALUES(is_available),
                view_count = VALUES(view_count),
                ai_summary = VALUES(ai_summary)
        `;
        const params = [
            data.id, data.title, data.description, data.price, data.area, data.address, data.city, data.district, data.category,
            data.images, data.amenities, data.bedroom_count, data.kitchen_count, data.bathroom_count, data.gender,
            data.capacity, data.electricity_price, data.water_price, data.has_parking, data.is_verified_post,
            data.is_available, data.is_featured, data.latitude, data.longitude, data.owner_id, data.owner_name,
            data.owner_phone, data.created_at, data.view_count, data.ai_summary
        ];
        await pool.execute(sql, params);
        res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 3. Đồng bộ Appointment
app.post('/sync-appointment', async (req, res) => {
    const data = req.body;
    try {
        const sql = `
            INSERT INTO appointments (
                id, room_id, room_title, sender_id, sender_name, sender_phone,
                owner_id, owner_name, owner_phone, appointment_date,
                number_of_people, note, status, created_at, suggested_new_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                appointment_date = VALUES(appointment_date),
                suggested_new_date = VALUES(suggested_new_date)
        `;
        const params = [
            data.id, data.room_id, data.room_title, data.sender_id, data.sender_name, data.sender_phone,
            data.owner_id, data.owner_name, data.owner_phone, data.appointment_date,
            data.number_of_people, data.note, data.status, data.created_at, data.suggested_new_date
        ];
        await pool.execute(sql, params);
        res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running on port ' + PORT));
