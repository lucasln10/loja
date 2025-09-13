-- Script para adicionar a coluna header_order na tabela category
-- Esta coluna já deve existir no projeto atual, mas este script serve como backup

-- Primeiro, verificar a estrutura atual da tabela
DESCRIBE category;

-- Para verificar se a coluna header_order já existe, execute esta consulta:
-- SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = 'loja' AND TABLE_NAME = 'category' AND COLUMN_NAME = 'header_order';

-- Se a coluna header_order NÃO existir, execute os comandos abaixo:

-- 1. Adicionar a coluna header_order
ALTER TABLE category ADD COLUMN header_order INT NOT NULL DEFAULT 0;

-- 2. Adicionar índice para melhorar a performance das consultas ordenadas
CREATE INDEX idx_category_header_order ON category(header_order);

-- 3. Atualizar categorias existentes com valores sequenciais para header_order
-- Apenas para categorias que estão configuradas para aparecer no header
UPDATE category 
SET header_order = id 
WHERE show_in_header = true AND header_order = 0;

-- 4. Verificar a estrutura final da tabela
DESCRIBE category; 