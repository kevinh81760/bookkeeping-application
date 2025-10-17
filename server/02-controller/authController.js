import { exchangeCodeForTokens, getAuthURL } from "../03-services/google.js";
import { saveUser, saveRefreshTokenForUser } from "../03-services/dynamo.js";
import jwt from "jsonwebtoken";

/**
 * Step 1: Redirect user to Google login page
 * Called from: GET /api/auth/google
 */
export function googleAuth(req, res) {
  // Generate the Google OAuth consent screen URL
  res.redirect(getAuthURL());
}

/**
 * Step 2: Handle Google callback after login
 * Called from: GET /api/auth/google/callback
 */
export async function googleCallback(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "No auth code provided" });
  }

  try {
    // Step 3: Exchange code for tokens + profile info
    const { tokens, profile } = await exchangeCodeForTokens(code);

    // Step 4: Save or update the user in DynamoDB
    await saveUser(profile);

    // Step 5: Save refresh token if available
    if (tokens.refresh_token) {
      await saveRefreshTokenForUser(profile.id, tokens.refresh_token);
    }

    // Step 6: Issue your own JWT for the mobile app
    const appJwt = jwt.sign(
      { userId: profile.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 7: Redirect back to Expo client via deep link
    // Make sure your app.json has "scheme": "client"
    const redirectURL = `client://auth?token=${appJwt}`;
    return res.redirect(redirectURL);

  } catch (err) {
    console.error("Google OAuth Error:", err);

    // Step 8: Optional error redirect back to client
    return res.redirect("client://auth?error=1");
  }
}
