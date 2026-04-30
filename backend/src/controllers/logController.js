import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const defaultInclude = {
  user: { select: { id: true, name: true, email: true, role: true } },
  room: { select: { id: true, name: true } },
};

export async function getLogs(req, res) {
  try {
    const logs = await prisma.accessLog.findMany({
      include: defaultInclude,
      orderBy: { accessedAt: "desc" },
      take: 200, // limite para não sobrecarregar
    });

    res.json(logs);
  } catch (error) {
    console.error("[getLogs]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function getLogsByRoom(req, res) {
  const { roomId } = req.params;

  try {
    const logs = await prisma.accessLog.findMany({
      where: { roomId },
      include: defaultInclude,
      orderBy: { accessedAt: "desc" },
    });

    res.json(logs);
  } catch (error) {
    console.error("[getLogsByRoom]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function getLogsByUser(req, res) {
  const { userId } = req.params;

  try {
    const logs = await prisma.accessLog.findMany({
      where: { userId },
      include: defaultInclude,
      orderBy: { accessedAt: "desc" },
    });

    res.json(logs);
  } catch (error) {
    console.error("[getLogsByUser]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}