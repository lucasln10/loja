-- Script para criar a tabela produtos no banco moldesbolos

-- Usar o banco de dados moldesbolos
USE moldesbolos;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT FALSE,
    
    INDEX idx_status (status)
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    description TEXT,
    category_id BIGINT,
    status BOOLEAN NOT NULL DEFAULT FALSE,
    
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_price (price)
);

-- Inserir algumas categorias de exemplo
INSERT INTO category (name, status) VALUES
('Cortadores', TRUE),
('Moldes de Silicone', TRUE),
('Polymer Clay', TRUE),
('Utensílios', TRUE),
('Formas de Acetato', TRUE);

-- Inserir alguns produtos de exemplo
INSERT INTO produtos (name, price, quantity, description, category_id, status) VALUES
('Cortador de Bolo Redondo 20cm', 29.90, 50, 'Cortador de bolo redondo em aço inox', 1, TRUE),
('Molde de Silicone para Cupcakes', 39.90, 30, 'Molde de silicone para 12 cupcakes', 2, TRUE),
('Massa de Modelar Polymer Clay 500g', 45.00, 20, 'Massa de modelar polymer clay em diversas cores', 3, TRUE),
('Rolo de Madeira para Modelagem', 25.00, 40, 'Rolo de madeira para modelagem de massas', 4, TRUE),
('Forma de Acetato para Bolo Retangular', 19.90, 25, 'Forma de acetato para bolo retangular 30x20cm', 5, TRUE);