import express from "express";
import { oauth2Client, getAuthURL } from "../services/google.js";

const router = express.Router();

// Step 1: Redirect user to Google login
router.get("/auth/google", (req, res) => {
  res.redirect(getAuthURL());
});

// Step 2: Handle Google callback and exchange code for tokens
router.get("/auth/google/callback", (req, res) => {
  const authCode = req.query.code;

  if (!authCode) {
    return res.status(400).json({ error: "No auth code provided" });
  }

  // Exchange code for tokens
  oauth2Client.getToken(authCode)
    .then(({ tokens }) => {
      oauth2Client.setCredentials(tokens);

      // Response to the client
      return res.json({
        message: "Google login successful!",
        googleTokens: tokens,
      });
    })
    .catch((err) => {
      console.error("Google OAuth Error:", err);
      return res.status(500).json({ error: "Token exchange failed" });
    });
});

export default router;
