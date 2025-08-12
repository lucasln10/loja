# Relatório de Testes (Backend)

Data: 12/08/2025

## Resumo
- Total: 52
- Passaram: 52
- Falharam: 0
- Ignorados: 0

Todos os testes do backend foram executados com sucesso.

## Como executar os testes
Em um terminal na raiz do projeto, execute:

```bash
# Rodar apenas os testes do backend
mvn -q -f backend/pom.xml test
```

Se preferir abrir mais logs, remova a flag `-q`.

## Observações importantes
- Os testes de controllers utilizam MockMvc em modo standalone (sem subir o contexto completo do Spring), tornando a execução mais rápida e isolada.
- O teste de contexto padrão (`LojacrysleaoApiApplicationTests`) foi ajustado para não carregar o contexto completo, evitando dependência de configuração de banco para o ambiente de CI/local.

## Principais áreas cobertas
- Controllers: validação das rotas principais de produtos e demais recursos.
- Services: regras de negócio centrais (produtos, usuários, autenticação, categorias, etc.).
- Segurança/Autenticação: fluxos de autenticação simulados com mocks (sem dependência de infraestrutura externa).

## Troubleshooting
- Caso veja erros relacionados a banco de dados ao tentar subir o contexto, verifique se não está rodando algum teste de integração. Este relatório cobre apenas testes unitários.
- Certifique-se de estar usando a versão correta do Java (compatível com o projeto) e de ter o Maven instalado.

## Próximos passos (opcional)
- Adicionar relatório de cobertura (JaCoCo) para visualizar percentuais por classe e pacote.
- Incluir testes negativos/edge cases em endpoints administrativos e validadores.
