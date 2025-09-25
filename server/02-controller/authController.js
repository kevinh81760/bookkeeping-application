// 02-controller/authController.js
import { exchangeCodeForTokens, getAuthURL } from "../03-services/google.js";
import { saveUser, saveRefreshTokenForUser } from "../03-services/dynamo.js";
import jwt from "jsonwebtoken";

// Step 1: Redirect user to Google login page
export function googleAuth(req, res) {
  res.redirect(getAuthURL());
}

// Step 2: Handle Google callback after login
export async function googleCallback(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "No auth code provided" });

  try {
    // Step 3: Exchange code for tokens + profile
    const { tokens, profile } = await exchangeCodeForTokens(code);

    // Step 4: Save/update user in Dynamo
    await saveUser(profile);

    // Step 5: Save refresh token if Google provided one
    if (tokens.refresh_token) {
      await saveRefreshTokenForUser(profile.id, tokens.refresh_token);
    }

    // Step 6: Issue your own JWT
    const appJwt = jwt.sign(
      { userId: profile.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 7: Send success response
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
}
