# Página de Administração - Loja Crys Leão

## Visão Geral

A página de administração foi criada para permitir que administradores gerenciem produtos, categorias e usuários do sistema. Apenas usuários com role `ADMIN` podem acessar esta funcionalidade.

## Funcionalidades

### 1. Dashboard
- **Estatísticas Gerais**: Mostra o total de produtos, categorias, usuários e administradores
- **Visão Geral**: Permite visualizar rapidamente o estado atual do sistema

### 2. Gerenciamento de Produtos
- **Adicionar Produtos**: Formulário completo para criar novos produtos
  - Nome do produto
  - Descrição
  - Preço
  - Categoria (seleção obrigatória)
  - Estoque
  - URL da imagem (opcional)
- **Visualizar Produtos**: Lista todos os produtos existentes com informações detalhadas
- **Excluir Produtos**: Remove produtos do sistema (com confirmação)

### 3. Gerenciamento de Categorias
- **Adicionar Categorias**: Formulário para criar novas categorias
  - Nome da categoria
  - Descrição (opcional)
- **Visualizar Categorias**: Lista todas as categorias existentes
- **Excluir Categorias**: Remove categorias do sistema (com confirmação)

### 4. Gerenciamento de Usuários
- **Lista de Usuários**: Tabela com todos os usuários registrados
  - Nome
  - Email
  - Função (USER/ADMIN)
- **Promover Usuários**: Converte usuários comuns em administradores
- **Rebaixar Usuários**: Converte administradores em usuários comuns

## Como Acessar

### 1. Login como Administrador
- Acesse a página de login (`/login`)
- Use credenciais de um usuário com role `ADMIN`
- Após o login bem-sucedido, você será redirecionado automaticamente para `/admin`

### 2. Acesso via Header
- Se você estiver logado como administrador, aparecerá um botão "ADMIN" no header
- Clique no botão para acessar a página de administração

### 3. Acesso Direto
- Navegue diretamente para `/admin` (apenas se estiver logado como admin)

## Segurança

- **Autenticação Obrigatória**: Apenas usuários logados podem acessar
- **Autorização**: Apenas usuários com role `ADMIN` podem acessar
- **Redirecionamento**: Usuários não autorizados são redirecionados para a página inicial
- **Token JWT**: Todas as requisições usam autenticação via token JWT

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Obter dados do usuário atual

### Administração
- `GET /api/admin/users` - Listar todos os usuários
- `POST /api/admin/promote/{userId}` - Promover usuário para ADMIN
- `POST /api/admin/demote/{userId}` - Rebaixar usuário para USER

### Produtos
- `GET /api/products` - Listar todos os produtos
- `POST /api/products` - Criar novo produto
- `DELETE /api/products/{id}` - Excluir produto

### Categorias
- `GET /api/categories` - Listar todas as categorias
- `POST /api/categories` - Criar nova categoria
- `DELETE /api/categories/{id}` - Excluir categoria

## Interface do Usuário

### Design Responsivo
- Interface moderna com gradientes e efeitos visuais
- Design responsivo para desktop, tablet e mobile
- Navegação por abas para organizar as funcionalidades

### Componentes
- **Header**: Informações do usuário logado e botão de logout
- **Navegação**: Abas para Dashboard, Produtos, Categorias e Usuários
- **Formulários**: Campos organizados e validação de entrada
- **Tabelas**: Visualização clara dos dados
- **Botões de Ação**: Promover, rebaixar e excluir com confirmação

## Fluxo de Trabalho Típico

1. **Login como Administrador**
   - Acesse `/login`
   - Use credenciais de admin
   - Será redirecionado para `/admin`

2. **Gerenciar Categorias**
   - Vá para a aba "Categorias"
   - Adicione novas categorias conforme necessário
   - Organize as categorias antes de adicionar produtos

3. **Gerenciar Produtos**
   - Vá para a aba "Produtos"
   - Adicione novos produtos selecionando a categoria apropriada
   - Preencha todas as informações necessárias

4. **Gerenciar Usuários**
   - Vá para a aba "Usuários"
   - Visualize todos os usuários registrados
   - Promova usuários confiáveis para administradores se necessário

## Tratamento de Erros

- **Validação de Formulários**: Campos obrigatórios são validados
- **Confirmações**: Ações destrutivas (excluir) pedem confirmação
- **Mensagens de Sucesso**: Feedback positivo para ações bem-sucedidas
- **Mensagens de Erro**: Informações claras sobre problemas

## Tecnologias Utilizadas

### Frontend
- **React** com TypeScript
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Context API** para gerenciamento de estado
- **CSS** customizado com design moderno

### Backend
- **Spring Boot** com Java
- **Spring Security** para autenticação
- **JWT** para tokens de autenticação
- **JPA/Hibernate** para persistência
- **MySQL** como banco de dados

## Próximos Passos

- [ ] Adicionar funcionalidade de edição de produtos
- [ ] Implementar upload de imagens
- [ ] Adicionar relatórios e analytics
- [ ] Implementar sistema de logs de ações
- [ ] Adicionar filtros e busca avançada
- [ ] Implementar paginação para grandes volumes de dados 