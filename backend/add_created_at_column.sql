-- Adiciona coluna created_at à tabela produtos
-- Usar o banco de dados moldesbolos
USE moldesbolos;

ALTER TABLE produtos ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Atualiza registros existentes com timestamp atual
UPDATE produtos SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;

-- Torna a coluna NOT NULL após preencher os dados
ALTER TABLE produtos MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;