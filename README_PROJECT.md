# 🎵 Projeto Technical-Test

Este projeto é um sistema de gerenciamento de músicos, incluindo um backend com Node.js (TypeScript, TypeORM, MySQL) e um frontend com React (TypeScript). Espero que tenha atendido plenamente, ou em grande parte, o que foi solicitado.

---

## 📌 Requisitos
Antes de começar, certifique-se de ter os seguintes softwares instalados:
- [Node.js](https://nodejs.org/) (versão recomendada: 18 ou superior)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

---

## 🚀 Passo 1: Configurar o Banco de Dados MySQL
### 📌 Criando o Banco de Dados
1. Inicie o MySQL e execute o seguinte comando para criar o banco:
   ```sql
   CREATE DATABASE technical_test;
   ```

2. Crie um usuário e conceda permissões:
   ```sql
   CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON technical_test.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. Configure as variáveis de ambiente no arquivo `.env` dentro da pasta `backend`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=user
   DB_PASS=password
   DB_NAME=technical_test
   ```

4. **Rodar as migrações do banco de dados**:
   ```sh
   cd backend
   npx typeorm migration:run
   ```

5. **Popular o banco com dados iniciais**:
   ```sh
   npx ts-node src/seeds/musicos.seed.ts
   ```

---

## 🚀 Passo 2: Rodar o Backend
1. **Acesse a pasta do backend:**
   ```sh
   cd backend
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   ```
3. **Inicie o servidor:**
   ```sh
   npm run dev
   ```
4. O backend estará rodando em: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Passo 3: Rodar o Frontend
1. **Acesse a pasta do frontend:**
   ```sh
   cd ../frontend
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   ```
3. **Inicie o frontend:**
   ```sh
   npm start
   ```
4. O frontend estará disponível em: [http://localhost:5173](http://localhost:5173)

---

## 🛠 Tecnologias Utilizadas
- **Backend:** Node.js, TypeScript, TypeORM, MySQL
- **Frontend:** React, TypeScript, React Router
- **Testes:** Jest, React Testing Library

---

## 🎯 Endpoints da API
| Método | Rota                 | Descrição                        |
|--------|----------------------|----------------------------------|
| GET    | `/musicos`           | Lista todos os músicos          |
| GET    | `/musicos/:id`       | Busca um músico pelo ID         |
| POST   | `/musicos`           | Cria um novo músico             |
| PUT    | `/musicos/:id`       | Atualiza um músico              |
| DELETE | `/musicos/:id`       | Exclui um músico específico     |
| DELETE | `/musicos`           | Exclui todos os músicos         |

---

## 🎯 Como Rodar os Testes
Para rodar os testes unitários e de integração, execute:
```sh
cd backend
npm test
```

Para testar o frontend:
```sh
cd ../frontend
npm test
```

---

## 🔥 Problemas e Soluções Comuns

### Erro ao conectar no MySQL
Se ocorrer erro ao conectar ao banco de dados, verifique se:
- O MySQL está rodando (`mysql -u user -p`)
- As credenciais no `.env` estão corretas

### Erro `address already in use` ao iniciar o backend
Caso a porta 3000 já esteja em uso, pare o processo:
```sh
npx kill-port 3000
```

---

## 📌 Contribuição
Se quiser contribuir com melhorias, siga os passos:
1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/technical-test.git
   ```
2. **Crie uma nova branch:**
   ```sh
   git checkout -b minha-mudanca
   ```
3. **Faça suas alterações e commit:**
   ```sh
   git commit -m "Adiciona nova funcionalidade"
   ```
4. **Envie para o repositório remoto:**
   ```sh
   git push origin minha-mudanca
   ```
5. **Abra um Pull Request no GitHub.**

---

## 📜 Licença
Este projeto é open-source e pode ser usado livremente.

---

💡 **Agora é só seguir os passos e rodar o sistema!** 🚀

