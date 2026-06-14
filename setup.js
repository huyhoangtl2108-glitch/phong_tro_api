const mysql = require('mysql2');
require('dotenv').config();

/**
 * FILE NÀY DÙNG ĐỂ TẠO CÁC BẢNG TRÊN MYSQL (RAILWAY)
 */

const connectionUrl = process.env.MYSQL_URL || "mysql://root:lDnZADPaQtWUwdPPYkyjLTyvRKJqmxPJ@thomas.proxy.rlwy.net:23911/railway";

if (connectionUrl.includes("DÁN_CONNECTION_URL")) {
    console.error("❌ LỖI: Bạn chưa dán Connection URL từ Railway vào file setup.js");
    process.exit(1);
}

const connection = mysql.createConnection(connectionUrl);

const sql = `
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user',
    created_at DATETIME,
    is_banned BOOLEAN DEFAULT FALSE
);

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
    owner_id VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    room_id VARCHAR(50),
    sender_id VARCHAR(50),
    owner_id VARCHAR(50),
    appointment_date DATETIME,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

console.log("⏳ Đang kết nối đến MySQL Railway...");

connection.connect(err => {
    if (err) {
        console.error('❌ Lỗi kết nối: ' + err.message);
        return;
    }
    console.log('✅ Đã kết nối thành công!');

    const queries = sql.split(';').filter(q => q.trim().length > 0);

    let completed = 0;
    queries.forEach((query) => {
        connection.query(query, (err) => {
            if (err) {
                console.error('❌ Lỗi khi tạo bảng:', err.message);
            } else {
                console.log('✨ Thực thi câu lệnh thành công!');
            }
            completed++;
            if (completed === queries.length) {
                console.log('🚀 HOÀN THÀNH: Tất cả các bảng đã được chuẩn bị.');
                connection.end();
            }
        });
    });
});
