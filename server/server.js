import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./01-routes/authRoutes.js";
import uploadRoutes from "./01-routes/uploadRoutes.js";
import foldersRoutes from "./01-routes/foldersRoutes.js";
import { authMiddleware } from "./04-middleware/authMiddleware.js";


const app = express();
const PORT = process.env.PORT || 4000;

// Step 1: Middleware
app.use(cors());                        // allow client (React Native) to call backend
app.use(express.json());                // parse JSON requests
app.use(express.urlencoded({ extended: true })); // parse form/urlencoded requests

// Step 2: Routes
app.use("/api", authRoutes);            // auth routes (Google OAuth)
app.use("/folders", authMiddleware, foldersRoutes);       // folders routes
app.use("/upload", uploadRoutes);       // file upload routes

// Step 3: Health check route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Step 4: Start server
app.listen(PORT, () => {
  console.log(`http://localhost:4000`);
});
