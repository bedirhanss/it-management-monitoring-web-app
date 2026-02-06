-- IT Management System Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS tickets (
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
CREATE TABLE IF NOT EXISTS servers (
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
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES servers(id),
    log_level VARCHAR(20),
    source VARCHAR(100),
    message TEXT,
    ip_address INET,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Aktif',
    purchase_date DATE,
    warranty_period DECIMAL(3,1),
    warranty_end_date DATE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Planlama',
    priority VARCHAR(20) DEFAULT 'Orta',
    start_date DATE,
    end_date DATE,
    assigned_to INTEGER REFERENCES users(id),
    budget VARCHAR(50),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    assigned_to INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update existing system_logs table
ALTER TABLE system_logs 
ADD COLUMN IF NOT EXISTS source VARCHAR(100),
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS details TEXT;

-- Insert sample data
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@company.com', '$2b$10$rZ5zKHZQJZxKxX5X5X5X5uK5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'admin'),
('Tech Support', 'tech@company.com', '$2b$10$rZ5zKHZQJZxKxX5X5X5X5uK5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'technician'),
('Regular User', 'user@company.com', '$2b$10$rZ5zKHZQJZxKxX5X5X5X5uK5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO servers (name, ip_address, status, cpu_usage, memory_usage, disk_usage) VALUES
('Web Server 01', '192.168.1.10', 'online', 45.5, 67.2, 23.1),
('Database Server', '192.168.1.11', 'online', 78.3, 89.1, 45.7),
('Mail Server', '192.168.1.12', 'offline', 0, 0, 67.4),
('File Server', '192.168.1.13', 'online', 23.8, 34.5, 89.2)
ON CONFLICT DO NOTHING;

INSERT INTO tickets (title, description, status, priority, created_by) VALUES
('Printer sorunu', 'Ofis yazıcısı çalışmıyor', 'open', 'high', 3),
('Email erişim problemi', 'Outlook bağlantı hatası', 'in_progress', 'medium', 3),
('Yazılım güncelleme', 'Antivirus güncellemesi gerekli', 'closed', 'low', 3)
ON CONFLICT DO NOTHING;

INSERT INTO inventory (name, type, brand, model, serial_number, location, status, purchase_date, warranty_period, warranty_end_date, created_by) VALUES
('Dell OptiPlex 7090', 'Bilgisayar', 'Dell', 'OptiPlex 7090', 'DL001234', 'IT Ofis', 'Aktif', '2023-01-15', 3, '2026-01-15', 1),
('HP LaserJet Pro', 'Yazıcı', 'HP', 'LaserJet Pro M404n', 'HP567890', 'Muhasebe', 'Aktif', '2023-03-20', 2, '2025-03-20', 1),
('Cisco Switch 24P', 'Network', 'Cisco', 'SG220-26', 'CS789012', 'Server Odası', 'Aktif', '2022-11-10', 3, '2025-11-10', 1),
('MacBook Pro 13"', 'Laptop', 'Apple', 'MacBook Pro M2', 'AP345678', 'Tasarım', 'Bakımda', '2023-06-05', 3, '2026-06-05', 1),
('Samsung Monitor', 'Monitör', 'Samsung', '27" Curved', 'SM901234', 'Geliştirme', 'Aktif', '2023-02-12', 3, '2026-02-12', 1)
ON CONFLICT (serial_number) DO NOTHING;

INSERT INTO projects (name, description, status, priority, start_date, end_date, assigned_to, budget, created_by) VALUES
('Network Altyapı Yenileme', 'Ofis network altyapısının tamamen yenilenmesi', 'Devam Ediyor', 'Yüksek', '2024-01-01', '2024-03-31', 1, '₺150,000', 1),
('ERP Sistemi Entegrasyonu', 'Yeni ERP sisteminin mevcut altyapıya entegrasyonu', 'Planlama', 'Yüksek', '2024-02-15', '2024-06-30', 2, '₺300,000', 1),
('Güvenlik Sistemi Güncelleme', 'Firewall ve güvenlik yazılımlarının güncellenmesi', 'Tamamlandı', 'Orta', '2023-11-01', '2023-12-31', 1, '₺75,000', 1),
('Mobil Uygulama Geliştirme', 'İç kullanım için mobil uygulama geliştirme projesi', 'Devam Ediyor', 'Orta', '2024-01-15', '2024-05-15', 2, '₺200,000', 1),
('Veri Merkezi Taşınması', 'Sunucuların yeni veri merkezine taşınması', 'Beklemede', 'Düşük', '2024-04-01', '2024-07-31', 1, '₺500,000', 1)
ON CONFLICT DO NOTHING;

INSERT INTO calendar_events (title, description, event_type, event_date, start_time, end_time, assigned_to, created_by) VALUES
('Server Bakımı', 'Web sunucusu rutin bakımı', 'Bakım', '2024-01-15', '14:00', '16:00', 1, 1),
('Network Güncelleme', 'Switch firmware güncelleme', 'Güncelleme', '2024-01-16', '09:00', '11:00', 2, 1),
('Proje Toplantısı', 'ERP projesi durum toplantısı', 'Toplantı', '2024-01-18', '10:00', '12:00', 2, 1),
('Yedekleme Kontrolü', 'Haftalık yedekleme kontrolü', 'Kontrol', '2024-01-20', '15:00', '17:00', 1, 1),
('Güvenlik Taraması', 'Sistem güvenlik taraması', 'Güvenlik', '2024-01-22', '13:00', '15:00', 1, 1)
ON CONFLICT DO NOTHING;

INSERT INTO system_logs (server_id, log_level, source, message, ip_address, details, created_at) VALUES
(1, 'ERROR', 'Authentication', 'Failed login attempt for user: admin@company.com', '192.168.1.100', 'Invalid password provided', '2024-01-15 14:30:25'),
(NULL, 'INFO', 'System', 'User logged in successfully', '192.168.1.101', 'User: john.doe@company.com', '2024-01-15 14:28:15'),
(2, 'WARNING', 'Database', 'Connection pool reaching maximum capacity', '127.0.0.1', 'Current connections: 95/100', '2024-01-15 14:25:10'),
(NULL, 'ERROR', 'API', 'External service timeout', '192.168.1.50', 'Service: backup-service, Timeout: 30s', '2024-01-15 14:20:05'),
(NULL, 'INFO', 'Ticket', 'New ticket created', '192.168.1.102', 'Ticket #1234: Printer issue', '2024-01-15 14:15:30'),
(3, 'SUCCESS', 'Backup', 'Daily backup completed successfully', '127.0.0.1', 'Size: 2.5GB, Duration: 15min', '2024-01-15 14:10:45'),
(NULL, 'WARNING', 'Security', 'Multiple failed login attempts detected', '192.168.1.200', 'IP blocked for 30 minutes', '2024-01-15 14:05:20'),
(1, 'INFO', 'System', 'Server maintenance completed', '127.0.0.1', 'Downtime: 5 minutes', '2024-01-15 14:00:15'),
(NULL, 'ERROR', 'Email', 'SMTP server connection failed', '127.0.0.1', 'Unable to send notification emails', '2024-01-15 13:55:10'),
(4, 'SUCCESS', 'Monitoring', 'Server health check passed', '127.0.0.1', 'All services running normally', '2024-01-15 13:50:05')
ON CONFLICT DO NOTHING;