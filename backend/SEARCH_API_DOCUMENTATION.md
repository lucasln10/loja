# API de Busca e Filtros de Produtos

Esta documentação descreve os endpoints implementados para busca, filtros e paginação de produtos.

## Endpoints Disponíveis

### 1. Busca Avançada com Filtros
**POST** `/api/products/search`

Busca produtos com múltiplos filtros e paginação.

**Body:**
```json
{
  "searchTerm": "smartphone",
  "categoryId": 1,
  "minPrice": 100.0,
  "maxPrice": 1000.0,
  "minStock": 5,
  "maxStock": 100,
  "inStock": true,
  "page": 0,
  "size": 20,
  "sortBy": "price",
  "sortDirection": "asc",
  "activeOnly": true
}
```

**Parâmetros:**
- `searchTerm`: Termo de busca (nome, descrição)
- `categoryId`: ID da categoria
- `minPrice`/`maxPrice`: Faixa de preço
- `minStock`/`maxStock`: Faixa de estoque
- `inStock`: Apenas produtos com estoque > 0
- `page`: Número da página (padrão: 0)
- `size`: Tamanho da página (padrão: 20, máximo: 100)
- `sortBy`: Campo para ordenação (name, price, createdAt)
- `sortDirection`: Direção da ordenação (asc, desc)
- `activeOnly`: Apenas produtos ativos (padrão: true)

### 2. Busca Simples por Termo
**GET** `/api/products/search?q={termo}&page={page}&size={size}`

Busca produtos por termo de busca.

**Parâmetros:**
- `q`: Termo de busca (obrigatório)
- `page`: Número da página (padrão: 0)
- `size`: Tamanho da página (padrão: 20)

### 3. Filtro por Categoria
**GET** `/api/products/category/{categoryId}?page={page}&size={size}`

Filtra produtos por categoria específica.

**Parâmetros:**
- `categoryId`: ID da categoria (path)
- `page`: Número da página (padrão: 0)
- `size`: Tamanho da página (padrão: 20)

### 4. Filtro por Faixa de Preço
**GET** `/api/products/price-range?minPrice={min}&maxPrice={max}&page={page}&size={size}`

Filtra produtos por faixa de preço.

**Parâmetros:**
- `minPrice`: Preço mínimo (opcional)
- `maxPrice`: Preço máximo (opcional)
- `page`: Número da página (padrão: 0)
- `size`: Tamanho da página (padrão: 20)

### 5. Filtro por Estoque
**GET** `/api/products/stock?minStock={min}&page={page}&size={size}`

Filtra produtos por estoque mínimo.

**Parâmetros:**
- `minStock`: Estoque mínimo (obrigatório)
- `page`: Número da página (padrão: 0)
- `size`: Tamanho da página (padrão: 20)

### 6. Paginação Básica
**GET** `/api/products/page?page={page}&size={size}&sortBy={field}&sortDirection={direction}`

Lista produtos com paginação básica.

**Parâmetros:**
- `page`: Número da página (padrão: 0)
- `size`: Tamanho da página (padrão: 20)
- `sortBy`: Campo para ordenação (padrão: name)
- `sortDirection`: Direção da ordenação (padrão: asc)

### 7. Estatísticas dos Produtos
**GET** `/api/products/stats`

Obtém estatísticas dos produtos para construção de filtros.

## Resposta Padrão

Todos os endpoints de busca retornam um objeto `PageResponseDTO`:

```json
{
  "content": [
    {
      "id": 1,
      "name": "Smartphone XYZ",
      "price": 599.99,
      "quantity": 10,
      "description": "Descrição do produto",
      "categoryId": 1,
      "status": true
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 150,
  "totalPages": 8,
  "hasNext": true,
  "hasPrevious": false
}
```

## Exemplos de Uso

### Busca por Smartphone com Filtros
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

### Filtro por Categoria
```bash
curl "http://localhost:8080/api/products/category/1?page=0&size=15"
```

### Filtro por Preço
```bash
curl "http://localhost:8080/api/products/price-range?minPrice=100&maxPrice=500&page=0&size=20"
```

### Busca Simples
```bash
curl "http://localhost:8080/api/products/search?q=laptop&page=0&size=25"
```

## Ordenação

Campos disponíveis para ordenação:
- `name`: Nome do produto
- `price`: Preço
- `createdAt`: Data de criação

Direções disponíveis:
- `asc`: Crescente
- `desc`: Decrescente

## Validações

- Página deve ser >= 0
- Tamanho da página deve estar entre 1 e 100
- Preço mínimo não pode ser maior que preço máximo
- Estoque mínimo não pode ser maior que estoque máximo
- Termo de busca não pode ser vazio
- Categoria deve existir no sistema

## Performance

- Todos os endpoints utilizam paginação para evitar sobrecarga
- Consultas são otimizadas com índices apropriados
- Filtros são aplicados no nível do banco de dados
- Resultados são ordenados no banco de dados
