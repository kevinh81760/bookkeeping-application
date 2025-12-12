import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { CameraView, CameraType, FlashMode, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { saveReceiptLocally, getLocalFolders, type LocalFolder } from "@/services/storage";
import { uploadReceipt } from "@/services/upload";

export default function CameraScreen() {
  // Camera state
  const [facing, setCameraType] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Folder selection state
  const [folders, setFolders] = useState<LocalFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<LocalFolder | null>(null);
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  // Check if screen is focused
  const isFocused = useIsFocused();

  // Request camera permissions on mount
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // Reload folders when screen is focused
  useEffect(() => {
    if (isFocused) {
      loadFolders();
      debugStorage(); // TEMPORARY: Remove after debugging
    }
  }, [isFocused]);

  // Load available folders
  const loadFolders = async () => {
    try {
      console.log("🔄 [Camera] Loading folders...");
      const folderList = await getLocalFolders();
      console.log("📁 [Camera] Folders loaded:", folderList.length);
      console.log("📁 [Camera] Folder details:", JSON.stringify(folderList, null, 2));
      setFolders(folderList);
    } catch (error) {
      console.error("❌ [Camera] Error loading folders:", error);
    }
  };

  // TEMPORARY: Debug function to check AsyncStorage directly
  const debugStorage = async () => {
    try {
      console.log("🐛 [Debug] Checking AsyncStorage directly...");
      const allKeys = await AsyncStorage.getAllKeys();
      console.log("🐛 [Debug] All AsyncStorage keys:", allKeys);
      
      const foldersData = await AsyncStorage.getItem("@folders");
      console.log("🐛 [Debug] @folders data:", foldersData);
      
      if (foldersData) {
        const parsed = JSON.parse(foldersData);
        console.log("🐛 [Debug] Parsed folders:", parsed);
      }
    } catch (error) {
      console.error("🐛 [Debug] Error:", error);
    }
  };

  // Handle permission states
  if (!permission) {
    return (
      <View className="flex-1 bg-gray-900">
        <Text className="text-base text-gray-400 text-center">Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-gray-900">
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
          <Text className="text-2xl font-bold text-gray-50 mt-6 mb-3">Camera Access Required</Text>
          <Text className="text-base text-gray-400 text-center leading-6 mb-8">
            We need access to your camera to scan receipts
          </Text>
          <TouchableOpacity
            className="bg-[#259fc7] py-4 px-8 rounded-xl"
            onPress={requestPermission}
          >
            <Text className="text-base font-semibold text-gray-50">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Toggle flash mode
  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  // Capture photo
  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      console.log("📸 Capturing photo...");

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (photo) {
        console.log("✅ Photo captured:", photo.uri);

        // Request media library permission
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status === "granted") {
          // Save to device photo library
          await MediaLibrary.createAssetAsync(photo.uri);
        }

        // Save locally for offline support
        await saveReceiptLocally(photo.uri, selectedFolder?.id);

        // Upload to server for AI processing (only if logged in)
        const token = await SecureStore.getItemAsync("userToken");
        if (selectedFolder?.id && token) {
          try {
            console.log("📤 Uploading receipt to server for AI processing...");
            const result = await uploadReceipt({
              imageUri: photo.uri,
              folderId: selectedFolder.id,
            });
            console.log("✅ Receipt uploaded and processed:", result);
            
            const folderInfo = selectedFolder ? `to "${selectedFolder.name}"` : "as uncategorized";
            Alert.alert(
              "Success! 📸",
              `Receipt saved ${folderInfo} and processed with AI!\n\n• Go to Files tab to see it`,
              [{ text: "OK" }]
            );
          } catch (error) {
            console.error("❌ Upload failed:", error);
            // Still saved locally, show partial success
            const folderInfo = selectedFolder ? `to "${selectedFolder.name}"` : "as uncategorized";
            Alert.alert(
              "Saved Locally 📸",
              `Receipt saved ${folderInfo} on device.\n\nCloud sync failed - will retry later.`,
              [{ text: "OK" }]
            );
          }
        } else {
          // No token or no folder - just show local save success
          const folderInfo = selectedFolder ? `to "${selectedFolder.name}"` : "as uncategorized";
          const loginHint = !token && selectedFolder?.id ? "\n• Log in for AI extraction" : "";
          Alert.alert(
            "Success! 📸",
            `Receipt saved ${folderInfo}!\n\n• Go to Files tab to see it${loginHint}`,
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error("❌ Error capturing photo:", error);
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  // Open gallery to select multiple images
  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: true, // ✅ Enable multiple selection
        allowsEditing: false, // ❌ Disable editing when selecting multiple
        quality: 0.8,
        selectionLimit: 10, // Optional: limit number of selections (0 = unlimited)
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedCount = result.assets.length;
        console.log(`📁 ${selectedCount} image(s) selected from gallery`);

        let uploadedCount = 0;
        let failedCount = 0;

        // Check if logged in for AI processing
        const token = await SecureStore.getItemAsync("userToken");

        // Save all selected images locally and upload to server if logged in
        for (const asset of result.assets) {
          console.log("💾 Saving:", asset.uri);
          await saveReceiptLocally(asset.uri, selectedFolder?.id);

          // Upload to server if folder is selected AND user is logged in
          if (selectedFolder?.id && token) {
            try {
              console.log("📤 Uploading to server:", asset.uri);
              await uploadReceipt({
                imageUri: asset.uri,
                folderId: selectedFolder.id,
              });
              uploadedCount++;
            } catch (error) {
              console.error("❌ Upload failed for:", asset.uri, error);
              failedCount++;
            }
          }
        }

        const folderInfo = selectedFolder ? `to "${selectedFolder.name}"` : "as uncategorized";
        let uploadInfo = '';
        if (selectedFolder?.id && token) {
          uploadInfo = `\n\n• Uploaded: ${uploadedCount}\n• Failed: ${failedCount}\n• Saved locally: ${selectedCount}`;
        } else if (selectedFolder?.id && !token) {
          uploadInfo = '\n\n• Saved locally\n• Log in for AI extraction';
        } else {
          uploadInfo = '\n\n• Go to Files tab to see them';
        }
          
        Alert.alert(
          "Success! 📁",
          `${selectedCount} photo${selectedCount > 1 ? 's' : ''} saved ${folderInfo}!${uploadInfo}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("❌ Error opening gallery:", error);
      Alert.alert("Error", "Failed to open gallery.");
    }
  };

  // Open document picker (for PDFs, etc.)
  const openDocumentPicker = async () => {
    Alert.alert(
      "Document Upload",
      "Document picker coming soon! For now, use gallery or camera.",
      [{ text: "OK" }]
    );
    // TODO: Implement with expo-document-picker
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Camera Preview */}
      <View className="flex-1">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1, width: '100%', height: '100%' }}
          facing={facing}
          flash={flash}
          mode="picture"
        >
          {/* Top Bar - Folder Selection & Flash */}
          <View className={`flex-row justify-between items-center ${Platform.OS === "ios" ? "pt-[50px]" : "pt-4"} px-5`}>
            {/* Folder Selection Button */}
            <TouchableOpacity
              className="flex-1 mr-2 bg-gray-800/80 rounded-full px-4 py-3 flex-row items-center justify-center"
              onPress={() => setShowFolderPicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="folder" size={18} color="#259fc7" />
              <Text className="text-sm font-semibold text-gray-50 ml-2" numberOfLines={1}>
                {selectedFolder ? selectedFolder.name : "Uncategorized"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {/* Flash Toggle */}
            <TouchableOpacity
              className="w-12 h-12 rounded-full bg-gray-800/80 justify-center items-center"
              onPress={toggleFlash}
              activeOpacity={0.7}
            >
              <Ionicons
                name={flash === "on" ? "flash" : "flash-off"}
                size={24}
                color={flash === "on" ? "#259fc7" : "#F9FAFB"}
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* Bottom Controls - Outside camera to avoid being cut off */}
      <View className="absolute bottom-0 left-0 right-0 items-center" style={{ paddingBottom: Platform.OS === "ios" ? 40 : 30 }}>
        {/* Label */}
        <Text className="text-sm font-bold text-gray-50 tracking-[2px] mb-6" style={{ textShadowColor: "rgba(0, 0, 0, 0.8)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
          SNAP A RECEIPT
        </Text>

        {/* Control Row */}
        <View className="flex-row items-center justify-between w-full px-10">
          {/* Gallery Button (Left) */}
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-gray-800/80 justify-center items-center"
            onPress={openGallery}
            activeOpacity={0.7}
          >
            <Ionicons name="images" size={28} color="#F9FAFB" />
          </TouchableOpacity>

          {/* Capture Button (Center) */}
          <TouchableOpacity
            className="w-20 h-20 rounded-full bg-gray-800/80 justify-center items-center border-4 border-gray-50"
            onPress={capturePhoto}
            activeOpacity={0.8}
          >
            <View className="w-16 h-16 rounded-full bg-gray-50" />
          </TouchableOpacity>

          {/* Document Upload Button (Right) */}
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-gray-800/80 justify-center items-center"
            onPress={openDocumentPicker}
            activeOpacity={0.7}
          >
            <Ionicons name="document" size={28} color="#F9FAFB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Folder Picker Modal */}
      <Modal
        visible={showFolderPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFolderPicker(false)}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity 
            className="flex-1" 
            activeOpacity={1}
            onPress={() => setShowFolderPicker(false)}
          />
          
          <View className="bg-white rounded-t-3xl" style={{ 
            maxHeight: '70%', 
            minHeight: 400,
            paddingBottom: Platform.OS === "ios" ? 34 : 20 
          }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">Select Folder</Text>
              <TouchableOpacity onPress={() => setShowFolderPicker(false)}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Folder List */}
            <ScrollView 
              className="flex-1" 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              style={{ maxHeight: 500 }}
            >
              {/* Uncategorized Option */}
              <TouchableOpacity
                className={`flex-row items-center px-6 py-4 border-b border-gray-100 ${
                  !selectedFolder ? "bg-[#259fc7]/5" : "bg-white"
                }`}
                onPress={() => {
                  setSelectedFolder(null);
                  setShowFolderPicker(false);
                }}
              >
                <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center">
                  <Ionicons name="file-tray-outline" size={24} color="#6B7280" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-base font-semibold text-gray-900">
                    Uncategorized
                  </Text>
                  <Text className="text-sm text-gray-500 mt-0.5">
                    Save without assigning to a folder
                  </Text>
                </View>
                {!selectedFolder && (
                  <Ionicons name="checkmark-circle" size={24} color="#259fc7" />
                )}
              </TouchableOpacity>

              {/* Existing Folders */}
              {folders.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  className={`flex-row items-center px-6 py-4 border-b border-gray-100 ${
                    selectedFolder?.id === folder.id ? "bg-[#259fc7]/5" : "bg-white"
                  }`}
                  onPress={() => {
                    setSelectedFolder(folder);
                    setShowFolderPicker(false);
                  }}
                >
                  <View className="w-12 h-12 rounded-xl bg-[#259fc7]/10 items-center justify-center">
                    <Ionicons name="folder" size={24} color="#259fc7" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-base font-semibold text-gray-900">
                      {folder.name}
                    </Text>
                    {folder.description ? (
                      <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                        {folder.description}
                      </Text>
                    ) : null}
                  </View>
                  {selectedFolder?.id === folder.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#259fc7" />
                  )}
                </TouchableOpacity>
              ))}

              {/* Empty State */}
              {folders.length === 0 && (
                <View className="items-center justify-center py-12 px-6">
                  <Ionicons name="folder-open-outline" size={48} color="#D1D5DB" />
                  <Text className="text-base text-gray-500 mt-4 text-center">
                    No folders yet. Create one in the Files tab.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
