# 📦 Backend – Controle Financeiro

Este é o backend da aplicação **Controle Financeiro**, uma API REST desenvolvida em Node.js com TypeScript, Express e TypeORM, que permite autenticação via JWT e gerenciamento de transações financeiras.

---

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- TypeORM
- MySQL
- JWT
- tsyringe (Injeção de dependência)
- Zod (validação)
- Jest (testes automatizados)

---

## ⚙️ Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd backend
```

### 2. Crie o arquivo `.env`

Crie um arquivo `.env` na raiz do backend com o seguinte conteúdo:

```env
PORT=8000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=dbpassexemplo
DB_DATABASE=bancoexemplo
JWT_SECRET=jwtexemplo
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor

```bash
npm run dev
```

A API estará rodando em `http://localhost:8000`

---

## 🧪 Rodar Testes

```bash
npm run test
```

---

## 🔐 Autenticação

A autenticação é baseada em **JWT**. Após o login, o token deve ser incluído no header de cada requisição:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🔗 Endpoints

### /auth
- `POST /auth/register`: Registrar novo usuário
- `POST /auth/login`: Fazer login e obter token JWT

### /transactions (protegido por JWT)
- `POST /transactions`: Criar uma transação
- `POST /transactions/batch`: Criar várias transações
- `GET /transactions?page=1&limit=10`: Listar com paginação
- `GET /transactions/summary`: Obter resumo financeiro
- `GET /transactions/:id`: Buscar transação por ID
- `PUT /transactions/:id`: Atualizar transação
- `DELETE /transactions/:id`: Apagar uma transação
- `DELETE /transactions/batch`: Apagar várias transações
- `DELETE /transactions/all`: Apagar todas as transações

---

## 🗄️ Estrutura

- `src/entities/`: Entidades `User` e `Transaction`
- `src/routes/`: Arquivos de rotas
- `src/middlewares/`: Middleware de erros e autenticação
- `src/container/`: Injeção de dependência (tsyringe)
- `src/server.ts`: Inicialização do servidor
- `src/app.ts`: Configuração da aplicação Express

---

## 🧑‍💻 Autor

**Rodrigo Albuquerque da Costa**
