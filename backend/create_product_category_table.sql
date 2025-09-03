-- Criar tabela de relacionamento N:N entre produtos e categorias
USE moldesbolos;

-- Criar tabela product_category para relacionamento N:N
CREATE TABLE IF NOT EXISTS product_category (
    product_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    INDEX idx_product_category_product (product_id),
    INDEX idx_product_category_category (category_id)
);