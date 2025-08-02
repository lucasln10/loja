-- Script SQL para criar a tabela product_images
-- Execute este script no seu banco de dados MySQL

CREATE TABLE IF NOT EXISTS product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES produtos(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_is_primary (is_primary),
    INDEX idx_display_order (display_order)
);

-- Comentários sobre os campos:
-- id: Chave primária auto incremento
-- image_url: URL da imagem (ex: /api/products/images/filename.jpg)
-- filename: Nome do arquivo físico salvo no servidor
-- is_primary: Define se é a imagem principal do produto (padrão false)
-- display_order: Ordem de exibição das imagens (0 = primeira)
-- product_id: Referência ao produto (chave estrangeira)
-- created_at/updated_at: Campos de auditoria
