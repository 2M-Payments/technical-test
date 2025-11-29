import "dotenv/config";
import { app } from "./app";
import { AppDataSource } from "./config/ormconfig";

const PORT = process.env.PORT;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao fazer a conexão com obanco de dados", error);
    process.exit(1);
  }
}

bootstrap();
