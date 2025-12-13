import http from "http";
import app from "./app";

const PORT = Number(process.env.PORT) || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`\n🛑 Recebido ${signal}. Iniciando graceful shutdown...`);

  server.close(err => {
    if (err) {
      console.error("❌ Erro ao fechar o servidor:", err);
      process.exit(1);
    }

    console.log("✅ Servidor HTTP fechado com sucesso");
    process.exit(0);
  });

  // Fallback de segurança (evita travar container)
  setTimeout(() => {
    console.error("⏱️ Timeout forçado. Encerrando processo.");
    process.exit(1);
  }, 10_000).unref();
};

// Docker / Kubernetes / Ctrl+C
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

