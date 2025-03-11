# Projeto CRUD Full Stack

Este repositório serve para fins do teste técnico CRUD full stack utilizando **Node.js com TypeScript e TypeORM** para o back-end e **React com TypeScript** para o front-end. O foco da avaliação será a **qualidade do código**, os **padrões de commit** e a **organização do projeto**, e não apenas a funcionalidade em si.

## Tecnologias Utilizadas

### Back-end
- Node.js com TypeScript
- TypeORM para interação com MySQL
- Injeção de dependência
- Arquitetura modular
- Testes unitários

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
text: adiciona teste da service de exclusao de um item por id
```

## Avaliação
Serão analisados os seguintes pontos:
- **Organização do código** (separação em camadas, padrões de projeto)
- **Clareza e legibilidade**
- **Boas práticas de TypeScript**
- **Estrutura dos commits e mensagens**
- **Uso adequado de injeção de dependência**
- **Testes unitários**

## Observações
1. O candidato deverá abrir uma branch própria para realização do projeto e **não deve mergear na main em hipótese alguma**!
2. Crie uma branch seguindo o modelo (`project/nome-candidato-nome-do-crud`)
3. Essa branch do candidato (Ex: (`project/arthur-barros-crud-supermercado`)) servirá como a branch main do projeto do candidato, todas as alterações devem ser feitas por outros commits e PRs a fim de conseguirmos visualizar como é feito a atualização e familiaridade do candidato em conseguir trabalhar seguindo um Git Flow 
4. Commit suas alterações seguindo o padrão
5. Abra um Pull Request e pode fazer o merge sem depender do avaliador, o histórico será analisado futuramente quando concluir a prova

---

