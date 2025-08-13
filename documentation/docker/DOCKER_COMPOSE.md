# Guia do Docker Compose

Este guia explica como subir e desenvolver o ambiente com Docker Compose: banco (MySQL), backend (Spring Boot), frontend (React build) e um Nginx reverso.

## Pré‑requisitos
- Docker instalado e rodando
- Docker Compose instalado (ou use `docker compose`)
- Usuário com acesso ao daemon do Docker (senão, use `sudo`)

## Serviços (docker-compose.yml)
- db (MySQL 8)
  - Portas: 3306:3306
  - DB: `moldesbolos`
  - Usuário/Senha: `root` / `rootpass`
  - Volume: `db_data`
- backend (Spring Boot)
  - Portas: 8080:8080
  - Env:
    - `SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/moldesbolos`
    - `SPRING_DATASOURCE_USERNAME=root`
    - `SPRING_DATASOURCE_PASSWORD=rootpass`
  - depends_on: db
  - volumes:
    - `./uploads:/app/uploads` (bind mount para persistir imagens em `loja/uploads`)
- frontend (React build servido por Nginx)
  - Sem porta exposta no host (acessado via `nginx`)
- nginx (reverse proxy)
  - Portas: 3000:80 (público)
  - Roteamento (arquivo `nginx/nginx.conf`):
    - `/`  -> `frontend:80`
    - `/api/` -> `backend:8080`
  - volumes:
    - `./uploads:/app/uploads:ro` (somente leitura, caso necessário servir `/uploads`)
- phpmyadmin
  - Portas: 8082:80
  - Acesso: http://localhost:8082 (host `db`, user `root`, senha `rootpass`)

Observação: O acesso recomendado é via Nginx em http://localhost:3000 para evitar CORS. O backend está configurado para permitir origens em `:3000`.

## Primeira execução
1) Gerar o JAR do backend (usado no build da imagem):
```bash
cd backend
./mvnw clean package -DskipTests
cd ..
```
2) Subir todo o ambiente:
```bash
docker compose up -d --build --remove-orphans
```

## Desenvolvimento
- Backend (após mudar código Java):
```bash
cd backend && ./mvnw clean package -DskipTests && cd ..
docker compose build backend && docker compose up -d backend
```
- Frontend (após mudar React):
```bash
docker compose build frontend && docker compose up -d frontend
```

## Como acessar
- Aplicação via Nginx: http://localhost:3000
- Backend direto: http://localhost:8080
- MySQL: localhost:3306 (root/rootpass)
- phpMyAdmin: http://localhost:8082

## Logs e diagnóstico
- Ver status:
```bash
docker compose ps
```
- Seguir logs:
```bash
docker compose logs -f nginx
docker compose logs -f backend
docker compose logs -f frontend
```
- Erros comuns
  - Permissão no Docker: "permission denied ... /var/run/docker.sock" → rode com `sudo` ou adicione seu usuário ao grupo `docker` (faça logout/login).
  - Porta em uso: se 80/8080/3000 já estiverem ocupadas, libere-as ou altere as portas no `docker-compose.yml` (ex.: `nginx` de `3000:80` para `3005:80`).

## Parar e limpar
- Parar:
```bash
docker compose down
```
- Parar e remover volumes (apaga dados do MySQL):
```bash
docker compose down -v
```
