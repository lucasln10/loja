# ⚙️ **Configuração do Ambiente - Loja Crys Leão**

> **Guia completo para configurar e executar o projeto em 10 minutos**

---

## 🎯 **O que você vai conseguir?**

✅ **Backend funcionando** na porta 8080  
✅ **Frontend funcionando** na porta 3000  
✅ **Banco de dados conectado**  
✅ **Sistema de autenticação ativo**  
✅ **Painel admin funcionando**  

---

## 📋 **Pré-requisitos**

### **🖥️ Software Necessário**
- **Java 21+** - [Download aqui](https://adoptium.net/)
- **Node.js 20+** - [Download aqui](https://nodejs.org/)
- **MySQL 8.0+** - [Download aqui](https://dev.mysql.com/downloads/)
- **Git** - [Download aqui](https://git-scm.com/)

### **🔍 Verificar Instalações**
```bash
java -version    # Deve mostrar Java 21+
node --version   # Deve mostrar v20+
mysql --version  # Deve mostrar MySQL 8.0+
git --version    # Deve mostrar Git instalado
```

---

## 🚀 **Passo a Passo - Configuração**

### **1️⃣ Clone o Projeto**
```bash
git clone <seu-repositorio>
cd loja
```

### **2️⃣ Configure o Banco de Dados**

#### **2.1 Crie o Banco MySQL**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE moldesbolos;
CREATE USER 'loja_user'@'localhost' IDENTIFIED BY 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON moldesbolos.* TO 'loja_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### **2.2 Configure o Backend**
```bash
# Copie o template de configuração
cp backend/src/main/resources/application.properties.template backend/src/main/resources/application.properties

# Edite com suas credenciais
nano backend/src/main/resources/application.properties
```

**🔑 Configurações importantes:**
```properties
# Banco de dados
spring.datasource.username=loja_user
spring.datasource.password=sua_senha_aqui
spring.datasource.url=jdbc:mysql://localhost:3306/moldesbolos

# JWT (chave secreta para autenticação)
jwt.secret=sua_chave_secreta_muito_longa_aqui_123456789

# Email (opcional - para funcionalidades de email)
spring.mail.username=seu_email@gmail.com
spring.mail.password=sua_senha_de_app
spring.mail.host=smtp.gmail.com
spring.mail.from=seu_email@gmail.com
```

### **3️⃣ Execute o Backend**
```bash
cd backend

# Instalar dependências (primeira vez)
./mvnw clean install

# Executar o servidor
./mvnw spring-boot:run
```

**✅ Sucesso**: Você verá algo como:
```
Started LojacrysleaoApiApplication in X.XXX seconds
```

### **4️⃣ Execute o Frontend**
```bash
# Em um NOVO terminal
cd frontend

# Instalar dependências (primeira vez)
npm install

# Executar o servidor
npm start
```

**✅ Sucesso**: Seu navegador abrirá automaticamente em `http://localhost:3000`

---

## 🌐 **Acessando a Aplicação**

| Componente | URL | Status |
|------------|-----|---------|
| **🌐 Frontend** | http://localhost:3000 | ✅ Principal |
| **🔧 Backend** | http://localhost:8080 | ✅ API |
| **📊 Admin** | http://localhost:3000/admin | ✅ Após login |
| **📚 Swagger** | http://localhost:8080/swagger-ui.html | ✅ Documentação API |

---

## 👑 **Primeiro Acesso - Painel Admin**

### **1. Crie um Usuário Admin**
```bash
# No terminal do backend, você verá logs como:
# "Usuário admin criado: admin@loja.com / admin123"
```

### **2. Faça Login**
- Acesse: http://localhost:3000/login
- **Email**: `admin@loja.com`
- **Senha**: `admin123`

### **3. Acesse o Admin**
- Após login, clique em "ADMIN" no header
- Ou acesse diretamente: http://localhost:3000/admin

---

## 🐳 **Alternativa: Usar Docker (Mais Fácil)**

Se preferir não instalar Java/Node localmente:

```bash
# 1. Instale Docker Desktop
# 2. Execute:

cd backend

./mvnw clean install

cd .. 

docker compose up -d --build

# 3. Acesse: http://localhost:3000
```

**📖 Guia completo**: [DOCKER_COMPOSE.md](documentation/docker/DOCKER_COMPOSE.md)

---

## ❌ **Solução de Problemas**

### **🚨 Erro: "Porta já em uso"**
```bash
# Verificar o que está usando a porta
lsof -i:8080  # Backend
lsof -i:3000  # Frontend

# Matar o processo
kill -9 <PID>
```

### **🚨 Erro: "Banco não conecta"**
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Iniciar MySQL se necessário
sudo systemctl start mysql
```

### **🚨 Erro: "Java não encontrado"**
```bash
# Verificar variáveis de ambiente
echo $JAVA_HOME
echo $PATH

# Adicionar Java ao PATH se necessário
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export PATH=$PATH:$JAVA_HOME/bin
```

### **🚨 Erro: "Node não encontrado"**
```bash
# Instalar via nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

---

## 🔧 **Comandos Úteis**

### **Backend**
```bash
cd backend
./mvnw clean install          # Limpar e compilar
./mvnw spring-boot:run        # Executar
./mvnw test                   # Executar testes
```

### **Frontend**
```bash
cd frontend
npm install                   # Instalar dependências
npm start                     # Executar em desenvolvimento
npm run build                 # Build para produção
npm test                      # Executar testes
```

---

## 📚 **Próximos Passos**

1. **✅ Configuração básica** - Concluído!
2. **🔍 Explore a API** - http://localhost:8080/swagger-ui.html
3. **👑 Teste o admin** - Crie produtos e categorias
4. **🎨 Personalize** - Modifique cores, logos, textos
5. **🚀 Deploy** - Configure para produção

---

## 🆘 **Precisa de Ajuda?**

- **📖 Documentação**: [README.md](README.md)
- **🐳 Docker**: [DOCKER_COMPOSE.md](documentation/docker/DOCKER_COMPOSE.md)
- **🔧 Backend**: [backend/README.md](backend/README.md)
- **🎨 Frontend**: [frontend/README.md](frontend/README.md)
- **👑 Admin**: [ADMIN_README.md](documentation/doc_backend/ADMIN_README.md)

---

**🎉 Parabéns!** Seu ambiente está configurado e funcionando!

