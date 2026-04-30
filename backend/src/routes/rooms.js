import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

const router = Router();

router.use(authenticate);

router.get("/", getAllRooms);
router.get("/:id", getAllRooms);
router.post("/", requireRole("ADMIN"), createRoom);
router.put("/:id", requireRole("ADMIN"), updateRoom);
router.delete("/:id", requireRole("ADMIN"), deleteRoom);

export default router;