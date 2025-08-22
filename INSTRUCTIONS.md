## Autenticação de Usuários

### Registro de Usuário
Endpoint: `POST /auth/register`
Body:
```json
{
  "nome": "Nome do usuário",
  "email": "email@exemplo.com",
  "senha": "SenhaForte@123"
}
```
Retornos:
- 201 Created: Usuário registrado com sucesso.
- 400 Bad Request: Campos obrigatórios ausentes ou senha fraca.
- 409 Conflict: Email já está em uso.


### Login de Usuário
Endpoint: `POST /auth/login`
Body:
```json
{
  "email": "email@exemplo.com",
  "senha": "SenhaForte@123"
}
```
Retorno:
```json
{
  "acess_token": "token aqui"
}
```
Status Codes:
- 200 OK: Login bem-sucedido, retorna o objeto acima.
- 400 Bad Request: Email do login já está em uso ou dados inválidos.
- 401 Unauthorized: acess token inválido.

Importante:
- Para gerenciar o segredo do seu JWT, utilize a seguinte variável de ambiente:
```
JWT_SECRET="segredo aqui"
```
- NUNCA insira seus segredos diretamente no código, pois essa é uma brecha crítica de segurança, além de interferir com o funcionamento dos testes.

### Exemplo de envio do token JWT
Após o login, envie o token JWT no header Authorization para acessar rotas protegidas:

```
Authorization: Bearer <token>
```

### Fluxo de autenticação esperado
1. Usuário registra via `/auth/register`.
2. Usuário faz login via `/auth/login` e recebe o JWT.
3. Usuário acessa rotas protegidas (`/agentes`, `/casos`) enviando o token no header Authorization.
4. Se o token for inválido ou expirado, retorna 401 Unauthorized.

### Segurança
- O segredo do JWT deve ser gerenciado via variável de ambiente:
```
JWT_SECRET="segredo aqui"
```
- Nunca insira segredos diretamente no código.

### Status Codes e Orientações
- 200 OK: Login bem-sucedido, retorna `{ "acess_token": "token aqui" }`
- 400 Bad Request: Email já está em uso ou dados inválidos
- 401 Unauthorized: Token inválido ou expirado
# INSTRUÇÕES PARA EXECUÇÃO DO PROJETO

## 1. Subir o banco de dados com Docker

Se você tem Docker instalado, execute o comando abaixo na raiz do projeto para subir o PostgreSQL:

```sh
docker run --name policia_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=policia_db -p 5432:5432 -d postgres
```

> Isso irá criar um container chamado `policia_db` rodando na porta padrão 5432.

---

## 2. Executar as migrations

Com o banco rodando, execute:

```sh
npx knex migrate:latest
```

> Isso irá criar as tabelas necessárias no banco de dados.

---

## 3. Rodar as seeds

Para popular o banco com dados iniciais, execute:

```sh
npx knex seed:run
```

> Isso irá inserir agentes e casos de exemplo nas tabelas.

---

## Observações

- Certifique-se de que o arquivo `.env` está configurado corretamente com usuário, senha e nome do banco.
- Se quiser parar o banco, use:
  ```sh
  docker stop policia_db
  ```
- Para iniciar novamente:
  ```sh