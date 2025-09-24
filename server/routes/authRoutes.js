import express from "express";
import { exchangeCodeForTokens, getAuthURL } from "../services/google.js";
import jwt from "jsonwebtoken";
import { saveUser, saveRefreshTokenForUser } from "../services/dynamo.js";

const router = express.Router();

// Step 1: Send user to Google login page
router.get("/auth/google", (req, res) => {
  res.redirect(getAuthURL());
});

// Step 2: Handle Google callback
router.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "No auth code provided" });

  try {
    // Step 3: Exchange code for tokens + user profile
    const { tokens, profile } = await exchangeCodeForTokens(code);

    // Step 4: Save or update user in Users table
    await saveUser(profile);

    // Step 5: Save refresh token in Tokens table (if Google returned one)
    if (tokens.refresh_token) {
      await saveRefreshTokenForUser(profile.id, tokens.refresh_token);
    }

    // Step 6: Create our own JWT for app session
    const appJwt = jwt.sign(
      { userId: profile.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 7: Send back success response
    res.json({
      message: "Login successful",
      user: profile,
      jwt: appJwt,
    });

  } catch (err) {
    // Step 8: Handle errors
    console.error("Google OAuth Error:", err);
    res.status(500).json({ error: "Token exchange failed" });
  }
});

export default router;
