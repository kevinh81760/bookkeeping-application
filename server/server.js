import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import multer from "multer";
import authRoutes from "./routes/auth.js";
import { testOpenAI } from "./services/openai.js";
import tokensRoutes from "./routes/tokens.js";

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());              // allow client (React Native) to call backend
app.use(express.json());      // parse JSON requests
app.use(express.urlencoded({ extended: true })); // parse URL-encoded requests

// mounting routes
app.use("/api", authRoutes);
app.use("/tokens", tokensRoutes);








// example test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/test", async (req, res) => {
  const response = await testOpenAI();
  res.json({ response });
});

// example test route with form-data upload support
const upload = multer();
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);  // uploaded file data
  res.json({ message: "File received!" });
});


app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
