# Implementação de Busca e Filtros - Loja Crys Leão

## Índice
1. [Visão Geral](#visão-geral)
2. [Endpoints de Busca](#endpoints-de-busca)
3. [Funcionalidades de Filtro](#funcionalidades-de-filtro)
4. [Ordenação de Resultados](#ordenação-de-resultados)
5. [Categorias e Hierarquia](#categorias-e-hierarquia)
6. [Ordenação de Categorias no Header](#ordenação-de-categorias-no-header)
7. [Considerações Técnicas](#considerações-técnicas)

## Visão Geral

Este documento descreve a implementação completa do sistema de busca e filtros da Loja Crys Leão, incluindo endpoints da API, funcionalidades de filtragem, ordenação e organização de categorias.

## Endpoints de Busca

### Busca Pública de Produtos
- **GET** `/api/produtos/public/search`
- Parâmetros: `q` (termo de busca), `page`, `size`, `sort`

### Busca Autenticada de Produtos (Admin)
- **GET** `/api/produtos/search`
- Parâmetros: `q` (termo de busca), `page`, `size`, `sort`

## Funcionalidades de Filtro

### Filtros Disponíveis
1. Nome do produto (`name`)
2. Preço (`price_min`, `price_max`)
3. Categoria (`category`)
4. Status de estoque (`inStock`)
5. Status do produto (`status`)

### Exemplos de Uso
```
# Buscar produtos por nome
GET /api/produtos/public/search?q=biscuit

# Buscar produtos por faixa de preço
GET /api/produtos/public/search?price_min=10&price_max=50

# Buscar produtos por categoria
GET /api/produtos/public/search?category=2

# Combinar múltiplos filtros
GET /api/produtos/public/search?q=silicone&price_min=20&category=3&inStock=true
```

## Ordenação de Resultados

### Campos Disponíveis para Ordenação
- `name` (nome do produto)
- `price` (preço)
- `createdAt` (data de criação)
- `status` (status do produto)

### Direções de Ordenação
- `ASC` (ascendente)
- `DESC` (descendente)

### Exemplos
```
# Ordenar por nome ascendente
GET /api/produtos/public/search?sort=name,ASC

# Ordenar por preço descendente
GET /api/produtos/public/search?sort=price,DESC

# Ordenar por data de criação descendente
GET /api/produtos/public/search?sort=createdAt,DESC
```

## Categorias e Hierarquia

### Estrutura de Categorias
As categorias são organizadas em uma estrutura hierárquica com:
- Categorias raiz (sem pai)
- Subcategorias (com categoria pai)

### Endpoints de Categorias
- **GET** `/api/categories` - Listar todas as categorias
- **GET** `/api/categories/{id}` - Obter categoria por ID
- **GET** `/api/categories/{id}/subcategories` - Listar subcategorias
- **GET** `/api/categories/header` - Listar categorias do header
- **POST** `/api/categories` - Criar categoria (ADMIN)
- **PUT** `/api/categories/{id}` - Atualizar categoria (ADMIN)
- **DELETE** `/api/categories/{id}` - Deletar categoria (ADMIN)

## Ordenação de Categorias no Header

### Funcionalidade
Os administradores podem controlar a ordem em que as categorias aparecem no menu de navegação do site (header) através de uma interface de drag-and-drop intuitiva.

### Como Funciona
1. No painel administrativo, na seção "Gerenciar Categorias", existe uma nova área chamada "Ordenar Categorias do Header"
2. Apenas categorias marcadas com "Exibir no header do site" aparecem nesta lista
3. O administrador pode arrastar e soltar as categorias para definir a ordem desejada
4. A ordem é atualizada automaticamente no backend

### Campos Relevantes
- `showInHeader` (boolean): Indica se a categoria deve aparecer no header
- `headerOrder` (int): Define a posição da categoria no header

### Endpoints Adicionais
- **PUT** `/api/categories/header-order` - Atualizar ordem das categorias no header

### Exemplo de Uso
```
# Atualizar ordem das categorias no header
PUT /api/categories/header-order
Authorization: Bearer {token}
Content-Type: application/json

[3, 1, 4, 2]  // IDs das categorias na ordem desejada
```

## Considerações Técnicas

### Performance
- Paginação aplicada para evitar sobrecarga
- Índices recomendados no banco de dados para campos de busca
- Uso de JPQL parametrizado para proteção contra SQL injection

### Limitações
- Tamanho máximo de página fixado em 100 itens
- Busca baseada em LIKE SQL (pode ser lenta com grandes volumes)
- Sem cache implementado (potencial melhoria com Redis)

### Segurança
- Validação rigorosa de entradas
- Proteção contra SQL injection via JPQL parametrizado
- Autenticação JWT para endpoints administrativos