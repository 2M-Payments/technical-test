# Backend - API REST

API REST desenvolvida em Node.js com TypeScript, seguindo arquitetura em camadas.

## 🚀 Tecnologias

- Node.js, TypeScript, Express
- TypeORM, MySQL
- Zod, JWT, TSyringe
- Jest, ESLint

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `backend/`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=your_database
DB_LOGGING=false

JWT_SECRET=your_super_secret_jwt_key

CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Instalação

```bash
pnpm install
pnpm build
pnpm dev
```

## 📜 Scripts

```bash
pnpm dev      # Desenvolvimento com hot-reload
pnpm build    # Compilar TypeScript
pnpm start    # Produção
pnpm lint     # Verificar código
pnpm test     # Executar testes
```

## 📁 Estrutura

```
src/
├── controllers/    # Controladores
├── services/       # Lógica de negócio
├── repositories/   # Acesso a dados
├── entities/       # Entidades TypeORM
├── routes/         # Rotas
├── middlewares/    # Middlewares
├── schemas/        # Validação (Zod)
└── utils/          # Utilitários
```

## 🔌 Endpoints

### Autenticação

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

### Produtos

```
POST   /api/v1/products
GET    /api/v1/products
GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
DELETE /api/v1/products
DELETE /api/v1/products/all
```
