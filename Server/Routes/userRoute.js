import express from "express";
import { fetchAllUsers, fetchUser, loginUser, registerUser } from "../Controller/UserController.js";

const router = express.Router();

router.post('/register',registerUser);
router.post('/login', loginUser);
router.get('/:username', fetchUser);
router.get('/', fetchAllUsers);

export default router;