import { Router } from "express";
import { checkAccess, openRemote } from "../controllers/accessController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const router = Router();

// Rota pública — chamada pelo hardware (ESP32/Arduino)
router.post("/check", checkAccess);

// Rota protegida — abertura remota pelo admin via frontend
router.post("/open", authenticate, requireRole("ADMIN"), openRemote);

export default router;