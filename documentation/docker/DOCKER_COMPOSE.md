# 🐳 **Docker Compose - Loja Crys Leão**

> **Guia completo para executar todo o ambiente com Docker**

---

## 🎯 **O que é o Docker Compose?**

O Docker Compose permite executar **toda a aplicação** em containers isolados:
- ✅ **MySQL** - Banco de dados
- ✅ **Backend** - API Spring Boot
- ✅ **Frontend** - Interface React
- ✅ **Nginx** - Servidor web e proxy reverso
- ✅ **phpMyAdmin** - Gerenciamento do banco

**🚀 Vantagem**: Não precisa instalar Java, Node.js ou MySQL localmente!

---

## 📋 **Pré-requisitos**

### **🐳 Software Necessário**
- **Docker Desktop** - [Download aqui](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** - Incluído no Docker Desktop
- **Git** - Para clonar o projeto

### **🔍 Verificar Instalação**
```bash
docker --version        # Deve mostrar Docker instalado
docker compose version  # Deve mostrar versão do Compose
```

---

## 🚀 **Execução Rápida (3 passos)**

### **1️⃣ Clone e Prepare**
```bash
git clone <seu-repositorio>
cd loja
```

### **2️⃣ Build e Execute**
```bash
# Build das imagens e subir tudo
docker compose up -d --build --remove-orphans
```

### **3️⃣ Acesse a Aplicação**
- **🌐 Aplicação**: http://localhost:3000
- **🔧 Backend**: http://localhost:8080
- **📊 phpMyAdmin**: http://localhost:8082

---

## 🏗️ **Arquitetura dos Serviços**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Nginx       │    │     Backend     │
│   (React)       │◄───┤  (Proxy Reverso)├───►│  (Spring Boot)  │
│   Porta: 80     │    │   Porta: 3000   │    │   Porta: 8080   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   phpMyAdmin    │    │      MySQL      │
                       │   Porta: 8082   │    │   Porta: 3306   │
                       └─────────────────┘    └─────────────────┘
```

---

## 📁 **Estrutura dos Arquivos**

```
loja/
├── 🐳 docker-compose.yml           # Configuração dos serviços
├── 🔧 backend/
│   ├── Dockerfile                  # Imagem do backend
│   └── target/                     # JAR compilado
├── 🎨 frontend/
│   ├── Dockerfile                  # Imagem do frontend
│   └── build/                      # Build do React
├── 🌐 nginx/
│   ├── Dockerfile                  # Imagem do Nginx
│   └── nginx.conf                  # Configuração do Nginx
└── 📁 uploads/                     # Imagens dos produtos
```

---

## 🔧 **Configuração dos Serviços**

### **🗄️ MySQL (db)**
```yaml
db:
  image: mysql:8
  environment:
    MYSQL_ROOT_PASSWORD: rootpass
    MYSQL_DATABASE: moldesbolos
  ports:
    - "3306:3306"
  volumes:
    - db_data:/var/lib/mysql
```

**📊 Detalhes:**
- **Porta**: 3306 (acessível externamente)
- **Banco**: `moldesbolos`
- **Usuário**: `root`
- **Senha**: `rootpass`
- **Dados**: Persistidos em volume `db_data`

### **🔧 Backend (backend)**
```yaml
backend:
  build: ./backend
  ports:
    - "8080:8080"
  environment:
    SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/moldesbolos
    SPRING_DATASOURCE_USERNAME: root
    SPRING_DATASOURCE_PASSWORD: rootpass
  depends_on:
    - db
  volumes:
    - ./uploads:/app/uploads
```

**📊 Detalhes:**
- **Porta**: 8080 (acessível externamente)
- **Dependência**: Aguarda MySQL estar pronto
- **Uploads**: Pasta `uploads` compartilhada com host

### **🎨 Frontend (frontend)**
```yaml
frontend:
  build: ./frontend
  volumes:
    - ./frontend/src:/app/src
    - ./frontend/public:/app/public
```

**📊 Detalhes:**
- **Sem porta externa** (acessado via Nginx)
- **Volumes**: Código fonte compartilhado para desenvolvimento
- **Build**: React compilado e servido

### **🌐 Nginx (nginx)**
```yaml
nginx:
  build: ./nginx
  ports:
    - "3000:80"
  depends_on:
    - frontend
    - backend
  volumes:
    - ./uploads:/app/uploads:ro
```

**📊 Detalhes:**
- **Porta**: 3000 (público) → 80 (interno)
- **Proxy**: Roteia `/api/*` para backend, `/` para frontend
- **Uploads**: Acesso somente leitura às imagens

### **📊 phpMyAdmin (phpmyadmin)**
```yaml
phpmyadmin:
  image: phpmyadmin/phpmyadmin
  ports:
    - "8082:80"
  environment:
    PMA_HOST: db
    PMA_USER: root
    PMA_PASSWORD: rootpass
```

**📊 Detalhes:**
- **Porta**: 8082 (acessível externamente)
- **Host**: Conecta automaticamente ao MySQL
- **Acesso**: `root` / `rootpass`

---

## 🚀 **Comandos Principais**

### **📦 Gerenciar Serviços**
```bash
# Subir todos os serviços
docker compose up -d

# Subir com rebuild das imagens
docker compose up -d --build

# Parar todos os serviços
docker compose down

# Parar e remover volumes (apaga dados)
docker compose down -v

# Ver status dos serviços
docker compose ps

# Ver logs em tempo real
docker compose logs -f
```

### **🔧 Desenvolvimento**
```bash
# Rebuild de serviço específico
docker compose build backend
docker compose build frontend

# Reiniciar serviço específico
docker compose restart backend
docker compose restart frontend

# Executar comando em serviço
docker compose exec backend ls
docker compose exec db mysql -u root -p
```

---

## 🔍 **Monitoramento e Logs**

### **📊 Status dos Serviços**
```bash
# Ver todos os serviços
docker compose ps

# Ver logs de serviço específico
docker compose logs -f nginx
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Ver logs de todos os serviços
docker compose logs -f
```

### **🔍 Verificar Conectividade**
```bash
# Testar conexão com MySQL
docker compose exec backend ping db

# Testar API do backend
curl http://localhost:8080/actuator/health

# Testar frontend via Nginx
curl http://localhost:3000
```

---

## 🚨 **Solução de Problemas**

### **🚨 Erro: "Porta já em uso"**
```bash
# Verificar o que está usando a porta
lsof -i:3000  # Frontend
lsof -i:8080  # Backend
lsof -i:8082  # phpMyAdmin

# Matar processo
kill -9 <PID>

# Ou alterar portas no docker-compose.yml
```

### **🚨 Erro: "Permission denied"**
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Fazer logout e login novamente
# Ou executar com sudo
sudo docker compose up -d
```

### **🚨 Erro: "Container não inicia"**
```bash
# Ver logs do container
docker compose logs <nome_servico>

# Verificar dependências
docker compose ps

# Rebuild da imagem
docker compose build <nome_servico>
```

### **🚨 Erro: "Banco não conecta"**
```bash
# Verificar se MySQL está rodando
docker compose ps db

# Ver logs do MySQL
docker compose logs db

# Testar conexão
docker compose exec db mysql -u root -p
```

---

## 🔧 **Configurações Avançadas**

### **📝 Variáveis de Ambiente**
```bash
# Criar arquivo .env
cp .env.example .env

# Editar variáveis
nano .env
```

**Exemplo de .env:**
```env
# Banco de dados
MYSQL_ROOT_PASSWORD=sua_senha_aqui
MYSQL_DATABASE=moldesbolos

# Backend
JWT_SECRET=sua_chave_jwt_aqui
SPRING_PROFILES_ACTIVE=docker

# Frontend
REACT_APP_API_URL=http://localhost:8080/api
```

### **🔒 Segurança**
```bash
# Alterar senhas padrão
# Editar docker-compose.yml e .env

# Limitar acesso às portas
# Usar apenas localhost (127.0.0.1)

# Configurar firewall se necessário
```

---

## 📚 **Fluxo de Desenvolvimento**

### **🔄 Ciclo Típico**
1. **Editar código** no diretório local
2. **Rebuild** do serviço: `docker compose build <servico>`
3. **Reiniciar** serviço: `docker compose restart <servico>`
4. **Testar** mudanças em http://localhost:3000

### **📝 Exemplos de Comandos**
```bash
# Após mudar código Java
docker compose build backend
docker compose up -d backend

# Após mudar código React
docker compose build frontend
docker compose up -d frontend

# Após mudar configuração Nginx
docker compose build nginx
docker compose up -d nginx
```

---

## 🚀 **Deploy em Produção**

### **🌐 Configurações de Produção**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  nginx:
    ports:
      - "80:80"      # Porta padrão HTTP
      - "443:443"    # Porta HTTPS
    volumes:
      - ./ssl:/etc/nginx/ssl  # Certificados SSL
```

### **🔒 SSL/HTTPS**
```bash
# Gerar certificados
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/nginx.key \
  -out nginx/ssl/nginx.crt

# Configurar Nginx para HTTPS
# Editar nginx/nginx.conf
```

---

## 📚 **Documentação Adicional**

- **🔧 Configuração**: [SETUP.md](../../SETUP.md)
- **🔧 Backend**: [backend/README.md](../../backend/README.md)
- **🎨 Frontend**: [frontend/README.md](../../frontend/README.md)
- **👑 Admin**: [ADMIN_README.md](../doc_backend/ADMIN_README.md)

---

## 🆘 **Precisa de Ajuda?**

### **🔍 Problemas Comuns**
1. **Docker não inicia**: Verifique se Docker Desktop está rodando
2. **Portas ocupadas**: Libere as portas 3000, 8080, 8082
3. **Permissões**: Adicione usuário ao grupo docker
4. **Memória**: Aumente memória do Docker Desktop

### **📞 Suporte**
- Verifique logs: `docker compose logs -f`
- Verifique status: `docker compose ps`
- Consulte a documentação do Docker
- Verifique se todos os serviços estão rodando

---

## 🎯 **Próximos Passos**

1. **✅ Ambiente Docker** - Concluído!
2. **🔧 Personalizar** - Configurações específicas
3. **🔒 Segurança** - Senhas e certificados
4. **📊 Monitoramento** - Logs e métricas
5. **🚀 Produção** - Deploy em servidor

---

**🐳 Dica**: Use `docker compose logs -f` para acompanhar os logs em tempo real durante o desenvolvimento!
