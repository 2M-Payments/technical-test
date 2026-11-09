# Projeto CRUD Full Stack

Este repositório serve para fins do teste técnico CRUD full stack utilizando **Node.js com TypeScript e TypeORM** para o back-end e **React com TypeScript** para o front-end. O foco da avaliação será a **qualidade do código**, os **padrões de commit** e a **organização do projeto**, e não apenas a funcionalidade em si.

## Tecnologias Utilizadas

### Back-end
- Node.js com TypeScript
- TypeORM para interação com MySQL
- Injeção de dependência
- Arquitetura modular
- Testes unitários
- Validação a entrada dos dados, **preferência ZOD**
- Utilizar framework para autenticação da sessão com **tempo limite de 30 minutos**

### Front-end
- React com TypeScript
- Componentização
- Gerenciamento de estado (Context API, Redux ou outro a critério do candidato)
- Testes unitários

## Exemplo ideal de estrutura do projeto
- OBS: É apenas uma sugestão de estrutura, mas o candidato pode escolher uma própria, contato que saiba explicar bem como funciona o padrão alternativo

### Back-end
```
backend/
│-- src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── entities/
│   ├── middlewares/
│   ├── routes/
│   ├── config/
│   ├── tests/
│   ├── app.ts
│   ├── server.ts
│-- .env
│-- ormconfig.json
│-- package.json
```

### Front-end
```
frontend/
│-- src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── contexts/
│   ├── tests/
│   ├── App.tsx
│-- package.json
```

## Padrões de Commit
Este projeto segue o padrão **Conventional Commits**. Exemplos:
```
feat: adiciona endpoint de criação de usuário
fix: corrige bug na autenticação
refactor: melhora a estrutura dos repositórios
test: adiciona teste da service de exclusao de um item por id
```

## Avaliação
Serão analisados os seguintes pontos:
- **Organização do código** (separação em camadas, padrões de projeto)
- **Clareza e legibilidade**
- **Boas práticas de TypeScript**
- **Estrutura dos commits e mensagens**
- **Uso adequado de injeção de dependência**
- **Testes unitários**
- **Avaliação de prioridade na entrega do CRUD**

## Funcionalidade necessárias do CRUD
1. Criar um item por vez
2. Criar vários itens em lote
3. Filtro por data
4. Aplicação de Filtros por status ou outro dado que seja possível a filtragem
5. Listagem de todos os itens do CRUD utilizando paginação
6. Listagem de um único item buscado por ID
7. Alteração dos dados de um item específico
8. Deletar um item por vez
9. Deletar vários itens por vez
10. Deletar todos os itens de uma vez
11. Usuário pode estar em mais de uma região/localidade. Exemplo: Brasil e Inglaterra

## Observações
1. O candidato deverá criar um fork do repositório. Ao concluir a avaliação, abrir um pull request.
2. Crie uma branch seguindo o modelo (`project/nome-candidato-nome-do-crud`).
3. Todas as alterações devem ser feitas por outros commits e PRs a fim de conseguirmos visualizar como é feito a atualização e familiaridade do candidato em conseguir trabalhar seguindo um Git Flow.
4. Commit suas alterações seguindo o padrão.
5. Prazo será de acordo do nível experiência da vaga, Estagiário/Trainee [7 Dias], Júnior [5 Dias], Pleno [3 Dias], Sênior [2 Dias].
---


# Solução — CRUD de Usuários por Região

> Candidato: **Carlos Eduardo** · Branch: `project/carlos-eduardo-crud-usuarios`

CRUD de **usuários** que podem pertencer a **uma ou mais regiões** (ex.: Brasil e Reino Unido), com autenticação por sessão que expira após **30 minutos de inatividade**.

## Stack

| Camada | Tecnologias |
| --- | --- |
| Back-end | Node.js 20+, TypeScript, Express 5, TypeORM 0.3 + MySQL 8, tsyringe (DI), Zod, express-session + Passport, Jest |
| Front-end | React 18, TypeScript, Vite, React Router, Context API + `useReducer`, Axios, Vitest + Testing Library |

## Como executar

Pré-requisitos: Node.js 20+ e Docker (ou um MySQL 8 local). O MySQL do `docker-compose.yml` fica na porta **3307** para não conflitar com um MySQL já instalado na 3306.

```bash
# 1. Banco de dados
docker compose up -d

# 2. API (http://localhost:3333)
cd backend
cp .env.example .env
npm install
npm run migration:run   # cria as tabelas e a lista de regiões
npm run seed            # cria o usuário admin@crud.dev / Admin@123
npm run dev

# 3. Front-end (http://localhost:5173)
cd ../frontend
npm install
npm run dev
```

Testes e verificações:

```bash
cd backend  && npm test && npm run typecheck && npm run lint
cd frontend && npm test && npm run typecheck && npm run lint
```

### Testando a API com Postman

Importe `docs/crud-usuarios.postman_collection.json` no Postman e use **Run collection**. A coleção faz login (o cookie de sessão é guardado automaticamente) e percorre os 11 requisitos em ordem, com asserções de status e de conteúdo, incluindo os cenários de erro (400, 403, 404 e 401 após o logout).

## Arquitetura do back-end

O código segue a estrutura em camadas sugerida no enunciado. A **arquitetura modular** pedida aparece de duas formas: cada recurso (usuários, regiões, autenticação) tem seus próprios arquivos em cada camada (`users.controller.ts`, `users.service.ts`, `users.routes.ts`…), e as camadas só se conhecem por interfaces injetadas, então trocar a persistência ou o algoritmo de hash não afeta services nem controllers. As pastas extras (`dtos`, `mappers`, `errors`, `providers`, `utils`, `database`) separam responsabilidades que, de outra forma, ficariam misturadas dentro de services ou controllers.

```
backend/src/
├── controllers/   # HTTP: valida a entrada com Zod, chama o service e monta a resposta
├── services/      # regras de negócio (dependem só de interfaces)
├── repositories/  # contratos (I*Repository) + implementações TypeORM
├── entities/      # entidades TypeORM (User, Region) e enum de status
├── middlewares/   # ensureAuthenticated e tratamento global de erros
├── routes/        # rotas por recurso + index com as rotas protegidas
├── config/        # env (Zod), data source, sessão, passport e container de DI
├── dtos/          # schemas Zod de entrada + tipos inferidos
├── mappers/       # entidade -> resposta pública (nunca expõe o hash de senha)
├── errors/        # AppError e especializações (400, 401, 403, 404, 409)
├── providers/     # IHashProvider + implementação com bcrypt
├── utils/         # helpers HTTP (usuário autenticado da requisição)
├── database/      # migrations (schema + regiões) e seed do administrador
├── @types/        # tipagem de req.user
├── tests/         # fakes em memória + testes unitários por camada
├── app.ts         # monta o Express (sem I/O, testável)
└── server.ts      # conecta ao banco, registra dependências e sobe a API
```

**Fluxo de uma requisição:** `routes → middlewares → controller → service → repository (interface) → TypeORM`.

- **Injeção de dependência:** services dependem de *interfaces* (`IUsersRepository`, `IRegionsRepository`, `IHashProvider`) resolvidas por **tokens** (`Symbol`, em `config/tokens.ts`). Só o `config/container.ts` (composition root) conhece as classes concretas. Nos testes, os services recebem repositórios em memória e um hash fake, sem banco e sem mocks frágeis.
- **Validação:** todo input (body, query e params) passa por schemas Zod nos controllers. O `ZodError` vira `400` com a lista de campos inválidos no middleware global de erros.
- **`ormconfig.json`:** o arquivo deixou de ser lido a partir do TypeORM 0.3. A configuração equivalente está em `src/config/data-source.ts`, usada tanto pela API quanto pela CLI de migrations. Criar um `ormconfig.json` que nada lê seria enganoso.
- **`.env`:** fica em `backend/.env` (ignorado pelo git); o modelo versionado é o `backend/.env.example`.

### Modelo de dados

```
users (id uuid, name, email único, password_hash, status, created_at, updated_at)
  └── user_regions (user_id, region_id)  ← N:N, ON DELETE CASCADE
regions (id, code ISO-3166 único, name)
```

`status`: `ACTIVE`, `INACTIVE` ou `PENDING`. Somente usuários `ACTIVE` conseguem fazer login.

### Autenticação (sessão de 30 minutos)

- `express-session` + `Passport` (serialização do ID na sessão; o usuário é reidratado a cada requisição e a sessão é invalidada se ele for removido ou inativado).
- Cookie `httpOnly`, `sameSite=lax`, `secure` em produção, `maxAge` de 30 minutos com **`rolling: true`**: cada requisição renova o prazo, então a sessão expira após 30 minutos **sem atividade**. O tempo é configurável em `SESSION_TTL_MINUTES`.
- Sessões persistidas no MySQL (`express-mysql-session`) para sobreviverem a restarts.
- `req.login` regenera o ID da sessão (proteção contra *session fixation*); a mensagem de erro de login é genérica para não revelar e-mails cadastrados.
- As rotas protegidas devolvem o header `X-Session-Expires-At`, que o front usa para exibir o tempo restante e deslogar automaticamente.

## Endpoints

Base: `/api`. Todas as rotas, exceto `POST /auth/login`, exigem sessão.

| # | Método | Rota | Descrição |
| --- | --- | --- | --- |
| — | `POST` | `/auth/login` | Login (`{ email, password }`) |
| — | `GET` | `/auth/me` | Usuário da sessão + expiração |
| — | `POST` | `/auth/logout` | Encerra a sessão |
| — | `GET` | `/regions` | Lista de regiões disponíveis |
| 1 | `POST` | `/users` | Cria um usuário |
| 2 | `POST` | `/users/bulk` | Cria até 100 usuários em uma transação (`{ users: [...] }`) |
| 3, 4, 5 | `GET` | `/users` | Lista paginada com filtros (ver abaixo) |
| 6 | `GET` | `/users/:id` | Busca por ID |
| 7 | `PATCH` | `/users/:id` | Atualização parcial |
| 8 | `DELETE` | `/users/:id` | Exclui um usuário |
| 9 | `DELETE` | `/users/bulk` | Exclui vários (`{ ids: [...] }`) |
| 10 | `DELETE` | `/users?confirm=true` | Exclui todos (exceto o usuário logado) |

No front-end, a busca por ID fica junto dos demais filtros da listagem e usa `GET /users/:id`; quando o ID é preenchido, os outros filtros são desativados.

Query de `GET /users`: `page`, `limit` (máx. 100), `search` (nome ou e-mail), `status`, `regionCode`, `createdFrom` e `createdTo` (`AAAA-MM-DD`, UTC, dia final inclusivo), `sortBy` (`name`, `email`, `status`, `createdAt`) e `sortOrder` (`asc`/`desc`).

Exemplo de criação (requisito 11, várias regiões):

```json
POST /api/users
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "senha-segura",
  "status": "ACTIVE",
  "regionCodes": ["BR", "GB"]
}
```

Resposta da listagem:

```json
{
  "data": [{ "id": "…", "name": "Maria Silva", "regions": [{ "code": "BR", "name": "Brasil" }, { "code": "GB", "name": "Reino Unido" }], "…": "…" }],
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

### Regras de negócio

- E-mail é único; no lote, duplicidades (dentro do lote ou já cadastradas) são rejeitadas e **nada é criado**.
- Códigos de região inexistentes retornam `400` informando quais são inválidos.
- Ao filtrar por região, o usuário retorna com **todas** as suas regiões (o filtro usa um join separado).
- O usuário logado não pode excluir a si mesmo: `403` na exclusão unitária e ignorado nas exclusões em lote/total.
- "Excluir todos" exige `confirm=true`, evitando exclusões acidentais.

## Front-end

```
frontend/src/
├── components/
│   ├── layout/    # AppLayout (cabeçalho com tempo de sessão) e ProtectedRoute
│   ├── ui/        # Button, TextField, SelectField, Alert, ConfirmDialog, StatusBadge
│   └── users/     # UsersTable, UserFilters, Pagination, UserForm, RegionSelector, BulkActionsBar
├── contexts/      # AuthContext e UsersContext (+ users.reducer puro e testável)
├── hooks/         # useAuth, useUsers, useUser, useRegions, useSessionCountdown
├── pages/         # Login, listagem, detalhes, criação, edição e criação em lote
├── services/      # cliente Axios e serviços por recurso
├── tests/         # Vitest + Testing Library
├── types/
└── utils/
```

- **Estado:** `AuthContext` controla a sessão (recupera a sessão ao abrir, trata `401` globalmente e desloga ao fim dos 30 minutos). `UsersContext` usa `useReducer` para filtros, paginação, ordenação e seleção, que persistem ao navegar entre listagem, edição e detalhes.
- **Proxy do Vite:** `/api` aponta para a API, mantendo front e back na mesma origem para o cookie de sessão.
- **Busca por ID (requisito 6):** é o primeiro campo do card de filtros. Valida o formato UUID e, quando preenchido, a listagem passa a mostrar só aquele usuário (`usersService.search` usa `GET /users/:id`; um 404 vira lista vazia). O nome de cada usuário na tabela também abre a página de detalhes.
- A edição envia via `PATCH` apenas os campos alterados.

## Como a entrega atende à avaliação

| Critério | Onde ver |
| --- | --- |
| Organização do código | Back-end em camadas (`controllers → services → repositories`), front-end em `components / pages / services / hooks / contexts` |
| Clareza e legibilidade | Controllers finos, regras só nos services, nomes descritivos, comentários apenas onde explicam o *porquê* |
| Boas práticas de TypeScript | `strict`, sem `any` no código de produção, tipos inferidos dos schemas Zod, interfaces para repositórios e providers, `import type` |
| Commits | Conventional Commits com escopo, uma branch por entrega e merges `--no-ff` |
| Injeção de dependência | tsyringe com tokens em `config/tokens.ts`; implementações registradas só em `config/container.ts` |
| Testes unitários | Back-end: services, controllers, middlewares e DTOs (Jest, com fakes em memória). Front-end: reducer, serviços, componentes e páginas (Vitest + Testing Library) |
| Prioridade na entrega | Ordem do histórico: modelo de dados → CRUD na API → autenticação → testes → front-end → refinamentos |

| Requisito | API | Tela |
| --- | --- | --- |
| 1. Criar um item | `POST /users` | Novo usuário |
| 2. Criar em lote | `POST /users/bulk` | Criar em lote |
| 3. Filtro por data | `createdFrom` / `createdTo` | Filtros "Criado de/até" |
| 4. Filtro por status (e outros) | `status`, `regionCode`, `search` | Filtros |
| 5. Listagem paginada | `GET /users?page&limit` | Tabela + paginação |
| 6. Busca por ID | `GET /users/:id` | Filtro "ID" e página de detalhes |
| 7. Alterar um item | `PATCH /users/:id` | Editar |
| 8. Excluir um | `DELETE /users/:id` | Excluir na linha |
| 9. Excluir vários | `DELETE /users/bulk` | Seleção + "Excluir selecionados" |
| 10. Excluir todos | `DELETE /users?confirm=true` | "Excluir todos" |
| 11. Várias regiões | tabela `user_regions` (N:N) | Seletor de regiões |

## Git Flow

Cada entrega foi feita em uma branch própria (`chore/…`, `feat/…`, `test/…`, `fix/…`, `docs/…`), integrada na branch do projeto com merge `--no-ff`, para que o histórico mostre a evolução por etapas. Os commits seguem **Conventional Commits** com escopo (`feat(backend): …`, `test(frontend): …`).

```bash
git log --oneline --graph project/carlos-eduardo-crud-usuarios
```

## Decisões e próximos passos

- Prioridade de entrega: modelo de dados e CRUD completo no back-end primeiro, depois autenticação, testes e, por fim, o front-end.
- Datas dos filtros são interpretadas em UTC.
- Próximos passos: testes de integração com banco (Testcontainers), rate limit no login, papéis de acesso (admin x usuário comum) e pipeline de CI.
