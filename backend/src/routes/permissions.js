import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  getPermissionsByUser,
  getPermissionsByRoom,
  createPermission,
  deletePermission,
} from "../controllers/permissionController.js";

const router = Router();

router.use(authenticate);

router.get("/user/:userId", requireRole("ADMIN"), getPermissionsByUser);
router.get("/room/:roomId", requireRole("ADMIN"), getPermissionsByRoom);
router.post("/", requireRole("ADMIN"), createPermission);
router.delete("/:id", requireRole("ADMIN"), deletePermission);

export default router;