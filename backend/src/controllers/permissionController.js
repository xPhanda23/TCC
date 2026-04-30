import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getPermissionsByUser(req, res) {
  const { userId } = req.params;

  try {
    const permissions = await prisma.permission.findMany({
      where: { userId },
      include: { room: true },
    });

    res.json(permissions);
  } catch (error) {
    console.error("[getPermissionsByUser]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function getPermissionsByRoom(req, res) {
  const { roomId } = req.params;

  try {
    const permissions = await prisma.permission.findMany({
      where: { roomId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    res.json(permissions);
  } catch (error) {
    console.error("[getPermissionsByRoom]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function createPermission(req, res) {
  const { userId, roomId, startTime, endTime, weekDays, expiresAt } = req.body;

  if (!userId || !roomId || !startTime || !endTime || !weekDays) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const permission = await prisma.permission.create({
      data: {
        userId,
        roomId,
        startTime,
        endTime,
        weekDays,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        user: { select: { id: true, name: true } },
        room: true,
      },
    });

    res.status(201).json({ message: "Permissão criada", permission });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Permissão já existe para este usuário nesta sala" });
    }
    console.error("[createPermission]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function deletePermission(req, res) {
  const { id } = req.params;

  try {
    await prisma.permission.delete({ where: { id } });
    res.json({ message: "Permissão removida com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Permissão não encontrada" });
    }
    console.error("[deletePermission]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}