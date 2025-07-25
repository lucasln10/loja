#!/bin/bash

# === CONFIGURAÇÕES ===
DB_NAME="lojacrysleao"
DB_USER="lojacrysleao_user"
DB_PASS="lojacrysleao123"

echo "=========================================="
echo " Script de criacao do banco de dados MySQL"
echo "=========================================="
echo

read -s -p "Digite a senha do usuario root do MySQL: " MYSQL_ROOT_PASS
echo

# Cria o arquivo SQL temporário
cat <<EOF > criar_banco_temp.sql
CREATE DATABASE IF NOT EXISTS $DB_NAME DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

# Executa o script SQL
echo
echo "Criando banco de dados e usuario..."
mysql -u root -p"$MYSQL_ROOT_PASS" < criar_banco_temp.sql

# Remove o arquivo temporário
rm criar_banco_temp.sql

echo
echo "=========================================="
echo "Banco de dados e usuario criados com sucesso!"
echo "Usuario: $DB_USER"
echo "Senha:   $DB_PASS"
echo "Banco:   $DB_NAME"
echo "=========================================="