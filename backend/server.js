import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api", routes);
app.use("/", routes); // Compatibilidade com raiz direta

// Middleware centralizado de tratamento de erros
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`🍃 Conectado ao MongoDB Atlas (banco: gestao_gastos)`);
});
