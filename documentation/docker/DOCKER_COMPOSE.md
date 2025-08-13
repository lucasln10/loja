# Guia do Docker Compose

Este guia explica como subir todo o ambiente (banco de dados, backend e frontend) usando Docker Compose.

## Pré-requisitos
- Docker instalado e em execução
- Docker Compose instalado (ou `docker compose` embutido)
- Usuário com permissão para acessar o daemon do Docker (ou usar `sudo`)

## Estrutura dos serviços
Arquivo: `docker-compose.yml`

- db (MySQL 8)
  - Porta exposta: 3306 -> 3306
  - DB padrão: `moldesbolos`
  - Usuário: `root` / Senha: `rootpass`
  - Volume: `db_data` (dados persistentes)
- phpmyadmin
  - Porta exposta: 8082 -> 80
  - Acesso: http://localhost:8082
  - Conexão: host `db`, usuário `root`, senha `rootpass`
- backend (Spring Boot)
  - Porta exposta: 8080 -> 8080
  - Variáveis de ambiente (datasource):
    - `SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/moldesbolos`
    - `SPRING_DATASOURCE_USERNAME=root`
    - `SPRING_DATASOURCE_PASSWORD=rootpass`
  - Depende do `db`
- frontend (React + Nginx)
  - Porta exposta: 8081 -> 80
  - Depende do `backend`

Observação: O CORS do backend está configurado para aceitar `http://localhost:8081` (frontend em Docker) e `http://localhost:3000/3001` (dev local).

## Primeira execução
1. Gerar o JAR do backend (necessário para o build da imagem):
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   cd ..
   ```
2. Subir todo o ambiente em segundo plano:
   ```bash
   docker-compose up -d --build
   ```

## Fluxo de desenvolvimento
- Rebuild do backend após mudanças no código Java:
  ```bash
  cd backend && ./mvnw clean package -DskipTests && cd ..
  docker-compose build backend && docker-compose up -d backend
  ```
- Rebuild do frontend após mudanças no React:
  ```bash
  docker-compose build frontend && docker-compose up -d frontend
  ```
  Opcional: defina `REACT_APP_API_URL` antes do build para apontar o frontend para um backend diferente.

## Acessos rápidos
- Frontend: http://localhost:8081
- Backend: http://localhost:8080
- phpMyAdmin: http://localhost:8082

## Logs e diagnóstico
- Ver logs de um serviço:
  ```bash
  docker-compose logs -f backend
  ```
- Ver status dos serviços:
  ```bash
  docker-compose ps
  ```
- Erros comuns:
  - "permission denied ... /var/run/docker.sock": seu usuário não tem permissão. Solução: rode com `sudo` ou adicione seu usuário ao grupo `docker` (relogin necessário).
  - CORS: se o navegador bloquear requisições, confirme que o frontend usa `http://localhost:8081` e que o backend permite essa origem no CORS.

## Parar e limpar
- Parar os serviços:
  ```bash
  docker-compose down
  ```
- Parar e remover volumes (apaga dados do MySQL):
  ```bash
  docker-compose down -v
  ```

## Variáveis e configuração
- Backend lê as credenciais do MySQL via variáveis do `docker-compose.yml`.
- Frontend pode usar `REACT_APP_API_URL` no build para configurar a URL base do backend (fallback: `http://localhost:8080`).

## Dicas
- Se preferir evitar CORS, configure o Nginx do frontend para fazer proxy de `/api` para o backend e use URLs relativas no React.
- Mantenha o volume `db_data` para persistência local de dados do MySQL entre execuções.
