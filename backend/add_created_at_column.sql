-- Adiciona coluna created_at à tabela produtos
ALTER TABLE produtos ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Atualiza registros existentes com timestamp atual
UPDATE produtos SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;

-- Torna a coluna NOT NULL após preencher os dados
ALTER TABLE produtos ALTER COLUMN created_at SET NOT NULL;
