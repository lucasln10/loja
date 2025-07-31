# 🔧 Configuração do Ambiente de Desenvolvimento

## ⚙️ Configuração do Backend

### 1. Configuração do Banco de Dados

Antes de executar o projeto, você precisa configurar suas credenciais locais:

1. **Copie o arquivo template:**
   ```bash
   cp backend/src/main/resources/application.properties.template backend/src/main/resources/application.properties
   ```

2. **Edite o arquivo `application.properties` com suas configurações:**
   - Altere `SEU_USUARIO_DB` para seu usuário do MySQL
   - Altere `SUA_SENHA_DB` para sua senha do MySQL
   - Configure o `jwt.secret` com uma chave segura
   - Configure as credenciais de email se necessário

### 2. Configuração de Email (Opcional)

Se você for testar funcionalidades de email, configure:
- `spring.mail.username` - Seu username SMTP
- `spring.mail.password` - Sua senha SMTP
- `spring.mail.host` - Servidor SMTP
- `spring.mail.from` - Email remetente

### 3. Arquivo DataInitializer (Opcional)

Se você tem dados iniciais específicos para seu ambiente:
1. Configure o arquivo `DataInitializer.java` conforme necessário
2. Este arquivo contém dados de teste/desenvolvimento

## 🚀 Executando o Projeto

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## ⚠️ Importante - Segurança

- **NUNCA** comite o arquivo `application.properties` com credenciais reais
- Use `application.properties.template` como referência
- Mantenha suas configurações locais privadas
- Em produção, use variáveis de ambiente

## 🛠️ Estrutura de Configuração

```
backend/src/main/resources/
├── application.properties.template  # ✅ Template (commitado)
├── application.properties          # ❌ Suas configurações (não commitado)
└── application.properties.example  # ✅ Exemplo (commitado)
```

## 🤝 Para Desenvolvedores

Quando você clonar o projeto:
1. Copie o template: `cp application.properties.template application.properties`
2. Configure suas credenciais locais
3. Execute o projeto normalmente

Suas configurações locais não afetarão outros desenvolvedores!
