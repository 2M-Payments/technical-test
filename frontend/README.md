# Frontend - React Application

Aplicação React desenvolvida com TypeScript, seguindo boas práticas de desenvolvimento moderno.

## 🚀 Tecnologias

- React 19, TypeScript
- Vite, Tailwind CSS
- Redux Toolkit, React Router
- React Hook Form, Zod
- Radix UI, Vitest
- ESLint

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `frontend/`:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

### Instalação

```bash
pnpm install
pnpm dev
```

## 📜 Scripts

```bash
pnpm dev              # Desenvolvimento
pnpm build            # Build de produção
pnpm preview          # Preview do build
pnpm lint             # Verificar código
```

## 📁 Estrutura

```
src/
├── components/       # Componentes React
│   ├── layout/       # Layouts
│   ├── modals/       # Modais
│   ├── shared/       # Componentes compartilhados
│   └── ui/           # Componentes UI (Radix UI)
├── contexts/         # Contextos React
├── features/         # Features (Redux slices e APIs)
├── hooks/            # Custom hooks
├── lib/              # Utilitários
├── pages/            # Páginas
│   ├── private/      # Páginas autenticadas
│   └── public/       # Páginas públicas
├── schemas/          # Schemas de validação (Zod)
├── services/         # Serviços (API client)
├── store/            # Configuração Redux
└── tests/            # Testes
```

## 🏗️ Arquitetura

### Gerenciamento de Estado

- **Redux Toolkit** para estado global
- **RTK Query** para requisições HTTP
- Slices por feature (auth, products)

### Roteamento

- **React Router** para navegação
- Rotas protegidas com `RouteGuard`
- Redirecionamento automático baseado em autenticação

### Validação

- **Zod** para validação de schemas
- **React Hook Form** para formulários
- Validação integrada com resolvers

### UI

- **Radix UI** para componentes acessíveis
- **Tailwind CSS** para estilização
- **shadcn/ui** como base de componentes

## 🔌 Rotas

### Públicas

```
/login          # Login
/register       # Registro
```

### Privadas

```
/dashboard      # Dashboard (requer autenticação)
```

## 🧪 Testes

Testes com Vitest e Testing Library:

```bash
pnpm test
```

### Estrutura de Testes

- Testes unitários para componentes
- Testes de integração para features
- Testes de hooks customizados
- Setup com jsdom para ambiente DOM

## 🎨 Componentes Principais

- **DataTable**: Tabela de dados com paginação
- **Modal**: Sistema de modais gerenciado por contexto
- **RouteGuard**: Proteção de rotas
- **AuthLoader**: Carregamento de estado de autenticação