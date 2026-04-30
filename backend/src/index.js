import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import roomRoutes from "./routes/rooms.js";
import permissionRoutes from "./routes/permissions.js";
import accessRoutes from "./routes/access.js";
import logRoutes from "./routes/logs.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/logs", logRoutes);

// Rota de saúde — útil para testar se o servidor está de pé
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});