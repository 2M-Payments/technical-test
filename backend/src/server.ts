import http from "http";
import app from "./app";
import { AppDataSource } from "./config/datasource";

const PORT = Number(process.env.PORT) || 3001;

let server: http.Server;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Banco de dados conectado");

    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 API rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Falha ao iniciar aplicação:", error);
    process.exit(1);
  }
}

startServer();

const shutdown = async (signal: string) => {
  console.log(`\n🛑 Recebido ${signal}. Iniciando graceful shutdown...`);

  if (server) {
    server.close(err => {
      if (err) {
        console.error("❌ Erro ao fechar servidor HTTP:", err);
      } else {
        console.log("✅ Servidor HTTP fechado");
      }
    });
  }

  // fecha conexões do banco
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("✅ Conexão com banco encerrada");
    }
  } catch (err) {
    console.error("❌ Erro ao encerrar conexão com banco:", err);
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

setTimeout(() => {
  console.error("⏱️ Timeout forçado. Encerrando processo.");
  process.exit(1);
}, 10_000).unref();
