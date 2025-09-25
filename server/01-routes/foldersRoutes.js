// 01-routes/foldersRoutes.js
import express from "express";
import { createFolder } from "../02-controller/folderController.js";

const router = express.Router();

router.post("/", createFolder);

export default router;
