-- Script SQL para adicionar coluna detailed_description à tabela produtos
-- Execute este script para atualizar o banco de dados existente

-- Usar o banco de dados moldesbolos
USE moldesbolos;

-- Adicionar nova coluna detailed_description
ALTER TABLE produtos 
ADD COLUMN detailed_description TEXT;

-- Verificar se a coluna foi adicionada corretamente
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'produtos' AND column_name = 'detailed_description';