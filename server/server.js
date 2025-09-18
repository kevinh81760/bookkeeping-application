import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

app.use(cors());              // allow client (React Native) to call backend
app.use(express.json());      // parse JSON requests
app.use(express.urlencoded({ extended: true })); // parse URL-encoded requests


// example test route
app.get("/", (req, res) => {
  res.send("Server is running bitch ass nigga");
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
