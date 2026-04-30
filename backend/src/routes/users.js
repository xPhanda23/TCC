import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRole("ADMIN"), getAllUsers);
router.get("/:id", requireRole("ADMIN"), getUserById);
router.put("/:id", requireRole("ADMIN"), updateUser);
router.delete("/:id", requireRole("ADMIN"), deleteUser);

export default router;