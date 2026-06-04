import { Router } from "express";
import { chatController } from "../controllers/chatController.js";

const router = Router();

// Endpoint for streaming AI assistant chat (Server Sent Events)
router.post("/chat", chatController.streamChat);

export default router;
