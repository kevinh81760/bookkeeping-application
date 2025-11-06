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

export interface LocalReceipt {
  id: string;
  uri: string;
  timestamp: number;
  filename: string;
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

