# 🎨 Frontend – Controle Financeiro

Este é o frontend da aplicação **Controle Financeiro**, desenvolvido com React + TypeScript, que consome uma API REST e permite aos usuários autenticados gerenciar transações financeiras (ganhos e despesas).

---

## 🚀 Tecnologias

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [TailwindCSS](https://tailwindcss.com/) (estilização)
- [Axios](https://axios-http.com/) (requisições HTTP)
- [React Router DOM](https://reactrouter.com/en/main) (rotas)
- [Formik](https://formik.org/) + [Zod](https://zod.dev/) + [Yup](https://github.com/jquense/yup) (validação de formulários)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) (testes)
- ESLint

---

## 🗂️ Estrutura do Projeto

```
src/
├── __tests__/         # Testes automatizados
├── components/        # Componentes reutilizáveis
├── contexts/          # Context API (auth)
├── hooks/             # Hooks customizados
├── pages/             # Páginas principais
├── schemas/           # Schemas de validação (Zod/Yup)
├── services/          # Configuração do Axios + AuthService
├── types/             # Tipagens personalizadas
├── App.tsx            # Rotas principais
├── main.tsx           # Entry point
└── index.css          # Estilos base (Tailwind)
```

---

## 🔐 Autenticação

A autenticação é feita via JWT. O token:

- É obtido no login via `/auth/login`
- É salvo no `localStorage` (`@App:token`)
- É adicionado ao header `Authorization` globalmente via Axios:
  ```ts
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  ```
- A navegação entre rotas usa `useNavigate()` do React Router.

---

## 🌐 Rotas (exemplos)

- `/login` – Página de login
- `/register` – Página de cadastro
- `/dashboard` – Página principal com transações
- (Rotas protegidas usam `isAuthenticated` do contexto)

---

## ⚙️ Como rodar

### 1. Instale as dependências

```bash
cd frontend
npm install
```

### 2. Rode a aplicação

```bash
npm run dev
```

Abra no navegador: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testes

O projeto usa **Jest** e **React Testing Library**.

Para rodar os testes:

```bash
npm run test
```

---

## 📄 Scripts disponíveis

```bash
npm run dev       # Inicia em modo desenvolvimento
npm run build     # Compila o projeto para produção
npm run preview   # Visualiza o build localmente
npm run lint      # Verifica problemas com ESLint
npm run test      # Executa testes com Jest
```

---

## 🧑‍💻 Autor

**Rodrigo Albuquerque da Costa**

---
