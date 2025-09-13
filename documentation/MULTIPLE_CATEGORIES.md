# Funcionalidade de Múltiplas Categorias por Produto

## Visão Geral

Esta funcionalidade permite vincular um produto a múltiplas categorias, ampliando as possibilidades de organização e filtragem dos produtos na loja.

## Alterações Realizadas

### Backend

1. **Modelo Product**:
   - Adicionado relacionamento `@ManyToMany` com [Category](file:///C:/Users/PC/Documents/Coding/loja/backend/src/main/java/com/lojacrysleao/lojacrysleao_api/model/loja/Category.java#L13-L102)
   - Mantido relacionamento `@ManyToOne` com [Category](file:///C:/Users/PC/Documents/Coding/loja/backend/src/main/java/com/lojacrysleao/lojacrysleao_api/model/loja/Category.java#L13-L102) para compatibilidade

2. **DTO ProductDTO**:
   - Adicionado campo [categoryIds](file:///C:/Users/PC/Documents/Coding/loja/frontend/src/types/index.ts#L12-L12) para suportar IDs de múltiplas categorias

3. **ProductMapper**:
   - Atualizado para mapear múltiplas categorias entre DTO e Entity

4. **ProductRepository**:
   - Adicionados métodos para filtrar produtos por múltiplas categorias

5. **ProductService**:
   - Atualizado para lidar com criação e atualização de produtos com múltiplas categorias

6. **ProductController**:
   - Adicionado endpoint para filtrar produtos por múltiplas categorias

### Frontend

1. **Tipos**:
   - Atualizados interfaces `Product` e [AdminProduct](file:///C:/Users/PC/Documents/Coding/loja/frontend/src/types/index.ts#L10-L19) para incluir [categoryIds](file:///C:/Users/PC/Documents/Coding/loja/frontend/src/types/index.ts#L12-L12)

2. **ProductManager**:
   - Atualizado formulário para permitir seleção de múltiplas categorias
   - Atualizada exibição para mostrar todas as categorias de um produto

3. **ProductService**:
   - Atualizado para lidar com produtos que têm múltiplas categorias

### Banco de Dados

1. **Tabela product_category**:
   - Criada tabela de associação para relacionamento N:N entre produtos e categorias

2. **Migração de Dados**:
   - Script para migrar categorias existentes para a nova estrutura

## Como Usar

### Administradores

1. Ao criar ou editar um produto, é possível selecionar múltiplas categorias segurando a tecla Ctrl (ou Cmd no Mac) na lista de categorias
2. Os produtos agora aparecem em todas as categorias selecionadas na loja

### Desenvolvedores

1. Para filtrar produtos por múltiplas categorias, use o endpoint:
   ```
   GET /api/products/by-categories?categoryIds=1,2,3
   ```

2. Ao criar ou atualizar um produto, envie um array de IDs de categorias no campo [categoryIds](file:///C:/Users/PC/Documents/Coding/loja/frontend/src/types/index.ts#L12-L12)

## Scripts de Banco de Dados

### Criar tabela de associação
```sql
CREATE TABLE IF NOT EXISTS product_category (
    product_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    INDEX idx_product_category_product (product_id),
    INDEX idx_product_category_category (category_id)
);
```

### Migrar dados existentes
```sql
INSERT INTO product_category (product_id, category_id)
SELECT id, category_id
FROM produtos
WHERE category_id IS NOT NULL
ON DUPLICATE KEY UPDATE product_category.category_id = VALUES(category_id);
```