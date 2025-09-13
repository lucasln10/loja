# Funcionalidade de Múltiplas Categorias por Produto

## Visão Geral

Esta funcionalidade permite vincular múltiplas categorias a um único produto, proporcionando uma organização mais flexível e precisa do catálogo de produtos.

## Implementação Técnica

### Backend

1. **Modelo de Dados**:
   - Adicionado relacionamento ManyToMany entre `Product` e `Category`
   - Criada tabela de relacionamento `product_category`
   - Atualizado `ProductDTO` para suportar `Set<Long> categoryIds`

2. **Endpoints**:
   - `/api/products` (POST/PUT) - Aceita `categoryIds` no payload
   - `/api/products/{id}` (GET) - Retorna `categoryIds` no response
   - Filtros por múltiplas categorias: `/api/products/by-categories?categoryIds=1,2,3`

3. **Mapeamento**:
   - `ProductMapper` atualizado para converter entre entidades e DTOs
   - `ProductService` modificado para lidar com múltiplas categorias

### Frontend

1. **Componentes**:
   - `ProductManager.tsx` - Interface administrativa com seleção múltipla
   - `ProductDTO` - Interface TypeScript atualizada
   - `productService.ts` - Serviço atualizado para lidar com múltiplas categorias

2. **Interface**:
   - Select múltiplo na tela de administração
   - Exibição de todas as categorias nos cartões de produtos
   - Validação e tratamento de erros

## Como Usar

### Administrador

1. **Criar/Editar Produto**:
   - Acesse o painel administrativo
   - Vá para "Gerenciar Produtos"
   - Clique em "Adicionar Novo Produto"
   - No campo "Categorias", segure Ctrl (ou Cmd no Mac) para selecionar múltiplas categorias
   - Preencha os demais campos e salve

2. **Visualizar Produtos**:
   - Os produtos aparecerão em todas as categorias às quais foram vinculados
   - Na listagem de produtos, é possível ver todas as categorias vinculadas

### Desenvolvedor

1. **API**:
   ```javascript
   // Criar produto com múltiplas categorias
   const productData = {
     name: "Produto Exemplo",
     price: 99.90,
     quantity: 10,
     description: "Descrição do produto",
     categoryIds: [1, 2, 3] // IDs das categorias
   };
   
   fetch('/api/products', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer <token>'
     },
     body: JSON.stringify(productData)
   });
   ```

2. **Filtrar por múltiplas categorias**:
   ```javascript
   // Obter produtos de múltiplas categorias
   fetch('/api/products/by-categories?categoryIds=1,2,3')
     .then(response => response.json())
     .then(products => console.log(products));
   ```

## Scripts de Migração

Para atualizar produtos existentes, foram criados scripts de migração:
- `create_product_category_table.sql` - Cria a tabela de relacionamento
- `migrate_existing_products_categories.sql` - Migra produtos existentes

## Testes

A funcionalidade foi testada com:
- Criação de produtos com múltiplas categorias
- Edição de produtos existentes
- Filtros por múltiplas categorias
- Exibição correta nas interfaces

## Considerações Técnicas

1. **Compatibilidade**:
   - Mantido campo `categoryId` para retrocompatibilidade
   - Interface atualizada para suportar ambos os formatos

2. **Performance**:
   - Índices adicionados nas tabelas de relacionamento
   - Consultas otimizadas para múltiplas categorias

3. **Validação**:
   - Verificação de existência das categorias
   - Tratamento de erros apropriado

## Problemas Conhecidos

Nenhum problema conhecido até o momento.

## Próximos Passos

1. Adicionar interface de drag-and-drop para ordenação de categorias
2. Implementar busca avançada por combinação de categorias
3. Adicionar relatórios de produtos por categoria