# Sistema de Busca e Filtros de Produtos - Implementação

Este documento descreve a implementação completa do sistema de busca e filtros de produtos na API da Loja Crys Leão.

## 🚀 Funcionalidades Implementadas

### 1. **Busca por Texto**
- Busca em nome, descrição e descrição detalhada dos produtos
- Busca case-insensitive
- Suporte a termos parciais

### 2. **Filtros Avançados**
- **Categoria**: Filtro por ID de categoria
- **Preço**: Faixa de preço (mínimo e máximo)
- **Estoque**: Faixa de estoque (mínimo e máximo)
- **Disponibilidade**: Apenas produtos com estoque > 0
- **Status**: Apenas produtos ativos

### 3. **Paginação**
- Controle de página e tamanho
- Tamanho máximo de página: 100
- Informações de navegação (próxima/anterior)

### 4. **Ordenação**
- **Nome**: Ordenação alfabética
- **Preço**: Ordenação numérica
- **Data de Criação**: Ordenação cronológica
- Direção: crescente (asc) ou decrescente (desc)

## 📁 Arquivos Criados/Modificados

### Novos DTOs
- `ProductSearchDTO.java` - Parâmetros de busca
- `PageResponseDTO.java` - Resposta paginada genérica
- `ProductSearchStatsDTO.java` - Estatísticas para filtros

### Repository Atualizado
- `ProductRepository.java` - Novos métodos de busca e filtros

### Service Atualizado
- `ProductService.java` - Métodos de busca, filtros e estatísticas

### Controller Atualizado
- `ProductController.java` - Novos endpoints de busca

### Modelo Atualizado
- `Product.java` - Campo `createdAt` para ordenação

## 🔧 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/products/search` | Busca avançada com filtros |
| GET | `/api/products/search?q={termo}` | Busca simples por termo |
| GET | `/api/products/category/{id}` | Filtro por categoria |
| GET | `/api/products/price-range` | Filtro por faixa de preço |
| GET | `/api/products/stock` | Filtro por estoque |
| GET | `/api/products/page` | Paginação básica |
| GET | `/api/products/stats` | Estatísticas dos produtos |

## 💡 Exemplos de Uso

### Busca Avançada
```bash
curl -X POST http://localhost:8080/api/products/search \
  -H "Content-Type: application/json" \
  -d '{
    "searchTerm": "smartphone",
    "minPrice": 200.0,
    "maxPrice": 800.0,
    "inStock": true,
    "page": 0,
    "size": 10,
    "sortBy": "price",
    "sortDirection": "asc"
  }'
```

### Busca Simples
```bash
curl "http://localhost:8080/api/products/search?q=laptop&page=0&size=20"
```

### Filtro por Categoria
```bash
curl "http://localhost:8080/api/products/category/1?page=0&size=15"
```

### Filtro por Preço
```bash
curl "http://localhost:8080/api/products/price-range?minPrice=100&maxPrice=500"
```

## 🗄️ Banco de Dados

### Nova Coluna
- `created_at` na tabela `produtos`
- Script SQL: `add_created_at_column.sql`

### Índices Recomendados
```sql
-- Para busca por texto
CREATE INDEX idx_product_name_desc ON produtos (name, description);

-- Para filtros de preço
CREATE INDEX idx_product_price ON produtos (price);

-- Para filtros de estoque
CREATE INDEX idx_product_quantity ON produtos (quantity);

-- Para filtros de categoria
CREATE INDEX idx_product_category ON produtos (category_id);

-- Para ordenação por data
CREATE INDEX idx_product_created_at ON produtos (created_at);
```

## 🧪 Testes

### Arquivo de Teste
- `ProductSearchServiceTest.java` - Testes unitários dos métodos de busca

### Cobertura de Testes
- Validação de parâmetros
- Busca com filtros
- Filtros individuais
- Tratamento de erros
- Paginação

## 🔒 Segurança

- Endpoints de busca são públicos (sem autenticação)
- Validação rigorosa de parâmetros de entrada
- Proteção contra SQL injection através de JPQL parametrizado
- Limite máximo de tamanho de página (100)

## 📊 Performance

### Otimizações Implementadas
- Paginação para evitar sobrecarga de memória
- Consultas otimizadas no nível do banco
- Filtros aplicados antes da paginação
- Ordenação no banco de dados

### Recomendações
- Implementar cache Redis para buscas frequentes
- Adicionar índices de texto completo para busca avançada
- Considerar Elasticsearch para busca complexa

## 🚀 Próximos Passos

### Melhorias Futuras
1. **Cache**: Implementar cache Redis para resultados frequentes
2. **Busca Full-Text**: Integrar com Elasticsearch
3. **Filtros Avançados**: Adicionar filtros por marca, avaliação, etc.
4. **Sugestões**: Implementar autocomplete para busca
5. **Analytics**: Rastrear termos de busca populares

### Frontend
- Implementar interface de busca com filtros
- Componente de paginação
- Sliders para faixas de preço
- Dropdown para categorias
- Campo de busca com autocomplete

## 📝 Documentação

- **API**: `SEARCH_API_DOCUMENTATION.md`
- **Implementação**: Este arquivo
- **SQL**: `add_created_at_column.sql`

## 🐛 Troubleshooting

### Problemas Comuns
1. **Erro de coluna**: Execute o script SQL para adicionar `created_at`
2. **Performance lenta**: Verifique se os índices estão criados
3. **Parâmetros inválidos**: Verifique a validação no service

### Logs
- Habilite logs SQL para debug de consultas
- Monitore tempo de resposta dos endpoints
- Verifique uso de memória com grandes resultados

---

**Desenvolvido para Loja Crys Leão**  
**Data**: Dezembro 2024  
**Versão**: 1.0.0
