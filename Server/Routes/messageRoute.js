import { createMessage, getMessage } from "../Controller/MessageController.js";
import express from "express";

const router = express.Router();

router.post('/', createMessage);
router.get('/:chatId', getMessage);

export default router;
