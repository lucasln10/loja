-- Script robusto para verificar e adicionar a coluna header_order na tabela category
-- Este script é compatível com a maioria das versões do MySQL

-- 1. Primeiro, verificar se a coluna header_order já existe
SELECT 
    COLUMN_NAME,
    COLUMN_DEFAULT,
    IS_NULLABLE,
    DATA_TYPE,
    COLUMN_TYPE
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'category' 
    AND COLUMN_NAME = 'header_order';

-- 2. Se a consulta acima não retornar resultados, significa que a coluna não existe
-- Nesse caso, execute os comandos abaixo para adicionar a coluna:

-- Adicionar a coluna header_order
ALTER TABLE category ADD COLUMN header_order INT NOT NULL DEFAULT 0;

-- Adicionar índice para melhorar a performance das consultas ordenadas
CREATE INDEX idx_category_header_order ON category(header_order);

-- Atualizar categorias existentes com valores sequenciais para header_order
-- Apenas para categorias que estão configuradas para aparecer no header
UPDATE category 
SET header_order = id 
WHERE show_in_header = true AND header_order = 0;

-- 3. Verificar a estrutura final da tabela
DESCRIBE category;

-- 4. Verificar os dados atualizados
SELECT id, name, show_in_header, header_order 
FROM category 
WHERE show_in_header = true 
ORDER BY header_order;