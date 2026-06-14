const mysql = require('mysql2');
require('dotenv').config();

const connectionUrl = process.env.MYSQL_URL || "mysql://root:lDnZADPaQtWUwdPPYkyjLTyvRKJqmxPJ@thomas.proxy.rlwy.net:23911/railway";
const connection = mysql.createConnection(connectionUrl);

const sql = `
-- 1. Bảng Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user',
    created_at DATETIME,
    is_banned BOOLEAN DEFAULT FALSE
);

-- 2. Bảng Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    price DOUBLE,
    area DOUBLE,
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    category VARCHAR(50),
    images TEXT,
    amenities TEXT,
    bedroom_count INT DEFAULT 0,
    kitchen_count INT DEFAULT 0,
    bathroom_count INT DEFAULT 0,
    gender VARCHAR(20) DEFAULT 'Tất cả',
    capacity INT DEFAULT 1,
    electricity_price DOUBLE,
    water_price DOUBLE,
    has_parking BOOLEAN DEFAULT FALSE,
    is_verified_post BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    latitude DOUBLE,
    longitude DOUBLE,
    owner_id VARCHAR(50),
    owner_name VARCHAR(255),
    owner_phone VARCHAR(20),
    created_at DATETIME,
    view_count INT DEFAULT 0,
    ai_summary TEXT,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Bảng Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    room_id VARCHAR(50),
    room_title VARCHAR(255),
    sender_id VARCHAR(50),
    sender_name VARCHAR(255),
    sender_phone VARCHAR(20),
    owner_id VARCHAR(50),
    owner_name VARCHAR(255),
    owner_phone VARCHAR(20),
    appointment_date DATETIME,
    number_of_people INT DEFAULT 1,
    note TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME,
    suggested_new_date DATETIME,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

console.log("⏳ Đang cập nhật cấu hình bảng trên Railway...");

connection.connect(err => {
    if (err) return console.error('Lỗi kết nối: ' + err.message);
    const queries = sql.split(';').filter(q => q.trim().length > 0);
    let completed = 0;
    queries.forEach((query) => {
        connection.query(query, (err) => {
            if (err) console.error('Lỗi SQL:', err.message);
            completed++;
            if (completed === queries.length) {
                console.log('🚀 HOÀN THÀNH: Hệ thống MySQL đã sẵn sàng với đầy đủ thuộc tính!');
                connection.end();
            }
        });
    });
});
