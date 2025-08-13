# 🔧 **Backend - Loja Crys Leão**

> **API REST completa em Spring Boot com autenticação JWT e banco MySQL**

---

## 🎯 **O que é o Backend?**

O backend é o **coração** do sistema, responsável por:
- ✅ **Autenticação** de usuários (JWT)
- ✅ **API REST** para produtos, categorias, usuários
- ✅ **Banco de dados** MySQL com JPA/Hibernate
- ✅ **Segurança** com Spring Security
- ✅ **Upload** de imagens
- ✅ **Validação** de dados

---

## 🚀 **Execução Rápida**

### **1. Configure o Banco**
```bash
# Copie o template
cp src/main/resources/application.properties.template src/main/resources/application.properties

# Edite com suas credenciais
nano src/main/resources/application.properties
```

### **2. Execute**
```bash
# Desenvolvimento
./mvnw spring-boot:run

# Ou build e execute
./mvnw clean package
java -jar target/lojacrysleao-api-*.jar
```

### **3. Acesse**
- **API**: http://localhost:8080
- **Swagger**: http://localhost:8080/swagger-ui.html
- **Health**: http://localhost:8080/actuator/health

---

## 📁 **Estrutura do Código**

```
src/main/java/com/lojacrysleao/lojacrysleao_api/
├── 📦 **config/**           # Configurações do Spring
│   ├── SecurityConfig.java  # Configuração de segurança
│   ├── CorsConfig.java      # Configuração CORS
│   └── JwtConfig.java       # Configuração JWT
├── 🎮 **controller/**       # Endpoints da API
│   ├── AuthController.java  # Login/Registro
│   ├── ProductController.java # Produtos
│   ├── CategoryController.java # Categorias
│   ├── UserController.java  # Usuários
│   └── AdminController.java # Painel admin
├── 🚨 **exception/**        # Tratamento de erros
│   ├── GlobalExceptionHandler.java # Handler global
│   └── CustomExceptions.java # Exceções customizadas
├── 📊 **model/**            # Entidades do banco
│   ├── User.java           # Usuário
│   ├── Product.java        # Produto
│   ├── Category.java       # Categoria
│   └── Order.java          # Pedido
├── 🗄️ **repository/**       # Acesso ao banco
│   ├── UserRepository.java # Usuários
│   ├── ProductRepository.java # Produtos
│   └── CategoryRepository.java # Categorias
├── 📋 **DTO/**              # Objetos de transferência
│   ├── LoginRequest.java   # Dados de login
│   ├── ProductDTO.java     # Dados do produto
│   └── UserDTO.java        # Dados do usuário
├── 🔄 **mapper/**           # Conversão de objetos
│   └── ModelMapper.java    # Mapeamento automático
├── ⚙️ **service/**          # Lógica de negócio
│   ├── AuthService.java    # Autenticação
│   ├── ProductService.java # Produtos
│   ├── UserService.java    # Usuários
│   └── EmailService.java   # Envio de emails
└── 🚀 **LojacrysleaoApiApplication.java** # Classe principal
```

---

## 🔌 **Endpoints da API**

### **🔐 Autenticação**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Registrar usuário |
| `POST` | `/api/auth/login` | Fazer login |
| `GET` | `/api/auth/me` | Dados do usuário atual |

### **🛍️ Produtos**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/products` | Listar produtos |
| `GET` | `/api/products/{id}` | Produto específico |
| `POST` | `/api/products` | Criar produto (ADMIN) |
| `PUT` | `/api/products/{id}` | Atualizar produto (ADMIN) |
| `DELETE` | `/api/products/{id}` | Excluir produto (ADMIN) |

### **🏷️ Categorias**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/categories` | Listar categorias |
| `POST` | `/api/categories` | Criar categoria (ADMIN) |
| `DELETE` | `/api/categories/{id}` | Excluir categoria (ADMIN) |

### **👥 Usuários**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/admin/users` | Listar usuários (ADMIN) |
| `POST` | `/api/admin/promote/{id}` | Promover para ADMIN |
| `POST` | `/api/admin/demote/{id}` | Rebaixar para USER |

---

## 🛠️ **Tecnologias Utilizadas**

| Componente | Tecnologia | Versão | Propósito |
|------------|------------|---------|-----------|
| **Java** | OpenJDK | 21+ | Linguagem principal |
| **Framework** | Spring Boot | 3.5.3 | Framework web |
| **Segurança** | Spring Security | 3.5.3 | Autenticação/Autorização |
| **JWT** | jjwt | 0.12.3 | Tokens de autenticação |
| **Banco** | Spring Data JPA | 3.5.3 | Persistência |
| **ORM** | Hibernate | 6.4.0 | Mapeamento objeto-relacional |
| **Banco** | MySQL | 8.0+ | Banco de dados |
| **Build** | Maven | 3.9+ | Gerenciamento de dependências |
| **Validação** | Bean Validation | 3.0+ | Validação de dados |
| **Documentação** | Swagger/OpenAPI | 3.0+ | Documentação da API |

---

## 🔧 **Configuração**

### **📝 application.properties**
```properties
# Banco de dados
spring.datasource.url=jdbc:mysql://localhost:3306/moldesbolos
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT
jwt.secret=sua_chave_secreta_muito_longa_aqui
jwt.expiration=86400000

# Upload de arquivos
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Email (opcional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu_email@gmail.com
spring.mail.password=sua_senha_de_app
```

### **🔒 Segurança**
- **CORS** configurado para `http://localhost:3000`
- **JWT** com expiração de 24 horas
- **Roles**: `USER` e `ADMIN`
- **Endpoints protegidos** por autenticação

---

## 🚀 **Desenvolvimento**

### **📦 Comandos Maven**
```bash
# Limpar e compilar
./mvnw clean compile

# Executar testes
./mvnw test

# Build do JAR
./mvnw clean package

# Executar com perfil específico
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

### **🔍 Debug e Logs**
```bash
# Executar com debug
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Ver logs em tempo real
tail -f logs/application.log
```

### **🧪 Testes**
```bash
# Executar todos os testes
./mvnw test

# Executar teste específico
./mvnw test -Dtest=ProductServiceTest

# Executar com cobertura
./mvnw jacoco:report
```

---

## 📊 **Banco de Dados**

### **🗄️ Tabelas Principais**
- **`users`** - Usuários do sistema
- **`products`** - Produtos da loja
- **`categories`** - Categorias de produtos
- **`orders`** - Pedidos dos clientes
- **`product_images`** - Imagens dos produtos

### **🔗 Relacionamentos**
- **User** → **Orders** (1:N)
- **Category** → **Products** (1:N)
- **Product** → **ProductImages** (1:N)

### **📝 Scripts SQL**
- `create_carousel_table.sql` - Tabela de carrossel
- `create_product_images_table.sql` - Tabela de imagens
- `add_detailed_description_column.sql` - Coluna de descrição

---

## 🚨 **Tratamento de Erros**

### **📋 Exceções Customizadas**
- **`UserNotFoundException`** - Usuário não encontrado
- **`ProductNotFoundException`** - Produto não encontrado
- **`UnauthorizedException`** - Acesso não autorizado
- **`ValidationException`** - Dados inválidos

### **🔄 Handler Global**
- **Respostas padronizadas** para erros
- **Logs detalhados** para debugging
- **Mensagens amigáveis** para o usuário

---

## 🔍 **Monitoramento**

### **📈 Actuator Endpoints**
- `/actuator/health` - Saúde da aplicação
- `/actuator/info` - Informações do projeto
- `/actuator/metrics` - Métricas de performance

### **📝 Logs**
- **Logback** para logging estruturado
- **Níveis**: ERROR, WARN, INFO, DEBUG
- **Arquivo**: `logs/application.log`

---

## 🚀 **Deploy**

### **📦 JAR Executável**
```bash
# Build para produção
./mvnw clean package -DskipTests

# Executar em produção
java -jar -Dspring.profiles.active=prod target/lojacrysleao-api-*.jar
```

### **🐳 Docker**
```bash
# Build da imagem
docker build -t loja-backend .

# Executar container
docker run -p 8080:8080 loja-backend
```

---

## 📚 **Documentação Adicional**

- **🔧 Configuração**: [SETUP.md](../SETUP.md)
- **🐳 Docker**: [DOCKER_COMPOSE.md](../documentation/docker/DOCKER_COMPOSE.md)
- **👑 Admin**: [ADMIN_README.md](../documentation/doc_backend/ADMIN_README.md)
- **🚨 Exceções**: [EXCEPTIONS.md](../documentation/doc_backend/EXCEPTIONS.md)

---

## 🆘 **Precisa de Ajuda?**

### **🔍 Problemas Comuns**
1. **Porta 8080 em uso**: `lsof -i:8080 && kill -9 <PID>`
2. **Banco não conecta**: Verifique credenciais e status do MySQL
3. **JWT inválido**: Verifique `jwt.secret` e expiração
4. **CORS**: Verifique configuração em `CorsConfig.java`

### **📞 Suporte**
- Verifique logs: `tail -f logs/application.log`
- Teste endpoints: http://localhost:8080/swagger-ui.html
- Consulte a documentação do Spring Boot

---

**🎯 Dica**: Use o Swagger UI para testar a API: http://localhost:8080/swagger-ui.html
