# 🎨 **Frontend - Loja Crys Leão**

> **Interface moderna em React com TypeScript para e-commerce**

---

## 🎯 **O que é o Frontend?**

O frontend é a **cara** do sistema, responsável por:
- ✅ **Interface do usuário** - Páginas e componentes
- ✅ **Navegação** - Rotas e navegação entre páginas
- ✅ **Autenticação** - Login, registro e gerenciamento de sessão
- ✅ **Painel admin** - Gerenciamento de produtos e usuários
- ✅ **Responsividade** - Funciona em desktop, tablet e mobile
- ✅ **Integração** - Comunicação com a API backend

---

## 🚀 **Execução Rápida**

### **1. Instale Dependências**
```bash
# Primeira vez
npm install

# Ou se preferir yarn
yarn install
```

### **2. Execute em Desenvolvimento**
```bash
npm start
# ou
yarn start
```

### **3. Acesse**
- **Aplicação**: http://localhost:3000
- **Admin**: http://localhost:3000/admin (após login)

---

## 📁 **Estrutura do Código**

```
src/
├── 🎭 **components/**        # Componentes reutilizáveis
│   ├── Header/              # Cabeçalho da aplicação
│   ├── Footer/              # Rodapé
│   ├── ProductCard/         # Card de produto
│   ├── CategoryCard/        # Card de categoria
│   ├── LoginForm/           # Formulário de login
│   └── AdminPanel/          # Painel administrativo
├── 📄 **pages/**            # Páginas da aplicação
│   ├── Home/                # Página inicial
│   ├── Login/               # Página de login
│   ├── Register/            # Página de registro
│   ├── Products/            # Lista de produtos
│   ├── ProductDetail/       # Detalhes do produto
│   ├── Admin/               # Painel admin
│   └── Profile/             # Perfil do usuário
├── 🔧 **services/**         # Serviços e APIs
│   ├── api.ts               # Configuração do Axios
│   ├── authService.ts       # Serviços de autenticação
│   ├── productService.ts    # Serviços de produtos
│   └── userService.ts       # Serviços de usuários
├── 📊 **context/**          # Gerenciamento de estado
│   ├── AuthContext.tsx      # Contexto de autenticação
│   └── CartContext.tsx      # Contexto do carrinho
├── 🎨 **styles/**           # Estilos e CSS
│   ├── global.css           # Estilos globais
│   ├── variables.css        # Variáveis CSS
│   └── components/          # Estilos específicos
├── 🛠️ **utils/**            # Utilitários e helpers
│   ├── constants.ts         # Constantes da aplicação
│   ├── helpers.ts           # Funções auxiliares
│   └── types.ts             # Tipos TypeScript
├── 🚀 **App.tsx**           # Componente principal
├── 🔌 **index.tsx**         # Ponto de entrada
└── 📱 **public/**           # Arquivos estáticos
    ├── index.html           # HTML principal
    ├── favicon.ico          # Ícone da aplicação
    └── images/              # Imagens estáticas
```

---

## 🎨 **Páginas Principais**

### **🏠 Página Inicial (`/`)**
- **Carrossel** de produtos em destaque
- **Categorias** principais
- **Produtos** mais populares
- **Header** com navegação e login

### **🔐 Autenticação (`/login`, `/register`)**
- **Formulários** de login e registro
- **Validação** em tempo real
- **Redirecionamento** automático após login
- **Tratamento** de erros

### **🛍️ Produtos (`/products`)**
- **Lista** de todos os produtos
- **Filtros** por categoria
- **Busca** por nome
- **Paginação** (se necessário)

### **👑 Painel Admin (`/admin`)**
- **Dashboard** com estatísticas
- **Gerenciamento** de produtos
- **Gerenciamento** de categorias
- **Gerenciamento** de usuários

---

## 🛠️ **Tecnologias Utilizadas**

| Componente | Tecnologia | Versão | Propósito |
|------------|------------|---------|-----------|
| **Framework** | React | 18+ | Interface de usuário |
| **Linguagem** | TypeScript | 5+ | Tipagem estática |
| **Roteamento** | React Router | 7+ | Navegação entre páginas |
| **HTTP Client** | Axios | 1+ | Requisições para API |
| **Estado** | Context API | - | Gerenciamento de estado |
| **Build** | Create React App | 5+ | Configuração e build |
| **Estilos** | CSS3 | - | Estilização |
| **Ícones** | React Icons | - | Ícones da interface |

---

## 🔧 **Configuração**

### **📝 package.json**
```json
{
  "name": "loja-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.0.0",
    "axios": "^1.6.0",
    "react-icons": "^4.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### **⚙️ Configuração da API**
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 🚀 **Desenvolvimento**

### **📦 Comandos NPM**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test

# Ejetar configuração (irreversível)
npm run eject
```

### **🔍 Variáveis de Ambiente**
```bash
# .env.local
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_APP_NAME=Loja Crys Leão
REACT_APP_VERSION=1.0.0
```

### **🎨 Desenvolvimento de Estilos**
```bash
# Os estilos são CSS puro
# Edite diretamente os arquivos .css
# Use variáveis CSS para temas
# Componentes têm estilos próprios
```

---

## 🔌 **Integração com Backend**

### **🔐 Autenticação**
- **Login**: `POST /api/auth/login`
- **Registro**: `POST /api/auth/register`
- **Token**: Armazenado em `localStorage`
- **Refresh**: Automático via interceptor Axios

### **🛍️ Produtos**
- **Listar**: `GET /api/products`
- **Detalhes**: `GET /api/products/{id}`
- **Criar**: `POST /api/products` (ADMIN)
- **Atualizar**: `PUT /api/products/{id}` (ADMIN)
- **Excluir**: `DELETE /api/products/{id}` (ADMIN)

### **🏷️ Categorias**
- **Listar**: `GET /api/categories`
- **Criar**: `POST /api/categories` (ADMIN)
- **Excluir**: `DELETE /api/categories/{id}` (ADMIN)

---

## 🎨 **Sistema de Design**

### **🎨 Cores Principais**
```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #f59e0b;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --background: #ffffff;
  --surface: #f9fafb;
}
```

### **📱 Responsividade**
- **Mobile First** - Design para mobile primeiro
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### **🎭 Componentes**
- **Reutilizáveis** - Podem ser usados em várias páginas
- **Props** - Configuráveis via propriedades
- **Estados** - Gerenciam dados internos
- **Eventos** - Comunicação com componentes pais

---

## 🧪 **Testes**

### **📋 Testes Disponíveis**
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar testes com cobertura
npm test -- --coverage

# Executar testes específicos
npm test -- --testNamePattern="Login"
```

### **🔍 Estrutura de Testes**
```
src/
├── __tests__/               # Arquivos de teste
│   ├── components/          # Testes de componentes
│   ├── pages/               # Testes de páginas
│   └── services/            # Testes de serviços
└── setupTests.ts            # Configuração dos testes
```

---

## 🚀 **Build e Deploy**

### **📦 Build para Produção**
```bash
# Criar build otimizado
npm run build

# O resultado fica em /build
# Arquivos minificados e otimizados
# Pronto para deploy
```

### **🌐 Deploy**
```bash
# Copiar pasta /build para servidor
# Configurar servidor web (Nginx, Apache)
# Configurar rotas para SPA
# Configurar HTTPS
```

### **🐳 Docker**
```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "start"]
```

---

## 📚 **Documentação Adicional**

- **🔧 Configuração**: [SETUP.md](../SETUP.md)
- **🔧 Backend**: [backend/README.md](../backend/README.md)
- **🐳 Docker**: [DOCKER_COMPOSE.md](../documentation/docker/DOCKER_COMPOSE.md)
- **👑 Admin**: [ADMIN_README.md](../documentation/doc_backend/ADMIN_README.md)

---

## 🆘 **Precisa de Ajuda?**

### **🔍 Problemas Comuns**
1. **Porta 3000 em uso**: `lsof -i:3000 && kill -9 <PID>`
2. **Dependências não instalam**: `rm -rf node_modules package-lock.json && npm install`
3. **Build falha**: Verifique erros de TypeScript e imports
4. **API não conecta**: Verifique se o backend está rodando

### **📞 Suporte**
- Verifique o console do navegador (F12)
- Verifique a aba Network para requisições
- Consulte a documentação do React
- Verifique se todas as dependências estão instaladas

---

## 🎯 **Próximos Passos**

1. **✅ Configuração básica** - Concluído!
2. **🎨 Personalizar** - Cores, logos, textos
3. **📱 Responsividade** - Testar em diferentes dispositivos
4. **🧪 Testes** - Adicionar testes automatizados
5. **🚀 Deploy** - Configurar para produção

---

**🎨 Dica**: Use o DevTools do navegador (F12) para debugar e testar a responsividade!
