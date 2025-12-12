/**
 * API Configuration
 * 
 * Centralized backend URL configuration
 * 
 * To find your backend URL:
 * 1. Local (same machine): http://localhost:4000
 * 2. Physical device (same network): http://YOUR_COMPUTER_IP:4000
 *    - Find your IP with: ipconfig getifaddr en0 (Mac) or ifconfig (Linux)
 * 3. Production: https://your-deployed-api.com
 */

// Change this based on your environment
// For physical device testing, use your computer's IP address
const BACKEND_URL = __DEV__
  ? "http://192.168.0.127:4000" // Physical device on same WiFi network
  : "https://your-production-api.com"; // Production

// For simulator/emulator testing on same machine, use:
// const BACKEND_URL = "http://localhost:4000";

export { BACKEND_URL };

/**
 * Example usage in service files:
 * 
 * import { BACKEND_URL } from '../config/api';
 * 
 * const response = await fetch(`${BACKEND_URL}/folders`, {
 *   method: 'GET',
 *   headers: {
 *     Authorization: `Bearer ${token}`,
 *   },
 * });
 */

// 