import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { getLogs, getLogsByRoom, getLogsByUser } from "../controllers/logController.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRole("ADMIN"), getLogs);
router.get("/room/:roomId", requireRole("ADMIN"), getLogsByRoom);
router.get("/user/:userId", requireRole("ADMIN"), getLogsByUser);

export default router;