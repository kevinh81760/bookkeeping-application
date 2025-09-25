import express from "express";
import { googleAuth, googleCallback } from "../02-controller/authController.js";

const router = express.Router();

router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallback);

export default router;
