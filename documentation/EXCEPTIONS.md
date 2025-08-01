# Documentação de Exceções - Loja Crys Leão

## Visão Geral

O sistema Loja Crys Leão implementa um tratamento centralizado de exceções utilizando Spring Boot's `@ControllerAdvice`. Esta documentação detalha todas as exceções customizadas, seus cenários de uso e as respostas HTTP correspondentes.

## Estrutura de Tratamento de Exceções

### Global Exception Handler

O `GlobalExceptionHandler` é responsável por capturar e tratar todas as exceções da aplicação, retornando respostas padronizadas com o `ErrorResponseDTO`.

**Localização:** `com.lojacrysleao.lojacrysleao_api.exception.GlobalExceptionHandler`

**Estrutura da Resposta de Erro:**

```json
{
  "timestamp": "2025-08-01T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Descrição específica do erro",
  "path": "/api/products/999"
}
```

## Exceções Customizadas

### 1. ResourceNotFoundException

**Código HTTP:** 404 Not Found  
**Descrição:** Recurso solicitado não foi encontrado no sistema  
**Classe:** `com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException`

**Cenários de Uso:**
- Produto não encontrado por ID
- Categoria não encontrada por ID
- Usuário não encontrado
- Token de verificação não encontrado

**Exemplos de Implementação:**
```java
// Em ProductService.findById()
Product product = productRepository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

// Em CategoryService.findById()
Category category = categoryRepository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
```

**Resposta da API:**
```json
{
  "timestamp": "2025-08-01T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Produto não encontrado",
  "path": "/api/products/999"
}
```

### 2. BadRequestException

**Código HTTP:** 400 Bad Request  
**Descrição:** Requisição inválida ou parâmetros incorretos  
**Classe:** `com.lojacrysleao.lojacrysleao_api.exception.BadRequestException`

**Cenários de Uso:**
- Parâmetros obrigatórios ausentes
- Formato de dados inválido
- Operações inválidas em entidades

**Exemplos de Uso:**
```java
// Validação de parâmetros nulos
if (productDTO == null) {
    throw new BadRequestException("ProductDTO não pode ser nulo");
}

// Validação de ID
if (id == null) {
    throw new BadRequestException("ID não pode ser nulo");
}
```

**Resposta da API:**
```json
{
  "timestamp": "2025-08-01T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "ProductDTO não pode ser nulo",
  "path": "/api/products"
}
```

### 3. ValidationException

**Código HTTP:** 422 Unprocessable Entity  
**Descrição:** Dados fornecidos não passaram na validação de negócio  
**Classe:** `com.lojacrysleao.lojacrysleao_api.exception.ValidationException`

**Cenários de Uso:**
- Validação de campos obrigatórios
- Validação de formato de email
- Validação de força de senha
- Validação de regras de negócio específicas

**Exemplos de Uso:**
```java
// Validação de email
if (!isValidEmail(email)) {
    throw new ValidationException("Formato de email inválido");
}

// Validação de senha
if (password.length() < 8) {
    throw new ValidationException("Senha deve ter pelo menos 8 caracteres");
}
```

**Resposta da API:**
```json
{
  "timestamp": "2025-08-01T10:30:00",
  "status": 422,
  "error": "Validation Error",
  "message": "Senha deve ter pelo menos 8 caracteres",
  "path": "/api/auth/register"
}
```

### 4. UnauthorizedException

**Código HTTP:** 401 Unauthorized  
**Descrição:** Usuário não autenticado ou token inválido  
**Classe:** `com.lojacrysleao.lojacrysleao_api.exception.UnauthorizedException`

**Cenários de Uso:**
- Token JWT expirado
- Token JWT inválido
- Credenciais incorretas
- Tentativa de acesso sem autenticação

**Exemplos de Uso:**
```java
// Token expirado
if (tokenExpired) {
    throw new UnauthorizedException("Token de acesso expirado");
}

// Credenciais inválidas
if (!passwordMatches) {
    throw new UnauthorizedException("Credenciais inválidas");
}
```

**Resposta da API:**
```json
{
  "timestamp": "2025-08-01T10:30:00",
  "status": 401,
  "error": "Unauthenticated user",
  "message": "Token de acesso expirado",
  "path": "/api/admin/products"
}
```

### 5. ForbiddenException

**Código HTTP:** 403 Forbidden  
**Descrição:** Usuário autenticado mas sem permissão para a operação  
**Classe:** `com.lojacrysleao.lojacrysleao_api.exception.ForbiddenException`

**Cenários de Uso:**
- Usuário comum tentando acessar área administrativa
- Operações restritas por role/permissão
- Tentativa de modificar recursos de outros usuários

**Exemplos de Uso:**
```java
// Verificação de role
if (!hasAdminRole(user)) {
    throw new ForbiddenException("Acesso negado: privilégios administrativos necessários");
}

// Verificação de propriedade do recurso
if (!isResourceOwner(user, resourceId)) {
    throw new ForbiddenException("Acesso negado: você não tem permissão para este recurso");
}
```

**Resposta da API:**
```json
{
  "timestamp": "2025-08-01T10:30:00",
  "status": 403,
  "error": "Authenticated user but without permission",
  "message": "Acesso negado: privilégios administrativos necessários",
  "path": "/api/admin/users"
}
```

### 6. ConflictException

**Código HTTP:** 409 Conflict  
**Descrição:** Conflito com o estado atual do recurso  
**Classe:** `com.lojacrysleao.lojacrysleao_api.exception.ConflictException`

**Cenários de Uso:**
- Email já cadastrado no sistema
- Tentativa de deletar categoria com produtos vinculados
- Duplicação de dados únicos

**Exemplos de Uso:**
```java
// Email já existente
if (emailExists(email)) {
    throw new ConflictException("Email já está em uso");
}

// Categoria com produtos vinculados
if (categoryHasProducts(categoryId)) {
    throw new ConflictException("Não é possível deletar categoria com produtos vinculados");
}
```

**Resposta da API:**
```json
{
  "timestamp": "2025-08-01T10:30:00",
  "status": 409,
  "error": "Conflicting (duplicate) data",
  "message": "Email já está em uso",
  "path": "/api/auth/register"
}
```

### 7. ExternalServiceException

**Código HTTP:** 503 Service Unavailable  
**Descrição:** Falha em serviços externos ou integrações  
**Classe:** `com.lojacrysleao.lojacrysleao_api.exception.ExternalServiceException`

**Cenários de Uso:**
- Falha no envio de emails
- Problemas com upload de imagens
- Integração com APIs externas indisponíveis

**Exemplos de Uso:**
```java
// Falha no envio de email
try {
    emailService.sendEmail(to, subject, body);
} catch (MessagingException e) {
    throw new ExternalServiceException("Falha ao enviar email: " + e.getMessage());
}

// Upload de arquivo falhando
try {
    uploadService.uploadFile(file);
} catch (IOException e) {
    throw new ExternalServiceException("Falha no upload: " + e.getMessage());
}
```

**Resposta da API:**
```json
{
  "timestamp": "2025-08-01T10:30:00",
  "status": 503,
  "error": "Failures in external integrations (e.g. email)",
  "message": "Falha ao enviar email de verificação",
  "path": "/api/auth/register"
}
```

## Exceções Padrão Tratadas

### RuntimeException Genérica

**Código HTTP:** 500 Internal Server Error  
**Descrição:** Exceções não categorizadas ou erros internos inesperados

**Cenários Atuais (a serem refatorados):**
- Erros em ProductService
- Erros em CategoryService
- Erros em VerificationTokenService
- Erros em PasswordResetTokenService

**Resposta da API:**
```json
{
  "timestamp": "2025-08-01T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Erro interno do servidor",
  "path": "/api/products"
}
```

## Boas Práticas para Desenvolvedores

### 1. Escolha da Exceção Adequada

```java
// ✅ Correto: Use ResourceNotFoundException para recursos não encontrados
throw new ResourceNotFoundException("Produto com ID " + id + " não encontrado");

// ❌ Incorreto: Não use RuntimeException genérica
throw new RuntimeException("Produto não encontrado");
```

### 2. Mensagens Descritivas

```java
// ✅ Correto: Mensagem específica e informativa
throw new ValidationException("Email deve ter formato válido (exemplo@dominio.com)");

// ❌ Incorreto: Mensagem vaga
throw new ValidationException("Email inválido");
```

### 3. Contexto nas Mensagens

```java
// ✅ Correto: Inclua contexto útil
throw new ConflictException("Categoria '" + categoryName + "' possui " + productCount + " produtos vinculados");

// ❌ Incorreto: Mensagem sem contexto
throw new ConflictException("Não é possível deletar");
```

### 4. Não Exponha Informações Sensíveis

```java
// ✅ Correto: Mensagem segura
throw new UnauthorizedException("Credenciais inválidas");

// ❌ Incorreto: Exposição de informações
throw new UnauthorizedException("Usuário " + username + " não existe na base");
```

## Refatoração Recomendada

### Situação Atual
O sistema atualmente utiliza `RuntimeException` genérica em muitos cenários. Exemplo:

```java
// Código atual em ProductService
throw new RuntimeException("Produto nao encontrado.");
```

### Refatoração Sugerida
```java
// Código refatorado
throw new ResourceNotFoundException("Produto com ID " + id + " não encontrado");
```

### Prioridade de Refatoração

1. **Alta Prioridade:**
   - ProductService: substituir RuntimeException por exceções específicas
   - CategoryService: substituir RuntimeException por exceções específicas
   - AuthService: implementar UnauthorizedException e ValidationException

2. **Média Prioridade:**
   - VerificationTokenService: implementar ValidationException
   - EmailService: implementar ExternalServiceException

3. **Baixa Prioridade:**
   - Implementar logging estruturado das exceções
   - Adicionar códigos de erro internos para rastreabilidade

## Códigos de Status HTTP Utilizados

| Código | Nome | Exceção | Uso |
|--------|------|---------|-----|
| 400 | Bad Request | BadRequestException | Parâmetros inválidos |
| 401 | Unauthorized | UnauthorizedException | Não autenticado |
| 403 | Forbidden | ForbiddenException | Sem permissão |
| 404 | Not Found | ResourceNotFoundException | Recurso não encontrado |
| 409 | Conflict | ConflictException | Conflito de dados |
| 422 | Unprocessable Entity | ValidationException | Validação de negócio |
| 500 | Internal Server Error | RuntimeException | Erro interno |
| 503 | Service Unavailable | ExternalServiceException | Serviço externo |

## Monitoramento e Logs

### Logs de Exceções
Todas as exceções são automaticamente logadas pelo GlobalExceptionHandler com:
- Timestamp da ocorrência
- Tipo da exceção
- Mensagem de erro
- URI da requisição
- Stack trace (apenas para erros 5xx)

### Métricas Recomendadas
- Contagem de exceções por tipo
- Taxa de erro por endpoint
- Tempo de resposta em cenários de erro
- Disponibilidade de serviços externos

---

**Última atualização:** 01/08/2025  
**Versão da documentação:** 1.0  
**Responsável:** Equipe de Desenvolvimento
