-- Script para migrar categorias existentes para a nova estrutura de múltiplas categorias
USE moldesbolos;

-- Inserir registros na tabela product_category para produtos que já têm uma categoria principal
INSERT INTO product_category (product_id, category_id)
SELECT id, category_id
FROM produtos
WHERE category_id IS NOT NULL
ON DUPLICATE KEY UPDATE product_category.category_id = VALUES(category_id);

-- Verificar a migração
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    c.id AS category_id,
    c.name AS category_name
FROM produtos p
JOIN product_category pc ON p.id = pc.product_id
JOIN category c ON pc.category_id = c.id
ORDER BY p.id, c.id;

-- Verificar produtos sem categorias
SELECT 
    id, 
    name, 
    category_id
FROM produtos 
WHERE category_id IS NULL OR category_id = 0;