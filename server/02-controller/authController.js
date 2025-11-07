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

    console.log("🔍 [Auth] Profile data received:", JSON.stringify(profile, null, 2));

    // Step 4: Save or update the user in DynamoDB
    await saveUser(profile);

    // Step 5: Save refresh token if available
    if (tokens.refresh_token) {
      await saveRefreshTokenForUser(profile.id, tokens.refresh_token);
    }

    // Step 6: Issue your own JWT for the mobile app with user info
    const jwtPayload = { 
      userId: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture
    };
    
    console.log("🔐 [Auth] Creating JWT with payload:", JSON.stringify(jwtPayload, null, 2));
    
    if (!process.env.JWT_SECRET) {
      console.error("❌ [Auth] JWT_SECRET is not set in environment variables!");
      throw new Error("JWT_SECRET not configured");
    }
    
    const appJwt = jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ [Auth] JWT created successfully");
    console.log("🔑 [Auth] JWT (first 50 chars):", appJwt.substring(0, 50) + "...");

    // Step 7: Redirect back to Expo client via deep link
    // Make sure your app.json has "scheme": "client"
    const redirectURL = `client://auth?token=${appJwt}`;
    console.log("🔗 [Auth] Redirecting to:", redirectURL.substring(0, 100) + "...");
    return res.redirect(redirectURL);

  } catch (err) {
    console.error("❌ [Auth] Google OAuth Error:", err);
    console.error("❌ [Auth] Error stack:", err.stack);

    // Step 8: Optional error redirect back to client
    return res.redirect("client://auth?error=1");
  }
}
