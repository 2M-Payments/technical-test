# 🧴🚗 API de Brindes – Aromatizantes Automotivos (Atacado)

Este projeto é uma **API RESTful** desenvolvida como teste técnico, simulando o backend de uma **empresa que vende aromatizantes automotivos personalizados em atacado**, utilizados como brindes corporativos.

A API cobre **autenticação**, **gestão completa de usuários** e **gestão completa de pedidos**, incluindo cálculos de preço e estatísticas.

---

## 🧠 Contexto do Negócio

A empresa trabalha com:

* Venda **em atacado**
* Pedidos com **quantidade mínima**
* Cálculo de preço baseado em volume
* Clientes corporativos

O sistema foi modelado para refletir um cenário real de backoffice:

* Usuários (administradores, operadores)
* Pedidos de brindes
* Operações em lote (batch)

---

## 🛠️ Tecnologias Utilizadas

* **Node.js**
* **TypeScript**
* **Express**
* **TypeORM**
* **MySQL**
* **JWT / Session-based Auth**
* **Migrations com TypeORM**

---

## 🚀 Como Executar o Projeto

### 1️⃣ Instalar dependências

```bash
pnpm install
```

### 2️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` baseado no exemplo:

```env
DB_HOST=localhost
DB_PORT=3306
BLUEPRINT_DB_USERNAME=root
BLUEPRINT_DB_PASSWORD=password
BLUEPRINT_DB_DATABASE=blueprint
NODE_ENV=development
```

### 3️⃣ Rodar migrations

```bash
pnpm migration:run
```

### 4️⃣ Iniciar servidor

```bash
pnpm dev
```

A API estará disponível em:

```
http://localhost:3001
```

---

## 📍 Endpoints Disponíveis

### 🔐 Auth

| Método | Endpoint            | Descrição              |
| ------ | ------------------- | ---------------------- |
| POST   | `/api/auth/login`   | Login do usuário       |
| POST   | `/api/auth/logout`  | Logout                 |
| GET    | `/api/auth/session` | Verificar sessão ativa |

---

### 👤 Users (CRUD Completo + Batch)

| # | Método | Endpoint                | Descrição                  |
| - | ------ | ----------------------- | -------------------------- |
| 1 | POST   | `/api/users`            | Criar usuário              |
| 2 | POST   | `/api/users/batch`      | Criar múltiplos usuários   |
| 3 | GET    | `/api/users`            | Listar usuários (paginado) |
| 4 | GET    | `/api/users/:id`        | Buscar usuário por ID      |
| 5 | PUT    | `/api/users/:id`        | Atualizar usuário          |
| 6 | DELETE | `/api/users/:id`        | Deletar usuário            |
| 7 | DELETE | `/api/users/batch/many` | Deletar múltiplos usuários |
| 8 | DELETE | `/api/users/batch/all`  | Deletar todos os usuários  |

---

### 📦 Orders (Pedidos de Brindes)

| #  | Método | Endpoint                 | Descrição                           |
| -- | ------ | ------------------------ | ----------------------------------- |
| 1  | POST   | `/api/orders`            | Criar pedido                        |
| 2  | POST   | `/api/orders/batch`      | Criar múltiplos pedidos             |
| 3  | GET    | `/api/orders`            | Listar pedidos (paginado + filtros) |
| 4  | GET    | `/api/orders/:id`        | Buscar pedido por ID                |
| 5  | PUT    | `/api/orders/:id`        | Atualizar pedido                    |
| 6  | DELETE | `/api/orders/:id`        | Deletar pedido                      |
| 7  | DELETE | `/api/orders/batch/many` | Deletar múltiplos pedidos           |
| 8  | DELETE | `/api/orders/batch/all`  | Deletar todos os pedidos            |
| 🎁 | POST   | `/api/orders/calculate`  | Calcular preço do pedido            |
| 🎁 | GET    | `/api/orders/stats`      | Estatísticas de pedidos             |

---

## 🎁 Funcionalidades Extras

### 🔢 Cálculo de Preço

O endpoint `/api/orders/calculate` simula a lógica de precificação baseada em:

* Quantidade
* Valor unitário
* Possíveis descontos por volume

### 📊 Estatísticas

O endpoint `/api/orders/stats` retorna métricas como:

* Total de pedidos
* Quantidade total de itens
* Valor total faturado

---

## 🧱 Estrutura do Projeto

```txt
src/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── entities/
 ├── migrations/
 ├── repositories/
 ├── routes/
 ├── services/
 ├── tests/
 ├── app.ts
 └── server.ts
```

---

## ✅ Observações Técnicas

* Projeto segue separação por **camadas (Controller / Service / Repository)**
* Uso de **migrations** para versionamento do banco
* Endpoints batch simulam operações comuns em sistemas corporativos
* Estrutura pensada para fácil escalabilidade

---

## 📌 Considerações Finais

O foco do projeto é demonstrar:

* Organização de código
* Domínio de CRUD completo
* Uso correto de TypeORM
* Boa modelagem de API
* Clareza de regras de negócio

Este projeto representa um cenário realista de backend para uma empresa de brindes personalizados em atacado.

---

👨‍💻 Desenvolvido como teste técnico
