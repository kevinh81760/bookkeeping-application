import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

interface UserData {
  name: string;
  email: string;
  picture?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT token to get user info
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        console.log("🔑 Token exists:", !!token);
        
        if (token) {
          console.log("🔍 Full token (first 50 chars):", token.substring(0, 50) + "...");
          console.log("🔍 Token parts count:", token.split('.').length);
          
          // Decode JWT (it's base64 encoded in 3 parts: header.payload.signature)
          const parts = token.split('.');
          
          if (parts.length !== 3) {
            console.error("❌ Invalid JWT format - expected 3 parts, got", parts.length);
            Alert.alert("Token Error", "Invalid token format. Please log in again.");
            return;
          }
          
          const payload = parts[1];
          console.log("🔍 Raw payload (base64):", payload);
          
          // Decode base64 payload
          const decoded = JSON.parse(atob(payload));
          
          console.log("👤 Decoded user data:", JSON.stringify(decoded, null, 2));
          console.log("📧 Email:", decoded.email);
          console.log("👤 Name:", decoded.name);
          console.log("🖼️ Picture:", decoded.picture);
          console.log("🆔 User ID:", decoded.userId);
          
          // Check if we have the new token format with name/email
          if (!decoded.name || !decoded.email) {
            console.warn("⚠️ Old token format detected - please log out and log back in to see your profile info");
            Alert.alert(
              "Token Update Required",
              "Your session needs to be refreshed. Please log out and log back in to see your profile info.",
              [
                { text: "OK" }
              ]
            );
          }
          
          setUserData({
            name: decoded.name || "User",
            email: decoded.email || "",
            picture: decoded.picture
          });
        } else {
          console.warn("⚠️ No token found in SecureStore");
          Alert.alert("No Session", "Please log in to view your profile.");
        }
      } catch (error) {
        console.error("❌ Error loading user data:", error);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            // Clear stored token
            await SecureStore.deleteItemAsync("userToken");
            console.log("🚪 User logged out");

            // Navigate back to onboarding
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <View className="pt-[60px] px-6 pb-6">
        <Text className="text-[32px] font-bold text-gray-50">Profile</Text>
      </View>

      <View className="flex-1 px-6">
        {/* Profile Picture */}
        <View className="items-center py-8 border-b border-gray-700">
          {userData?.picture ? (
            <Image 
              source={{ uri: userData.picture }}
              className="w-[100px] h-[100px] rounded-full mb-4"
            />
          ) : (
            <View className="w-[100px] h-[100px] rounded-full bg-gray-800 justify-center items-center mb-4">
              <Ionicons name="person" size={48} color="#9CA3AF" />
            </View>
          )}
          <Text className="text-2xl font-bold text-gray-50 mb-1">
            {loading ? "Loading..." : userData?.name || "User"}
          </Text>
          <Text className="text-base text-gray-400">
            {loading ? "" : userData?.email || ""}
          </Text>
        </View>

        {/* Settings */}
        <View className="mt-8">
          <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Settings</Text>

          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-700">
            <Ionicons name="notifications-outline" size={24} color="#F9FAFB" />
            <Text className="flex-1 text-base text-gray-50 ml-4">Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-700">
            <Ionicons name="folder-outline" size={24} color="#F9FAFB" />
            <Text className="flex-1 text-base text-gray-50 ml-4">Manage Folders</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-700">
            <Ionicons name="cloud-outline" size={24} color="#F9FAFB" />
            <Text className="flex-1 text-base text-gray-50 ml-4">Storage</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-700">
            <Ionicons name="card-outline" size={24} color="#F9FAFB" />
            <Text className="flex-1 text-base text-gray-50 ml-4">Subscription</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity className="flex-row items-center justify-center mt-8 py-4 rounded-xl bg-gray-800" onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text className="text-base font-semibold text-red-500 ml-3">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
