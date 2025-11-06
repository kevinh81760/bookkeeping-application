import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { CameraView, CameraType, FlashMode, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { saveReceiptLocally } from "@/services/storage";

export default function CameraScreen() {
  // Camera state
  const [facing, setCameraType] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Request camera permissions on mount
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

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

        // 🧪 TESTING: Save locally so you can see it in Files tab
        await saveReceiptLocally(photo.uri);

        Alert.alert(
          "Success! 📸",
          "Receipt saved!\n\n• Go to Files tab to see it\n• View full testing without backend",
          [{ text: "OK" }]
        );

        // TODO: Upload to server when backend is ready
        // await uploadReceipt({ imageUri: photo.uri, folderId: "xxx" });
      }
    } catch (error) {
      console.error("❌ Error capturing photo:", error);
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  // Open gallery to select existing image
  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log("📁 Image selected from gallery:", result.assets[0].uri);
        Alert.alert(
          "Image Selected",
          "Add upload logic here to process this image.",
          [{ text: "OK" }]
        );
        // TODO: Upload to server
        // await uploadReceiptToServer(result.assets[0].uri);
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
          {/* Top Bar - Flash Toggle */}
          <View className={`flex-row justify-between items-center ${Platform.OS === "ios" ? "pt-[50px]" : "pt-4"} px-5`}>
            <View className="w-12" />
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
    </View>
  );
}
