<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 8 créditos restantes para usar o sistema de feedback AI.

# Feedback para Athoosz:

Nota final: **43.5/100**

Olá, Athoosz! 🚀 Que jornada bacana você está trilhando com essa API para o Departamento de Polícia! Antes de mais nada, parabéns por ter conseguido implementar várias funcionalidades importantes, especialmente a autenticação com JWT, o hashing de senhas com bcrypt e a proteção das rotas. Isso não é trivial e você mandou bem nisso! 🎉

---

### 🎯 Pontos Fortes que Merecem Destaque

- Seu `authController.js` está muito bem estruturado, com validação forte da senha, hash seguro com bcrypt e geração correta do JWT com expiração. Isso é fundamental para a segurança da aplicação.
- O middleware de autenticação (`authMiddleware.js`) está implementado corretamente, validando o token JWT e protegendo as rotas de `/agentes` e `/casos`.
- Os controllers de agentes e casos têm validações detalhadas e tratamento de erros personalizado, o que melhora muito a experiência da API.
- Você seguiu o padrão MVC, separando controllers, repositories, rotas e middlewares, o que é excelente para manutenção e escalabilidade.
- Nota bônus: você implementou corretamente os endpoints de filtragem e busca, que são requisitos extras. Isso mostra seu esforço para ir além do básico.

---

### 🚨 Onde Precisamos Dar Uma Atenção Especial (Análise dos Testes que Falharam)

Você teve algumas dificuldades que impactaram sua nota e que precisam ser corrigidas para garantir que a aplicação funcione conforme esperado e passe em todos os testes obrigatórios.

Vou listar os testes que falharam e analisar as causas raiz para você entender a fundo o que está acontecendo.

---

#### 1. `USERS: Recebe erro 400 ao tentar criar um usuário com e-mail já em uso`

**O que está acontecendo?**

No seu `authController.register`, você verifica se o email já existe com:

```js
const usuarioExistente = await usuariosRepository.findByEmail(email);
if (usuarioExistente) {
    return res.status(409).json({ error: 'Email já está em uso.' });
}
```

O problema é que o teste espera um **status 400 Bad Request** quando o email já está em uso, mas você está retornando **409 Conflict**.

**Por que isso importa?**

O teste está validando que a resposta para email duplicado seja 400, e sua resposta 409 faz o teste falhar.

**Como corrigir?**

Altere o status para 400, assim:

```js
if (usuarioExistente) {
    return res.status(400).json({ error: 'Email já está em uso.' });
}
```

**Recurso recomendado:** Para entender melhor códigos HTTP e quando usá-los, veja este vídeo sobre boas práticas em APIs REST: https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

---

#### 2. `USERS: Recebe erro 400 ao tentar criar um usuário com campo extra`

**O que está acontecendo?**

O teste espera que, se o payload para criação de usuário tiver campos extras que não são esperados (exemplo: um campo `idade`), a API retorne erro 400.

No seu controller, você não está validando se existem campos extras no corpo da requisição. Você apenas valida se nome, email e senha existem, mas não bloqueia campos extras.

**Por que isso importa?**

Aceitar campos extras pode ser um problema de segurança e integridade dos dados. Além disso, o teste exige esse comportamento.

**Como corrigir?**

Implemente uma validação para garantir que o corpo tenha somente os campos esperados. Por exemplo:

```js
const allowedFields = ['nome', 'email', 'senha'];
const extraFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
if (extraFields.length > 0) {
    return res.status(400).json({ error: 'Campos extras não permitidos: ' + extraFields.join(', ') });
}
```

Coloque isso no início do seu `register` para rejeitar requisições com campos inesperados.

**Recurso recomendado:** Para aprender mais sobre validação de entrada e segurança, recomendo este vídeo feito pelos meus criadores sobre autenticação e boas práticas: https://www.youtube.com/watch?v=Q4LQOfYwujk

---

#### 3. `Simple Filtering: Estudante implementou endpoint de filtragem de caso por status corretamente` e outros testes bônus de filtragem que falharam

Você implementou os endpoints de filtragem e busca, mas os testes bônus indicam que eles não passaram.

**Análise técnica rápida:**

- Seus endpoints de casos para filtragem por status e agente estão implementados, porém, no arquivo `casosRoutes.js`, as rotas para `/casos/status` e `/casos/agent` estão definidas *depois* da rota `/casos/:id`, o que pode causar conflito de rotas, já que `/casos/:id` captura qualquer caminho com `/casos/*`.

- Por exemplo, quando você faz uma requisição para `/casos/status?status=aberto`, o Express pode interpretar `status` como `id` na rota `/casos/:id`, e não chamar o handler correto.

**Como corrigir?**

Reordene as rotas no arquivo `casosRoutes.js` para colocar as rotas específicas antes das rotas com parâmetros dinâmicos. Assim:

```js
// Coloque estas rotas antes das rotas com :id
casosRouter.get("/status", casosController.getCasosByStatus);
casosRouter.get("/agent", casosController.getCasosByAgenteId);
casosRouter.get("/search", casosController.getCasosByTituloOrDescricao);

// Depois as rotas com :id
casosRouter.get("/:id", casosController.getCasoById);
casosRouter.put("/:id", casosController.updateCaso);
casosRouter.patch("/:id", casosController.patchCaso);
casosRouter.delete("/:id", casosController.deleteCaso);
```

**Por que isso?**

O Express avalia as rotas na ordem em que são declaradas. Rotas genéricas com parâmetros dinâmicos (`/:id`) devem vir depois das rotas específicas para evitar conflitos.

**Recurso recomendado:** Para entender melhor roteamento no Express, veja este vídeo sobre boas práticas e organização de rotas: https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

---

#### 4. `USERS: Recebe erro 400 ao tentar criar um usuário com nome vazio ou nulo`

Você passou neste teste, mas seu `INSTRUCTIONS.md` apresenta inconsistências que podem confundir quem for usar sua API.

**Exemplo no seu INSTRUCTIONS.md:**

```md
Retorno:
```json
{
  "acess_token": "token aqui"
}
```
```

Aqui você escreveu `"acess_token"` em vez de `"access_token"` (com dois 's'). Isso pode causar problemas em clientes que consomem sua API.

**Como corrigir?**

Padronize para `"access_token"` em todo lugar, inclusive no controller `authController.login`:

```js
return res.status(200).json({ access_token: token });
```

---

#### 5. Penalidade: `Static files: usuário não seguiu estrutura de arquivos à risca`

Seu projeto ficou com a estrutura quase perfeita, mas falta o arquivo `.env` e o `docker-compose.yml` no repositório, que são importantes para facilitar o setup do ambiente.

Além disso, no seu `INSTRUCTIONS.md`, o trecho para iniciar o banco com Docker está incompleto:

```md
Para iniciar novamente:
```

Está sem o comando para subir o container.

**Como corrigir?**

- Inclua o arquivo `.env` com as variáveis necessárias (sem expor segredos reais, apenas um template).
- Inclua um `docker-compose.yml` para facilitar subir o banco.
- Complete o `INSTRUCTIONS.md` com o comando correto para iniciar o banco:

```sh
docker start policia_db
```

**Recurso recomendado:** Para entender como configurar banco com Docker e Knex, veja este vídeo: https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s

---

### 🛠️ Outras Observações Técnicas

- No `authController.login` você define:

```js
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';
```

Mas no middleware você faz:

```js
const JWT_SECRET = process.env.JWT_SECRET;
```

Se a variável de ambiente não estiver definida, o middleware terá `undefined` e falhará. Isso pode causar erros difíceis de debugar em produção.

**Sugestão:** Centralize a leitura da variável de ambiente em um arquivo config, ou garanta que `JWT_SECRET` sempre tenha valor, por exemplo:

```js
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';
```

em ambos os lugares.

---

### 📚 Recursos para Você Estudar e Melhorar

- **Autenticação JWT e segurança:** https://www.youtube.com/watch?v=Q4LQOfYwujk (Esse vídeo, feito pelos meus criadores, fala muito bem sobre conceitos fundamentais de autenticação e segurança.)
- **Uso prático de JWT e BCrypt:** https://www.youtube.com/watch?v=L04Ln97AwoY
- **Configuração de banco com Docker e Knex:** https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s
- **Arquitetura MVC e boas práticas em Node.js:** https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s
- **Roteamento e organização no Express:** https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

---

### 📋 Resumo dos Pontos para Focar e Corrigir

- Corrigir o status code para email duplicado de 409 para 400 no registro de usuário.
- Validar e rejeitar campos extras no payload de criação de usuário.
- Reordenar rotas no `casosRoutes.js` para evitar conflito entre rotas específicas e dinâmicas.
- Corrigir o nome do campo `access_token` para padronizar em toda a API e documentação.
- Garantir que `JWT_SECRET` esteja definido consistentemente em todo o código.
- Completar a documentação e estrutura do projeto com `.env` e `docker-compose.yml` para facilitar o setup.
- Revisar o `INSTRUCTIONS.md` para corrigir pequenos erros e completar instruções.
- Continuar investindo em testes e validações para garantir robustez da API.

---

### 💬 Conclusão

Athoosz, você está no caminho certo e já fez um trabalho sólido com autenticação, hashing e proteção das rotas! O que falta são ajustes importantes para alinhar à especificação dos testes, especialmente na padronização de respostas, validação rigorosa dos dados de entrada e organização das rotas para evitar conflitos.

Essas correções vão destravar uma nota muito melhor e deixar sua API pronta para produção de verdade! Continue firme, pois você está construindo uma base muito boa. Se precisar, revise os recursos que recomendei, eles vão te ajudar bastante a entender os detalhes.

Conte comigo para o que precisar! 🚀💙

Um abraço e bons códigos! 👊✨

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>