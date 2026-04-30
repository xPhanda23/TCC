import { PrismaClient } from "../generated/prisma/index.js";
import { checkAccessRules } from "../services/accessService.js";

const prisma = new PrismaClient();

export async function checkAccess(req, res) {
  const { cardId, roomId } = req.body;

  if (!cardId || !roomId) {
    return res.status(400).json({ error: "cardId e roomId são obrigatórios" });
  }

  try {
    const { granted, reason, user } = await checkAccessRules(cardId, roomId);

    // Sempre registra o log — seja negado ou permitido
    await prisma.accessLog.create({
      data: {
        cardId,
        roomId,
        userId: user?.id ?? null,
        result: granted ? "GRANTED" : "DENIED",
        reason: reason ?? null,
      },
    });

    return res.json({ granted, reason: reason ?? null });
  } catch (error) {
    console.error("[checkAccess]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function openRemote(req, res) {
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ error: "roomId é obrigatório" });
  }

  try {
    const room = await prisma.room.findUnique({ where: { id: roomId } });

    if (!room) return res.status(404).json({ error: "Sala não encontrada" });

    // Registra abertura remota no log
    await prisma.accessLog.create({
      data: {
        cardId: "REMOTE",
        roomId,
        userId: req.user.id,
        result: "GRANTED",
        reason: `Abertura remota por admin`,
      },
    });

    // Aqui futuramente você envia sinal para o ESP32
    // Por agora retorna sucesso para o frontend/simulador
    res.json({ granted: true, message: "Porta aberta remotamente" });
  } catch (error) {
    console.error("[openRemote]", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}