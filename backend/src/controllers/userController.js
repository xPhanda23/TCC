import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        cardId: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    console.error("[getAllUsers]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        cardId: true,
        isActive: true,
        createdAt: true,
        permissions: {
          include: { room: true },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user);
  } catch (error) {
    console.error("[getUserById]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, role, cardId, isActive, password } = req.body;

  try {
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (role !== undefined) data.role = role;
    if (cardId !== undefined) data.cardId = cardId;
    if (isActive !== undefined) data.isActive = isActive;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        cardId: true,
        isActive: true,
      },
    });

    res.json({ message: "Usuário atualizado", user });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    console.error("[updateUser]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    console.error("[deleteUser]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}