CREATE DATABASE IF NOT EXISTS miss_ella;
USE miss_ella;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category ENUM('male', 'female', 'unisex', 'accessories') NOT NULL,
  subcategory VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  sizes VARCHAR(255),
  colors VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  availability ENUM('in_stock', 'made_to_order', 'sold_out') DEFAULT 'in_stock',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  delivery_type ENUM('campus', 'off_campus') NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
