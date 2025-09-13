-- Script simples e direto para configurar a coluna header_order
-- Execute este script no seu MySQL

-- 1. Verificar a estrutura atual da tabela
DESCRIBE category;

-- 2. Adicionar a coluna header_order (pode falhar se já existir, mas não tem problema)
-- Se já existir, comente esta linha e execute as demais
ALTER TABLE category ADD COLUMN header_order INT NOT NULL DEFAULT 0;

-- 3. Criar índice para performance
CREATE INDEX idx_category_header_order ON category(header_order);

-- 4. Inicializar header_order com valores sequenciais para categorias visíveis no header
UPDATE category 
SET header_order = id 
WHERE show_in_header = true AND header_order = 0;

-- 5. Verificar resultado
SELECT id, name, show_in_header, header_order 
FROM category 
WHERE show_in_header = true 
ORDER BY header_order;

-- 6. Estrutura final da tabela
DESCRIBE category;