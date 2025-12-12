import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
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

  console.log("🔍 [Google] Raw profile data from Google:", JSON.stringify(profile, null, 2));
  console.log("📧 [Google] Email:", profile.email);
  console.log("👤 [Google] Name:", profile.name);
  console.log("🖼️ [Google] Picture:", profile.picture);
  console.log("🆔 [Google] ID:", profile.id);

  return { tokens, profile };
}

// Step 4: Refresh access token using refresh token
export async function refreshAccessToken(refreshToken) {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials.access_token;
}

// Step 5: Create and populate Google Sheet
export async function createGoogleSheet(refreshToken, sheetTitle, headers, rows) {
  try {
    // Set credentials with refresh token
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    // Initialize Sheets API
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    // Create a new spreadsheet
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: sheetTitle,
        },
        sheets: [
          {
            properties: {
              title: "Receipts",
              gridProperties: {
                frozenRowCount: 1, // Freeze header row
              },
            },
          },
        ],
      },
    });

    const spreadsheetId = createResponse.data.spreadsheetId;
    const spreadsheetUrl = createResponse.data.spreadsheetUrl;

    console.log("📊 [Google Sheets] Created spreadsheet:", spreadsheetUrl);

    // Prepare data: headers + rows
    const allData = [headers, ...rows];

    // Insert headers and all data rows
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Receipts!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: allData,
      },
    });

    // Format header row (bold)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                  },
                },
              },
              fields: "userEnteredFormat.textFormat.bold",
            },
          },
        ],
      },
    });

    console.log(`📊 [Google Sheets] Inserted ${rows.length} rows into spreadsheet`);

    return {
      spreadsheetId,
      spreadsheetUrl,
    };
  } catch (error) {
    console.error("❌ [Google Sheets] Error creating sheet:", error);
    throw new Error(`Failed to create Google Sheet: ${error.message}`);
  }
}
