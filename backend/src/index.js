import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient({
  datasourceUrl: "mysql://root:@localhost:3306/controleacesso"
});

app.use(express.json());

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // verifica se já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // salva no banco
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Usuário criado", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

app.listen(3000, () => {
  console.log("Server rodando em http://localhost:3000");
});