import { getFolder, getReceiptsByFolder, getRefreshTokenForUser } from "../03-services/dynamo.js";
import { createGoogleSheet } from "../03-services/google.js";

// Helper function to convert array of objects to CSV
function convertToCSV(headers, rows) {
  // Escape CSV fields (handle commas, quotes, newlines)
  const escapeCSVField = (field) => {
    if (field === null || field === undefined) {
      return '';
    }
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Create header row
  const headerRow = headers.map(escapeCSVField).join(',');
  
  // Create data rows
  const dataRows = rows.map(row => 
    row.map(escapeCSVField).join(',')
  ).join('\n');

  return `${headerRow}\n${dataRows}`;
}

export async function downloadCSV(req, res) {
  try {
    // Step 1: Extract folderId from request body
    const { folderId } = req.body;

    if (!folderId) {
      return res.status(400).json({ error: "folderId is required" });
    }

    // Step 2: Get userId from JWT middleware
    const userId = req.user?.userId || "test-user";

    console.log(`📥 [Download CSV] Starting download for folder ${folderId}, user ${userId}`);

    // Step 3: Fetch folder details (name, columns) from DynamoDB
    const folder = await getFolder(userId, folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const { name: folderName, columns } = folder;

    if (!columns || columns.length === 0) {
      return res.status(400).json({ error: "Folder has no columns defined" });
    }

    console.log(`📁 [Download CSV] Folder: ${folderName}, Columns:`, columns);

    // Step 4: Fetch all receipts for the folder from DynamoDB
    const receipts = await getReceiptsByFolder(userId, folderId);

    if (!receipts || receipts.length === 0) {
      return res.status(404).json({ 
        error: "No receipts found in this folder",
        message: "Upload some receipts first before downloading"
      });
    }

    console.log(`📋 [Download CSV] Found ${receipts.length} receipts`);

    // Step 5: Flatten receiptData arrays into rows
    const allRows = [];

    for (const receipt of receipts) {
      const { receiptData } = receipt;

      if (Array.isArray(receiptData)) {
        for (const item of receiptData) {
          const row = columns.map(columnName => {
            const value = item[columnName];
            if (value === null || value === undefined) {
              return "";
            }
            return String(value);
          });

          allRows.push(row);
        }
      }
    }

    if (allRows.length === 0) {
      return res.status(400).json({ 
        error: "No data to export",
        message: "Receipts contain no items"
      });
    }

    console.log(`📊 [Download CSV] Prepared ${allRows.length} rows for CSV`);

    // Step 6: Convert to CSV format
    const csvContent = convertToCSV(columns, allRows);

    // Step 7: Set headers for file download
    const fileName = `${folderName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_receipts_${Date.now()}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', Buffer.byteLength(csvContent));

    // Step 8: Send CSV file
    res.send(csvContent);

    console.log(`✅ [Download CSV] Successfully downloaded: ${fileName}`);
  } catch (err) {
    console.error("❌ [Download CSV] Download error:", err);
    res.status(500).json({
      error: "Failed to download CSV",
      details: err.message,
    });
  }
}

export async function exportToGoogleSheets(req, res) {
  try {
    // Step 1: Extract folderId from request body
    const { folderId } = req.body;

    if (!folderId) {
      return res.status(400).json({ error: "folderId is required" });
    }

    // Step 2: Get userId from JWT middleware
    const userId = req.user?.userId || "test-user";

    console.log(`📤 [Export] Starting export for folder ${folderId}, user ${userId}`);

    // Step 3: Fetch folder details (name, columns) from DynamoDB
    const folder = await getFolder(userId, folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const { name: folderName, columns } = folder;

    if (!columns || columns.length === 0) {
      return res.status(400).json({ error: "Folder has no columns defined" });
    }

    console.log(`📁 [Export] Folder: ${folderName}, Columns:`, columns);

    // Step 4: Fetch all receipts for the folder from DynamoDB
    const receipts = await getReceiptsByFolder(userId, folderId);

    if (!receipts || receipts.length === 0) {
      return res.status(404).json({ 
        error: "No receipts found in this folder",
        message: "Upload some receipts first before exporting to Google Sheets"
      });
    }

    console.log(`📋 [Export] Found ${receipts.length} receipts`);

    // Step 5: Get user's Google refresh token from DynamoDB
    const refreshToken = await getRefreshTokenForUser(userId);

    if (!refreshToken) {
      return res.status(401).json({ 
        error: "No Google account linked",
        message: "Please authenticate with Google first"
      });
    }

    // Step 6: Flatten receiptData arrays into rows
    // Each receipt has a receiptData array of items, we want all items as separate rows
    const allRows = [];

    for (const receipt of receipts) {
      const { receiptData, fileName, createdAt } = receipt;

      // receiptData is an array of objects like [{item: "Apple", price: 1.50, category: "fruit"}, ...]
      if (Array.isArray(receiptData)) {
        for (const item of receiptData) {
          // Create a row with values in the order of columns
          const row = columns.map(columnName => {
            // Get value from item, convert to string, handle null/undefined
            const value = item[columnName];
            if (value === null || value === undefined) {
              return "";
            }
            return String(value);
          });

          allRows.push(row);
        }
      }
    }

    if (allRows.length === 0) {
      return res.status(400).json({ 
        error: "No data to export",
        message: "Receipts contain no items"
      });
    }

    console.log(`📊 [Export] Prepared ${allRows.length} rows for export`);

    // Step 7: Call createGoogleSheet with folder name, columns, and flattened rows
    const sheetTitle = `${folderName} - Receipts Export`;
    const { spreadsheetId, spreadsheetUrl } = await createGoogleSheet(
      refreshToken,
      sheetTitle,
      columns,
      allRows
    );

    // Step 8: Return success with Google Sheet URL
    res.json({
      success: true,
      message: `Exported ${allRows.length} items from ${receipts.length} receipts to Google Sheets`,
      spreadsheetUrl,
      spreadsheetId,
      totalRows: allRows.length,
      totalReceipts: receipts.length,
      folderName,
    });

    console.log(`✅ [Export] Successfully exported to: ${spreadsheetUrl}`);
  } catch (err) {
    console.error("❌ [Export] Export error:", err);
    res.status(500).json({
      error: "Failed to export to Google Sheets",
      details: err.message,
    });
  }
}
