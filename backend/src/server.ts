import { app } from "./app";
import { AppDataSource } from "./config/database";

const PORT = process.env.PORT || 3000;

// Inicializa o banco de dados e inicia o servidor
AppDataSource.initialize()
  .then(() => {
    console.log("📦 Banco de dados conectado com sucesso!");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar no banco de dados:", error);
  });
