import { createChat, getUserChats, findChat } from "../Controller/ChatController.js";
import express from "express";

const router = express.Router();

router.post('/' ,createChat);
router.get('/:userId' ,getUserChats);
router.get('/find/:first/:second' , findChat );

export default router;
