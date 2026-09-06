import { Router } from "express";
import { requireAuth } from "../middleware/require-auth.middleware";
import {
    createChatQuestionController,
    getChatHistoryController,
    getChatQuestionController,
} from "../controllers/chat.controllers";


const router = Router();

router.use(requireAuth);

router.post("/", createChatQuestionController);
router.get("/", getChatHistoryController);
router.get("/:id", getChatQuestionController);


export default router;