# 🛍️ Loja Crys Leão - Sistema de E-commerce

> **Sistema completo de e-commerce com backend Spring Boot e frontend React**

## 🚀 **Início Rápido (5 minutos)**

### 1. **Clone e Configure**
```bash
git clone <seu-repositorio>
cd loja
```

### 2. **Configure o Banco de Dados**
```bash
# Copie o template de configuração
cp backend/src/main/resources/application.properties.template backend/src/main/resources/application.properties

# Edite com suas credenciais MySQL
nano backend/src/main/resources/application.properties
```

### 3. **Execute o Projeto**
```bash
# Terminal 1 - Backend
cd backend
./mvnw spring-boot:run

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

### 4. **Acesse a Aplicação**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend**: http://localhost:8080
- 📊 **Admin**: http://localhost:3000/admin (após login)

---

## 📁 **Estrutura do Projeto**

```
loja/
├── 🎯 README.md                 # Este arquivo - comece aqui!
├── ⚙️  SETUP.md                 # Configuração detalhada
├── 🐳 docker-compose.yml        # Ambiente Docker completo
├── 🔧 backend/                  # API Spring Boot
│   ├── README.md               # Guia do backend
│   └── src/main/java/         # Código Java
├── 🎨 frontend/                # Interface React
│   ├── README.md               # Guia do frontend
│   └── src/                    # Código React
├── 🌐 nginx/                   # Servidor web
└── 📚 documentation/           # Documentação técnica
    ├── docker/                 # Guias Docker
    └── doc_backend/            # Documentação backend
```

---

## 🎯 **O que você pode fazer aqui?**

### **👤 Usuários Comuns**
- ✅ Cadastrar conta
- ✅ Navegar produtos
- ✅ Fazer compras
- ✅ Gerenciar perfil

### **👑 Administradores**
- ✅ Gerenciar produtos (agora com suporte a múltiplas categorias!)
- ✅ Criar categorias
- ✅ Administrar usuários
- ✅ Ver estatísticas

---

## 🛠️ **Tecnologias**

| Componente | Tecnologia | Versão |
|------------|------------|---------|
| **Backend** | Spring Boot | 3.5.3 |
| **Frontend** | React + TypeScript | 18+ |
| **Banco** | MySQL | 8.0+ |
| **Autenticação** | JWT | - |
| **Deploy** | Docker | - |

---

## 📖 **Documentação por Tópico**

### **🚀 Para Começar**
- [SETUP.md](SETUP.md) - Configuração passo a passo
- [docker-compose.yml](docker-compose.yml) - Ambiente Docker

### **🔧 Desenvolvimento**
- [backend/README.md](backend/README.md) - Guia do backend
- [frontend/README.md](frontend/README.md) - Guia do frontend
- [documentation/docker/DOCKER_COMPOSE.md](documentation/docker/DOCKER_COMPOSE.md) - Docker

### **👑 Administração**
- [documentation/doc_backend/ADMIN_README.md](documentation/doc_backend/ADMIN_README.md) - Painel admin
- [documentation/MULTI_CATEGORY_FEATURE.md](documentation/MULTI_CATEGORY_FEATURE.md) - Gerenciamento de múltiplas categorias por produto

---

## ❓ **Precisa de Ajuda?**

### **🔍 Problemas Comuns**
1. **Porta em uso**: `lsof -i:8080` ou `lsof -i:3000`
2. **Banco não conecta**: Verifique credenciais em `application.properties`
3. **Node não encontrado**: Use `nvm install 20 && nvm use 20`

### **📞 Suporte**
- Verifique os logs: `docker compose logs -f`
- Consulte a documentação específica de cada componente
- Issues no repositório do projeto

---

## 🎉 **Pronto para começar?**

Escolha seu caminho:

- **🚀 Quero executar agora**: Vá para [SETUP.md](SETUP.md)
- **🐳 Quero usar Docker**: Vá para [docker-compose.yml](docker-compose.yml)
- **🔧 Quero entender o código**: Vá para [backend/README.md](backend/README.md) ou [frontend/README.md](frontend/README.md)
- **👑 Quero administrar**: Vá para [ADMIN_README.md](documentation/doc_backend/ADMIN_README.md)
- **🏷️ Quero gerenciar múltiplas categorias**: Vá para [MULTI_CATEGORY_FEATURE.md](documentation/MULTI_CATEGORY_FEATURE.md)

---

**⭐ Dica**: Comece sempre pelo [SETUP.md](SETUP.md) para uma configuração rápida e sem problemas!