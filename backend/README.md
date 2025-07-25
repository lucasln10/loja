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

# Instruções para criar o banco de dados MySQL

## Windows

1. Na pasta `backend`, vai ter um arquivo chamado `criar_banco.bat` 

```

2. Dê dois cliques no arquivo ou execute no terminal/cmd. Siga as instruções na tela.

---

3. Para executar no terminal, vá até a pasta que está o .bat e coloque no cmd criar_banco.bat


## Linux/Mac

1. Na pasta `backend`, vai ter um arquivo chamado `criar_banco.sh` 


2. Dê permissão de execução:
   ```bash
   chmod +x criar_banco.sh
   ```
3. Execute o script:
   ```bash
   ./criar_banco.sh
   ```
4. Digite a senha do root do MySQL quando solicitado.

---

## Observações
- O backend deve estar configurado para usar os mesmos dados no arquivo `application.properties`:
  ```
  spring.datasource.url=jdbc:mysql://localhost:3306/lojacrysleao
  spring.datasource.username=lojacrysleao_user
  spring.datasource.password=lojacrysleao123
  ```
- Se quiser mudar o nome do banco, usuário ou senha, basta editar as variáveis no início do script e no `application.properties`.

---

Para mais detalhes sobre o projeto, consulte o README principal na raiz.
