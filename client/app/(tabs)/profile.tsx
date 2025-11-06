import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

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
          <View className="w-[100px] h-[100px] rounded-full bg-gray-800 justify-center items-center mb-4">
            <Ionicons name="person" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-2xl font-bold text-gray-50 mb-1">John Doe</Text>
          <Text className="text-base text-gray-400">john@example.com</Text>
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
