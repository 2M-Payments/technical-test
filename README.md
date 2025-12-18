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

