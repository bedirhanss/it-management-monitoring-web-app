-- IT Management System Database Schema

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Servers table
CREATE TABLE servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ip_address INET,
    status VARCHAR(20) DEFAULT 'online',
    cpu_usage DECIMAL(5,2) DEFAULT 0,
    memory_usage DECIMAL(5,2) DEFAULT 0,
    disk_usage DECIMAL(5,2) DEFAULT 0,
    last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System logs table
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES servers(id),
    log_level VARCHAR(20),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@company.com', '$2b$10$example', 'admin'),
('Tech Support', 'tech@company.com', '$2b$10$example', 'technician'),
('Regular User', 'user@company.com', '$2b$10$example', 'user');

INSERT INTO servers (name, ip_address, status, cpu_usage, memory_usage, disk_usage) VALUES
('Web Server 01', '192.168.1.10', 'online', 45.5, 67.2, 23.1),
('Database Server', '192.168.1.11', 'online', 78.3, 89.1, 45.7),
('Mail Server', '192.168.1.12', 'offline', 0, 0, 67.4),
('File Server', '192.168.1.13', 'online', 23.8, 34.5, 89.2);

INSERT INTO tickets (title, description, status, priority, created_by) VALUES
('Printer sorunu', 'Ofis yazıcısı çalışmıyor', 'open', 'high', 3),
('Email erişim problemi', 'Outlook bağlantı hatası', 'in_progress', 'medium', 3),
('Yazılım güncelleme', 'Antivirus güncellemesi gerekli', 'closed', 'low', 3);