import dotenv from 'dotenv';
dotenv.config();
import AppDataSource from "./database/app-datasource";
import express from 'express';


AppDataSource.initialize() // função para incializar a conexão com o banco de dados
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((error) => console.log(error))

const app = express();

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});