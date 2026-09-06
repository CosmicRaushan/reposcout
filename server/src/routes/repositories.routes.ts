import { Router } from "express";
import { requireAuth } from "../middleware/require-auth.middleware";
import { createRepositoryController, getRepositoriesController, getRepositoryController, removeRepositoryController } from "../controllers/repository.controllers";
import { getRepositoryStatusController } from "../controllers/repository.controllers";


const router = Router();

router.use(requireAuth);

router.post("/", createRepositoryController);
router.get("/", getRepositoriesController);
router.get("/:id/status", getRepositoryStatusController);
router.get("/:id", getRepositoryController);
router.delete("/:id", removeRepositoryController);

export default router;