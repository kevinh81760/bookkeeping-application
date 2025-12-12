/**
 * Export Service
 * 
 * Handles exporting folder data to Google Sheets
 */

import * as SecureStore from "expo-secure-store";
import { BACKEND_URL } from "../config/api";

export interface ExportResponse {
  success: boolean;
  message: string;
  spreadsheetUrl?: string;
  spreadsheetId?: string;
  totalRows?: number;
  totalReceipts?: number;
  folderName?: string;
}

export interface ExportError {
  error: string;
  message?: string;
  details?: string;
}

/**
 * Export folder to Google Sheets
 * 
 * @param folderId - The ID of the folder to export
 * @returns Promise with the export result including Google Sheets URL
 * @throws Error if export fails
 */
export async function exportFolderToSheets(folderId: string): Promise<ExportResponse> {
  try {
    // Get auth token
    const token = await SecureStore.getItemAsync("userToken");
    
    if (!token) {
      throw new Error("Not authenticated. Please log in first.");
    }

    console.log(`📤 Exporting folder ${folderId} to Google Sheets...`);

    // Call backend export endpoint
    const response = await fetch(`${BACKEND_URL}/sheets/export`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderId }),
    });

    // Parse response
    const data = await response.json();

    // Handle errors
    if (!response.ok) {
      const errorData = data as ExportError;
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error(errorData.message || "Please authenticate with Google first");
      } else if (response.status === 404) {
        throw new Error(errorData.message || "Folder not found or has no receipts");
      } else {
        throw new Error(errorData.message || errorData.error || "Failed to export to Google Sheets");
      }
    }

    console.log("✅ Export successful:", data.spreadsheetUrl);
    
    return data as ExportResponse;
  } catch (error) {
    console.error("❌ Export error:", error);
    
    // Re-throw with user-friendly message
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Failed to export. Please check your connection and try again.");
  }
}

/**
 * Download folder as CSV file
 * 
 * @param folderId - The ID of the folder to download
 * @returns CSV content as string
 */
export async function downloadFolderAsCSV(folderId: string): Promise<string> {
  try {
    const token = await SecureStore.getItemAsync("userToken");
    
    if (!token) {
      throw new Error("Not authenticated. Please log in first.");
    }

    console.log(`📥 Downloading CSV for folder ${folderId}...`);

    const response = await fetch(`${BACKEND_URL}/sheets/download-csv`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || "Failed to download CSV");
    }

    const csvContent = await response.text();
    console.log("✅ CSV downloaded successfully");
    
    return csvContent;
  } catch (error) {
    console.error("❌ CSV download error:", error);
    throw error;
  }
}
