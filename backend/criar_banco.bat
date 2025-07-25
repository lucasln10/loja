@echo off
setlocal

REM === CONFIGURAÇÕES ===
set DB_NAME=lojacrysleao
set DB_USER=lojacrysleao_user
set DB_PASS=lojacrysleao123

echo ==========================================
echo  Script de criacao do banco de dados MySQL
echo ==========================================
echo.
set /p MYSQL_ROOT_PASS=Digite a senha do usuario root do MySQL: 

REM Cria o arquivo SQL temporario
echo CREATE DATABASE IF NOT EXISTS %DB_NAME% DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; > criar_banco_temp.sql
echo CREATE USER IF NOT EXISTS '%DB_USER%'@'localhost' IDENTIFIED BY '%DB_PASS%'; >> criar_banco_temp.sql
echo GRANT ALL PRIVILEGES ON %DB_NAME%.* TO '%DB_USER%'@'localhost'; >> criar_banco_temp.sql
echo FLUSH PRIVILEGES; >> criar_banco_temp.sql

REM Executa o script SQL
echo.
echo Criando banco de dados e usuario...
mysql -u root -p%MYSQL_ROOT_PASS% < criar_banco_temp.sql

REM Remove o arquivo temporario
del criar_banco_temp.sql

echo.
echo ==========================================
echo Banco de dados e usuario criados com sucesso!
echo Usuario: %DB_USER%
echo Senha:   %DB_PASS%
echo Banco:   %DB_NAME%
echo ==========================================
pause
endlocal