# 🛍 Crys Leão - Sistema de E-commerce

Sistema completo de e-commerce desenvolvido com **Spring Boot** (Backend) e **React** (Frontend).

---

## 📋 Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter instalado:

- ☕ **Java 21 ou superior**
- 🐧 **Git**
- ⚙️ **Node.js 20+** (Recomendado via `nvm`)

### Instalar `nvm` (Node Version Manager)

Para gerenciar múltiplas versões do Node.js:

```bash
# Baixar o instalador
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Recarregar o shell
source ~/.bashrc  # ou ~/.zshrc se usar zsh

# Verificar se o nvm foi instalado
nvm --version
```

### Instalar Node.js com `nvm`

```bash
# Instalar Node 20 LTS
nvm install 20

# Usar Node 20
nvm use 20

# Verificar versões
node -v
npm -v
```

---

## 🚀 Como iniciar a aplicação

### Método 1: Inicialização Manual

#### 1. **Backend (Spring Boot) - Porta 8080**

```bash
# Navegue para o diretório backend
cd lojacrysleao-api

# Iniciar o servidor Spring Boot
./mvnw spring-boot:run
```

#### 2. **Frontend (React) - Porta 3000**

```bash
# Em outro terminal, navegar para o diretório do frontend
cd lojacrysleao-frontend

# Instalar dependências (somente na primeira vez)
npm install

# Instalar pacotes essenciais
npm install axios react-router-dom

# Iniciar o servidor React
npm start
```

### Método 2: Inicialização com Script (Recomendado)

```bash
# Na raiz do projeto
chmod +x start.sh
./start.sh
```

---

## 🌐 URLs da Aplicação

| Serviço         | URL                            | Descrição                 |
|----------------|---------------------------------|---------------------------|
| **Frontend**    | http://localhost:3000           | Interface do usuário React |
| **Backend API** | http://localhost:8080           | API REST Spring Boot      |
| **Status API**  | http://localhost:8080/api/public/status | Verificar status da API |
| **Produtos**    | http://localhost:8080/api/public/produtos | Listar produtos  |
| **Console H2**  | http://localhost:8080/h2-console | Console do banco H2       |

### 🗄️ Configuração do Console H2

- **JDBC URL:** `jdbc:h2:mem:testdb`
- **Username:** `sa`
- **Password:** `password`

---

## 📁 Estrutura do Projeto

```
loja/
├── lojacrysleao-api/          # Backend Spring Boot
│   └── src/main/java/com/lojacrysleao/lojacrysleao_api/
│       ├── controller/
│       ├── config/
│       └── LojacrysleaoApiApplication.java
├── lojacrysleao-frontend/     # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx / index.tsx
│   └── public/
```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Java 21
- Spring Boot 3.5.3
- Spring Security (com JWT)
- Spring Data JPA
- H2 Database (dev)
- Maven

### Frontend
- React 18 (TypeScript)
- Axios
- React Router DOM v7
- Create React App

---

## 🔧 Configurações Importantes

### CORS (Backend)
O backend está configurado para aceitar requisições do frontend:
- Origem permitida: `http://localhost:3000`
- Métodos: `GET, POST, PUT, DELETE, OPTIONS`
- Headers: Todos permitidos

### Endpoints Públicos
- `/api/public/**`
- `/actuator/**`

---

## 🧪 Testes rápidos

```bash
# Testar backend
curl http://localhost:8080/api/public/status
curl http://localhost:8080/api/public/produtos
```

---

## 🛑 Parar a aplicação

```bash
# Ctrl+C no terminal para cada serviço

# Ou manualmente:
pkill -f "spring-boot:run"
pkill -f "react-scripts"
```

---

## 🚨 Solução de Problemas

### Porta em uso

```bash
lsof -i:8080  # Backend
lsof -i:3000  # Frontend
kill -9 <PID>
```

### Node.js não encontrado

```bash
# Reinstalar via nvm
nvm install 20
nvm use 20
```

### React Router com erro de versão

Se você receber um erro de engine (versão de Node):

```bash
# Verifique sua versão do Node
node -v

# Atualize com nvm se necessário
nvm install 20
```

---

## 🔄 Comandos úteis

```bash
# Backend
./mvnw test
./mvnw package

# Frontend
npm install <pacote>
npm run build
npm test
```

---

## 👥 Para Desenvolvedores

1. Clone o repositório
2. Configure suas variáveis (se houver)
3. Instale dependências com `npm install`
4. Execute com `npm start` (frontend) e `./mvnw spring-boot:run` (backend)

---

## 📚 Roadmap Futuro

- [ ] Autenticação completa com JWT
- [ ] Integração com PostgreSQL
- [ ] Docker + Docker Compose
- [ ] Testes automatizados
- [ ] Deploy para produção

---

**💡 Dica:** Em caso de problemas, verifique se ambos os servidores estão ativos e se as portas 3000 e 8080 estão livres.

**🤝 Contribuição:** Faça um fork, crie uma branch, implemente e envie um Pull Request!