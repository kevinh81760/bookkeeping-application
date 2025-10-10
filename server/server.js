import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./01-routes/authRoutes.js";
import uploadRoutes from "./01-routes/uploadRoutes.js";
import foldersRoutes from "./01-routes/foldersRoutes.js";
import { authMiddleware } from "./04-middleware/authMiddleware.js";
import { analyzeReceipt } from "./03-services/openai.js";
import { getSignedS3Url } from "./03-services/s3.js";

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











app.post("/testsignedurl", async (req, res) => {
  try {
    const { key } = req.body;
    const result = await getSignedS3Url(key);
    res.json({ signedUrl: result });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

app.post("/analyze", async (req, res) => {
  try {
    const { signedUrl, columnNames, categories } = req.body;

    if (!signedUrl) {
      return res.status(400).json({ error: "Missing signedUrl" });
    }

    const result = await analyzeReceipt(signedUrl, columnNames, categories);
    res.json(result);

  } catch (err) {
    // Print error details in console
    console.error("Error analyzing receipt:", err);

    // 🔹 Return the GPT response (if available) in Postman
    res.status(500).json({
      error: "GPT did not return valid JSON",
      rawResponse: err.rawResponse || err.message || null
    });
  }
});

