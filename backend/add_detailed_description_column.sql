-- Script SQL para adicionar coluna detailed_description à tabela produtos
-- Execute este script para atualizar o banco de dados existente

-- Adicionar nova coluna detailed_description
ALTER TABLE produtos 
ADD COLUMN detailed_description TEXT;

-- Comentário explicativo da coluna
COMMENT ON COLUMN produtos.detailed_description IS 'Descrição detalhada do produto exibida na página de detalhes';

-- Verificar se a coluna foi adicionada corretamente
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'produtos' AND column_name = 'detailed_description';
