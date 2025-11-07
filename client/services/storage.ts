/**
 * Local Storage for Testing
 * 
 * Store captured photos locally (without backend) so you can:
 * - Test the Files screen
 * - See your captured receipts
 * - Delete/manage them
 * 
 * This is temporary - replace with backend API later!
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@receipts";
const FOLDERS_KEY = "@folders";

export interface LocalReceipt {
  id: string;
  uri: string;
  timestamp: number;
  filename: string;
  folderId?: string; // Optional: which folder this receipt belongs to
}

export interface LocalFolder {
  id: string;
  name: string;
  description: string;
  categories: Array<{
    name: string;
    type: "Text" | "Number" | "Date";
    required: boolean;
  }>;
  advanced: {
    ocrParseFrom: string;
    validationRules: string;
  };
  timestamp: number;
}

/**
 * Save a captured photo locally
 */
export async function saveReceiptLocally(uri: string): Promise<LocalReceipt> {
  try {
    // Get existing receipts
    const receipts = await getLocalReceipts();

    // Create new receipt
    const newReceipt: LocalReceipt = {
      id: Date.now().toString(),
      uri,
      timestamp: Date.now(),
      filename: uri.split("/").pop() || "receipt.jpg",
    };

    // Add to list
    receipts.unshift(newReceipt); // Add to beginning

    // Save back
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));

    console.log("💾 Saved receipt locally:", newReceipt.id);
    return newReceipt;
  } catch (error) {
    console.error("❌ Error saving receipt locally:", error);
    throw error;
  }
}

/**
 * Get all locally saved receipts
 */
export async function getLocalReceipts(): Promise<LocalReceipt[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("❌ Error loading receipts:", error);
    return [];
  }
}

/**
 * Delete a local receipt
 */
export async function deleteLocalReceipt(id: string): Promise<void> {
  try {
    const receipts = await getLocalReceipts();
    const filtered = receipts.filter((r) => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log("🗑️ Deleted receipt:", id);
  } catch (error) {
    console.error("❌ Error deleting receipt:", error);
    throw error;
  }
}

/**
 * Clear all local receipts (for testing)
 */
export async function clearAllReceipts(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("🧹 Cleared all local receipts");
  } catch (error) {
    console.error("❌ Error clearing receipts:", error);
    throw error;
  }
}

// ============================================
// FOLDER MANAGEMENT
// ============================================

/**
 * Save a folder locally
 */
export async function saveFolderLocally(folderData: {
  folderName: string;
  description: string;
  categories: Array<{
    name: string;
    type: "Text" | "Number" | "Date";
    required: boolean;
  }>;
  advanced: {
    ocrParseFrom: string;
    validationRules: string;
  };
}): Promise<LocalFolder> {
  try {
    // Get existing folders
    const folders = await getLocalFolders();

    // Create new folder
    const newFolder: LocalFolder = {
      id: Date.now().toString(),
      name: folderData.folderName,
      description: folderData.description,
      categories: folderData.categories,
      advanced: folderData.advanced,
      timestamp: Date.now(),
    };

    // Add to list
    folders.unshift(newFolder); // Add to beginning

    // Save back
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));

    console.log("💾 Saved folder locally:", newFolder.id);
    return newFolder;
  } catch (error) {
    console.error("❌ Error saving folder locally:", error);
    throw error;
  }
}

/**
 * Get all locally saved folders
 */
export async function getLocalFolders(): Promise<LocalFolder[]> {
  try {
    const data = await AsyncStorage.getItem(FOLDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("❌ Error loading folders:", error);
    return [];
  }
}

/**
 * Delete a local folder
 */
export async function deleteLocalFolder(id: string): Promise<void> {
  try {
    const folders = await getLocalFolders();
    const filtered = folders.filter((f) => f.id !== id);
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(filtered));
    console.log("🗑️ Deleted folder:", id);
  } catch (error) {
    console.error("❌ Error deleting folder:", error);
    throw error;
  }
}

/**
 * Get a single folder by ID
 */
export async function getLocalFolder(id: string): Promise<LocalFolder | null> {
  try {
    const folders = await getLocalFolders();
    return folders.find((f) => f.id === id) || null;
  } catch (error) {
    console.error("❌ Error getting folder:", error);
    return null;
  }
}

