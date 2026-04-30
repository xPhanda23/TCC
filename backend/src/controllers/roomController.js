import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getAllRooms(req, res) {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: "asc" },
    });
    res.json(rooms);
  } catch (error) {
    console.error("[getAllRooms]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function getRoomById(req, res) {
  const { id } = req.params;

  try {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { user: { select: { id: true, name: true, role: true } } },
        },
      },
    });

    if (!room) return res.status(404).json({ error: "Sala não encontrada" });

    res.json(room);
  } catch (error) {
    console.error("[getRoomById]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function createRoom(req, res) {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome da sala é obrigatório" });
  }

  try {
    const room = await prisma.room.create({
      data: { name, description },
    });

    res.status(201).json({ message: "Sala criada com sucesso", room });
  } catch (error) {
    console.error("[createRoom]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function updateRoom(req, res) {
  const { id } = req.params;
  const { name, description, isActive } = req.body;

  try {
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (isActive !== undefined) data.isActive = isActive;

    const room = await prisma.room.update({
      where: { id },
      data,
    });

    res.json({ message: "Sala atualizada", room });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Sala não encontrada" });
    }
    console.error("[updateRoom]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function deleteRoom(req, res) {
  const { id } = req.params;

  try {
    await prisma.room.delete({ where: { id } });
    res.json({ message: "Sala removida com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Sala não encontrada" });
    }
    console.error("[deleteRoom]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}