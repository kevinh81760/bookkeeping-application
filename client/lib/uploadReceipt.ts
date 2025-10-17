/**
 * Receipt Upload Utility
 * 
 * Handles uploading receipt images to the backend server
 * which will:
 * 1. Upload to S3
 * 2. Process with OpenAI Vision
 * 3. Save to DynamoDB
 */

import * as SecureStore from "expo-secure-store";

const BACKEND_URL = "http://172.16.46.89:4000";

interface UploadReceiptParams {
  imageUri: string;
  folderId: string;
}

interface UploadReceiptResponse {
  success: boolean;
  message: string;
  savedReceipt: {
    receiptId: string;
    fileName: string;
    imageUri: string;
    receiptData: any[];
    createdAt: string;
  };
}

/**
 * Upload a receipt image to the server
 * 
 * @param imageUri - Local file URI of the captured/selected image
 * @param folderId - The folder ID to organize this receipt under
 * @returns Response from server with processed receipt data
 */
export async function uploadReceipt({
  imageUri,
  folderId,
}: UploadReceiptParams): Promise<UploadReceiptResponse> {
  try {
    // Get JWT token from secure storage
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      throw new Error("Not authenticated. Please login again.");
    }

    // Get user ID (assuming it's stored during login)
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }

    // Create FormData for multipart upload
    const formData = new FormData();

    // Extract filename from URI
    const filename = imageUri.split("/").pop() || "receipt.jpg";

    // Append image file
    formData.append("file", {
      uri: imageUri,
      name: filename,
      type: "image/jpeg", // Adjust based on actual file type
    } as any);

    // Append metadata
    formData.append("userId", userId);
    formData.append("folderId", folderId);

    console.log(`📤 Uploading receipt to ${BACKEND_URL}/upload/single`);

    // Send to backend
    const response = await fetch(`${BACKEND_URL}/upload/single`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Don't set Content-Type for FormData - let the browser set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Upload failed: ${response.status}`);
    }

    const data: UploadReceiptResponse = await response.json();
    console.log("✅ Receipt uploaded successfully:", data);

    return data;
  } catch (error) {
    console.error("❌ Upload error:", error);
    throw error;
  }
}

/**
 * Create a new folder on the server
 * 
 * @param name - Folder name
 * @param columns - Column names for receipt data
 * @param categories - Category options for receipts
 */
export async function createFolder({
  name,
  columns,
  categories,
}: {
  name: string;
  columns: string[];
  categories: string[];
}) {
  try {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      throw new Error("Not authenticated. Please login again.");
    }

    const response = await fetch(`${BACKEND_URL}/folders/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, columns, categories }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create folder");
    }

    const data = await response.json();
    console.log("✅ Folder created:", data);

    return data;
  } catch (error) {
    console.error("❌ Create folder error:", error);
    throw error;
  }
}

