import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

// Step 1: Create OAuth client
export const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Step 2: Generate Google login URL
export function getAuthURL() {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/spreadsheets", // optional: add/remove scopes
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline", // ensures we get refresh_token
    prompt: "consent",      // forces Google to show consent screen
    scope: scopes,
  });
}

// Step 3: Exchange code for tokens + fetch Google profile
export async function exchangeCodeForTokens(code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await res.json();

  return { tokens, profile };
}
