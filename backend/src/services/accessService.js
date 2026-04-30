import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function checkAccessRules(cardId, roomId) {
  // 1. Encontra usuário pelo cartão RFID
  const user = await prisma.user.findUnique({ where: { cardId } });

  if (!user) {
    return { granted: false, reason: "Cartão não reconhecido", user: null };
  }

  if (!user.isActive) {
    return { granted: false, reason: "Usuário desativado", user };
  }

  // 2. Verifica se a sala existe
  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) {
    return { granted: false, reason: "Sala não encontrada", user };
  }

  if (!room.isActive) {
    return { granted: false, reason: "Sala desativada", user };
  }

  // 3. Admin sempre tem acesso
  if (user.role === "ADMIN") {
    return { granted: true, reason: null, user };
  }

  // 4. Busca permissão específica para usuário + sala
  const permission = await prisma.permission.findUnique({
    where: { userId_roomId: { userId: user.id, roomId } },
  });

  if (!permission) {
    return { granted: false, reason: "Sem permissão para esta sala", user };
  }

  // 5. Verifica expiração
  if (permission.expiresAt && permission.expiresAt < new Date()) {
    return { granted: false, reason: "Permissão expirada", user };
  }

  // 6. Verifica dia da semana (0=dom, 1=seg, ..., 6=sab)
  const today = new Date().getDay();
  const allowedDays = permission.weekDays.split(",").map(Number);

  if (!allowedDays.includes(today)) {
    return { granted: false, reason: "Acesso não permitido neste dia", user };
  }

  // 7. Verifica horário
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = permission.startTime.split(":").map(Number);
  const [endH, endM] = permission.endTime.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
    return { granted: false, reason: "Fora do horário permitido", user };
  }

  return { granted: true, reason: null, user };
}