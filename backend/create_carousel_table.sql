-- Criar tabela para itens do carousel
CREATE TABLE IF NOT EXISTS carousel_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    carousel_type ENUM('PRODUCT', 'CUSTOM') NOT NULL,
    product_id BIGINT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    link_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES produtos(id) ON DELETE SET NULL,
    INDEX idx_carousel_active (active),
    INDEX idx_carousel_order (display_order),
    INDEX idx_carousel_type (carousel_type)
);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO carousel_items (title, description, image_url, carousel_type, active, display_order) VALUES
('Promoção Especial', 'Descubra nossas ofertas imperdíveis', 'https://via.placeholder.com/800x400/ff6b6b/ffffff?text=Promo%C3%A7%C3%A3o', 'CUSTOM', TRUE, 1),
('Novidades da Temporada', 'Confira os lançamentos mais recentes', 'https://via.placeholder.com/800x400/4ecdc4/ffffff?text=Novidades', 'CUSTOM', TRUE, 2),
('Liquidação de Verão', 'Até 50% de desconto em produtos selecionados', 'https://via.placeholder.com/800x400/45b7d1/ffffff?text=Liquida%C3%A7%C3%A3o', 'CUSTOM', TRUE, 3);
