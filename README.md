# 🛍## 📋 Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter instalado:

- ☕ **Java 21 ou superior**
- 🟢 **Node.js 18 ou superior**
- 📦 **npm** (vem com Node.js)
- 🐧 **Git**rys Leão - Sistema de E-commerce


Sistema completo de e-commerce desenvolvido com **Spring Boot** (Backend) e **React** (Frontend).

## 📋 Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter instalado:

- ☕ **Java 17 ou superior**
- 🟢 **Node.js 14 ou superior**
- 📦 **npm** (vem com Node.js)
- 🐧 **Git**

### Verificar instalações:
```bash
java -version
node --version
npm --version
git --version
```

## 🚀 Como iniciar a aplicação

### Método 1: Inicialização Manual

#### 1. **Backend (Spring Boot) - Porta 8080**

```bash
# Iniciar o servidor Spring Boot
./mvnw spring-boot:run
```

#### 2. **Frontend (React) - Porta 3000**

```bash
# Em outro terminal, navegar para o diretório do frontend
cd lojacrysleao-frontend

# Instalar dependências (apenas na primeira vez)
npm install

# Iniciar o servidor React
npm start
```

### Método 2: Inicialização com Script (Recomendado)

```bash
# Na raiz do projeto
chmod +x start.sh
./start.sh
```

## 🌐 URLs da Aplicação

Após inicializar ambos os serviços:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Interface do usuário React |
| **Backend API** | http://localhost:8080 | API REST Spring Boot |
| **Status da API** | http://localhost:8080/api/public/status | Verificar status da API |
| **Produtos** | http://localhost:8080/api/public/produtos | Listar produtos |
| **Console H2** | http://localhost:8080/h2-console | Console do banco H2 |

### 🗄️ Configuração do Console H2
- **JDBC URL:** `jdbc:h2:mem:testdb`
- **Username:** `sa`
- **Password:** `password`

## 📁 Estrutura do Projeto

```
loja/
├── lojacrysleao-api/          # Backend Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/lojacrysleao/lojacrysleao_api/
│   │       │       ├── controller/      # Controllers REST
│   │       │       ├── config/          # Configurações (CORS, Security)
│   │       │       └── LojacrysleaoApiApplication.java
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── README.md
└── lojacrysleao-frontend/     # Frontend React
    ├── src/
    │   ├── components/        # Componentes React
    │   ├── services/          # Serviços para API
    │   ├── App.js            # Componente principal
    │   └── index.js
    ├── package.json
    └── public/
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21**
- **Spring Boot 3.5.3**
- **Spring Security** (Configuração JWT ready)
- **Spring Data JPA**
- **H2 Database** (desenvolvimento)
- **Maven**

### Frontend
- **React 18**
- **JavaScript/TypeScript**
- **Axios** (requisições HTTP)
- **Create React App**

## 🔧 Configurações Importantes

### CORS
O backend está configurado para aceitar requisições do frontend:
- Origem permitida: `http://localhost:3000`
- Métodos: `GET, POST, PUT, DELETE, OPTIONS, PATCH`
- Headers: Todos permitidos

### Endpoints Públicos
- `/api/public/**` - Endpoints sem autenticação
- `/actuator/**` - Endpoints de monitoramento

## 🧪 Testando a Integração

### Testar Backend
```bash
# Verificar status da API
curl http://localhost:8080/api/public/status

# Listar produtos
curl http://localhost:8080/api/public/produtos
```

### Testar CORS
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:8080/api/public/status -v
```

## 🛑 Como parar a aplicação

### Parar serviços individualmente:
```bash
# Parar Spring Boot (Ctrl+C no terminal)
# Parar React (Ctrl+C no terminal)
```

### Parar todos os processos:
```bash
# Parar processos Java
pkill -f "spring-boot:run"

# Parar processos Node
pkill -f "react-scripts"
```

## 🚨 Solução de Problemas

### Erro: Porta em uso
```bash
# Verificar processos usando as portas
lsof -i:8080  # Backend
lsof -i:3000  # Frontend

# Matar processo específico
kill -9 <PID>
```

### Erro: Java não encontrado
```bash
# Ubuntu/Debian - Java 21
sudo apt update
sudo apt install openjdk-21-jdk

# Verificar instalação
java -version
```

### Erro: Node.js não encontrado
```bash
# Ubuntu/Debian - Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### Erro: Dependências não instaladas
```bash
# No diretório do frontend
cd lojacrysleao-frontend
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Comandos de Desenvolvimento

### Backend
```bash
# Compilar sem executar
./mvnw compile

# Executar testes
./mvnw test

# Gerar JAR
./mvnw package
```

### Frontend
```bash
# Instalar nova dependência
npm install <package-name>

# Build para produção
npm run build

# Executar testes
npm test
```

## 👥 Para Desenvolvedores

### Primeira vez no projeto:
1. Clone o repositório
2. Configure as variáveis de ambiente se necessário
3. Execute `./start.sh` ou siga os passos manuais
4. Acesse http://localhost:3000 para ver a aplicação

### Workflow de desenvolvimento:
1. Faça suas alterações
2. Teste localmente
3. Commit e push para sua branch
4. Abra Pull Request

## 📚 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar banco de dados PostgreSQL/MySQL
- [ ] Criar CRUD completo de produtos
- [ ] Implementar testes automatizados
- [ ] Configurar Docker
- [ ] Deploy em produção

---

**💡 Dica:** Se tiver problemas, verifique se ambos os serviços estão rodando e se as portas 3000 e 8080 estão livres.

**🤝 Contribuição:** Para contribuir, crie uma branch, faça suas alterações e abra um Pull Request.