-- Adiciona coluna para suportar hierarquia de categorias (subcategorias)
USE moldesbolos;

-- Adicionar coluna parent_id para criar relacionamento hierárquico
ALTER TABLE category 
ADD COLUMN parent_id BIGINT NULL,
ADD CONSTRAINT fk_category_parent 
FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE SET NULL;

-- Adicionar coluna para controlar visibilidade no header
ALTER TABLE category 
ADD COLUMN show_in_header BOOLEAN NOT NULL DEFAULT FALSE;

-- Criar índice para melhorar performance nas consultas de hierarquia
CREATE INDEX idx_category_parent ON category(parent_id);
CREATE INDEX idx_category_header ON category(show_in_header);