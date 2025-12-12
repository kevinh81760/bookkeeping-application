import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { saveFolderLocally } from "@/services/storage";
import { BACKEND_URL } from "@/config/api";

interface Category {
  id: string;
  name: string;
  type: "Text" | "Number" | "Date";
  required: boolean;
}

export default function CreateFolderScreen() {
  const router = useRouter();
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Date", type: "Date", required: true },
    { id: "2", name: "Amount", type: "Number", required: true },
    { id: "3", name: "Vendor", type: "Text", required: false },
  ]);

  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: "",
      type: "Text",
      required: false,
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const updateCategory = (id: string, field: keyof Category, value: any) => {
    setCategories(
      categories.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat))
    );
  };

  const handleSave = async () => {
    // Validation
    if (!folderName.trim()) {
      Alert.alert("Required Field", "Please enter a folder name.");
      return;
    }

    const hasEmptyCategories = categories.some((cat) => !cat.name.trim());
    if (hasEmptyCategories) {
      Alert.alert("Invalid Categories", "Please fill in all category names or remove empty ones.");
      return;
    }

    try {
      const folderData = {
        folderName: folderName.trim(),
        description: description.trim(),
        categories: categories.map((cat) => ({
          name: cat.name.trim(),
          type: cat.type,
          required: cat.required,
        })),
        advanced: {
          ocrParseFrom: "",
          validationRules: "",
        },
      };

      console.log("💾 Saving folder:", folderData);

      // Save locally for offline support
      const localFolder = await saveFolderLocally(folderData);
      console.log("💾 Local folder created with ID:", localFolder.id);

      // Sync to backend with the SAME folderId
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          console.log("📤 Syncing folder to backend with ID:", localFolder.id);
          const response = await fetch(`${BACKEND_URL}/folders/create`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              folderId: localFolder.id,
              name: folderData.folderName,
              categories: folderData.categories,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log("✅ Folder synced to backend:", result);
          } else {
            const error = await response.json();
            console.warn("⚠️ Backend sync failed:", error);
          }
        } else {
          console.log("ℹ️ No auth token, folder saved locally only");
        }
      } catch (error) {
        console.warn("⚠️ Failed to sync folder to backend:", error);
        // Folder still exists locally, continue
      }

      Alert.alert(
        "Success! 🎉",
        `"${folderData.folderName}" created successfully.\n\nYou can now assign receipts to this folder from the camera screen.`,
        [
          {
            text: "View Folder",
            onPress: async () => {
              // Navigate back first, then the new folder should appear in the list
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error saving folder:", error);
      Alert.alert("Error", "Failed to create folder. Please try again.");
    }
  };


  return (
    <View className="flex-1 bg-[#F8F8F8]">
      {/* Header */}
      <View className={`bg-white ${Platform.OS === "ios" ? "pt-[60px]" : "pt-4"} px-6 pb-4 border-b border-gray-200`}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">New Folder</Text>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Folder Info Section */}
        <View className="bg-white mt-3 px-6 py-5">
          <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Folder Info
          </Text>

          {/* Folder Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Folder Name <Text className="text-[#E05C35]">*</Text>
            </Text>
            <TextInput
              className="bg-[#F8F8F8] border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholder="e.g., Office Supplies"
              placeholderTextColor="#9CA3AF"
              value={folderName}
              onChangeText={setFolderName}
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Description (optional)</Text>
            <TextInput
              className="bg-[#F8F8F8] border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholder="Brief description of this folder"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Categories Section */}
        <View className="bg-white mt-3 px-6 py-5">
          <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Categories
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            Define custom columns for organizing receipt data.
          </Text>

          {categories.map((category, index) => (
            <View
              key={category.id}
              className="bg-[#F8F8F8] rounded-xl p-4 mb-3 border border-gray-200"
            >
              {/* Column Name */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-gray-600 mb-2">Column Name</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                  placeholder="e.g., Price, Quantity"
                  placeholderTextColor="#9CA3AF"
                  value={category.name}
                  onChangeText={(text) => updateCategory(category.id, "name", text)}
                />
              </View>

              {/* Data Type & Required */}
              <View className="flex-row items-center justify-between mb-2">
                {/* Data Type Picker */}
                <View className="flex-1 mr-3">
                  <Text className="text-xs font-semibold text-gray-600 mb-2">Data Type</Text>
                  <View className="flex-row bg-white rounded-lg border border-gray-200">
                    {(["Text", "Number", "Date"] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        className={`flex-1 py-2 items-center ${
                          category.type === type ? "bg-[#259fc7]" : "bg-white"
                        } ${type === "Text" ? "rounded-l-lg" : type === "Date" ? "rounded-r-lg" : ""}`}
                        onPress={() => updateCategory(category.id, "type", type)}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            category.type === type ? "text-white" : "text-gray-600"
                          }`}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Required Toggle */}
                <View>
                  <Text className="text-xs font-semibold text-gray-600 mb-2">Required</Text>
                  <TouchableOpacity
                    className={`w-12 h-7 rounded-full justify-center ${
                      category.required ? "bg-[#259fc7]" : "bg-gray-300"
                    }`}
                    onPress={() => updateCategory(category.id, "required", !category.required)}
                  >
                    <View
                      className={`w-5 h-5 rounded-full bg-white ${
                        category.required ? "ml-[26px]" : "ml-[2px]"
                      }`}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                className="flex-row items-center justify-center mt-2 py-2"
                onPress={() => removeCategory(category.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text className="text-sm font-semibold text-red-500 ml-2">Remove Field</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Field Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-xl active:opacity-60"
            onPress={addCategory}
          >
            <Ionicons name="add-circle-outline" size={20} color="#259fc7" />
            <Text className="text-base font-semibold text-[#259fc7] ml-2">Add Field</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for sticky button */}
        <View className="h-28" />
      </ScrollView>

      {/* Sticky Footer Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 20, paddingTop: 16 }}
      >
        {/* Save & Continue */}
        <TouchableOpacity
          className="bg-[#259fc7] py-4 rounded-xl active:opacity-80"
          onPress={handleSave}
        >
          <Text className="text-base font-bold text-white text-center">Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

