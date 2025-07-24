# Backend - Loja Crysleão

Este diretório contém o backend da Loja Crysleão, desenvolvido em Java com Spring Boot.

## Estrutura

- **src/main/java/com/lojacrysleao/lojacrysleao_api/**: Código-fonte principal
  - **config/**: Configurações globais (CORS, segurança, etc.)
  - **controller/**: Endpoints REST
  - **model/**: Entidades do domínio
  - **repository/**: Interfaces de acesso ao banco de dados
  - **service/**: Lógica de negócio
- **src/main/resources/**: Arquivos de configuração (ex: application.properties)
- **src/test/**: Testes automatizados
- **pom.xml**: Gerenciador de dependências Maven

## Como rodar o backend

1. Certifique-se de ter o Java 17+ e o Maven instalados.
2. No terminal, acesse a pasta do backend:
   ```sh
   cd backend
   ```
3. Execute o projeto:
   ```sh
   ./mvnw spring-boot:run
   ```
   Ou, no Windows:
   ```sh
   mvnw.cmd spring-boot:run
   ```
4. A API estará disponível em: http://localhost:8080

## Comandos úteis

- `./mvnw test` — Executa os testes automatizados
- `./mvnw package` — Gera o arquivo JAR para produção
- `./mvnw compile` — Compila o projeto

## Configuração

- As configurações estão em `src/main/resources/application.properties`.
- O banco de dados padrão é H2 (memória), ideal para desenvolvimento.

## Tecnologias utilizadas

- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- H2 Database (dev)
- Maven

---

Para mais detalhes sobre o projeto, consulte o README principal na raiz.
