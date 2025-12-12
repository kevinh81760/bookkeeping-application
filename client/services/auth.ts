/**
 * Authentication Service
 * 
 * Handles guest/demo login for MVP without requiring Google OAuth
 */

import * as SecureStore from "expo-secure-store";

const TEST_USER_ID = "guest-demo-user";

/**
 * Login as guest user for MVP demo
 * Creates a simple base64 token that the server will accept
 */
export async function loginAsGuest(): Promise<void> {
  try {
    // Create a test token payload
    const payload = {
      userId: TEST_USER_ID,
      email: "demo@test.com",
      name: "Demo User",
      picture: null,
    };
    
    // For demo, create a simple base64 encoded token
    // Using btoa (available in React Native) instead of Buffer
    const testToken = btoa(JSON.stringify(payload));
    
    await SecureStore.setItemAsync("userToken", testToken);
    await SecureStore.setItemAsync("userId", TEST_USER_ID);
    
    console.log("✅ Guest login successful");
    console.log("👤 Demo User ID:", TEST_USER_ID);
  } catch (error) {
    console.error("❌ Error during guest login:", error);
    throw error;
  }
}

/**
 * Check if currently in guest/demo mode
 */
export async function isGuestMode(): Promise<boolean> {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    return userId === TEST_USER_ID;
  } catch (error) {
    console.error("Error checking guest mode:", error);
    return false;
  }
}

/**
 * Logout (clear tokens)
 */
export async function logout(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userId");
    console.log("🚪 Logged out");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
