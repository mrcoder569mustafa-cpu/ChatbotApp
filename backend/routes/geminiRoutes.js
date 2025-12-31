import express from "express";
import { geminiChat } from "../controllers/geminiController.js";

const router = express.Router();

// POST request for chat
router.post("/chat", geminiChat);

export default router;
