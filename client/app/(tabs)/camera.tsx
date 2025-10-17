import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { CameraView, CameraType, FlashMode, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { saveReceiptLocally } from "@/lib/localStorage";

// Design constants
const COLORS = {
  background: "#111827", // Dark background (gray-900)
  surface: "#1F2937", // Surface (gray-800)
  accent: "#259fc7", // Your brand blue
  text: "#F9FAFB", // White text
  textSecondary: "#9CA3AF", // Gray text
  border: "#374151", // Border gray
};

const SIZES = {
  captureButton: 80,
  smallIcon: 48,
  iconSize: 28,
  borderRadius: 20,
};

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
      <View style={styles.container}>
        <Text style={styles.message}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need access to your camera to scan receipts
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
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
    <View style={styles.container}>
      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
        >
          {/* Top Bar - Flash Toggle */}
          <View style={styles.topBar}>
            <View style={styles.topBarSpacer} />
            <TouchableOpacity
              style={styles.flashButton}
              onPress={toggleFlash}
              activeOpacity={0.7}
            >
              <Ionicons
                name={flash === "on" ? "flash" : "flash-off"}
                size={24}
                color={flash === "on" ? COLORS.accent : COLORS.text}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.controlsContainer}>
            {/* Label */}
            <Text style={styles.label}>SNAP A RECEIPT</Text>

            {/* Control Row */}
            <View style={styles.controlRow}>
              {/* Gallery Button (Left) */}
              <TouchableOpacity
                style={styles.smallButton}
                onPress={openGallery}
                activeOpacity={0.7}
              >
                <Ionicons name="images" size={SIZES.iconSize} color={COLORS.text} />
              </TouchableOpacity>

              {/* Capture Button (Center) */}
              <TouchableOpacity
                style={styles.captureButton}
                onPress={capturePhoto}
                activeOpacity={0.8}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              {/* Document Upload Button (Right) */}
              <TouchableOpacity
                style={styles.smallButton}
                onPress={openDocumentPicker}
                activeOpacity={0.7}
              >
                <Ionicons name="document" size={SIZES.iconSize} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cameraContainer: {
    flex: 1,
    margin: 16,
    borderRadius: SIZES.borderRadius,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    paddingHorizontal: 20,
  },
  topBarSpacer: {
    width: 48,
  },
  flashButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(31, 41, 55, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 120, // Space for tab bar
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 2,
    marginBottom: 24,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
  },
  captureButton: {
    width: SIZES.captureButton,
    height: SIZES.captureButton,
    borderRadius: SIZES.captureButton / 2,
    backgroundColor: "rgba(31, 41, 55, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.text,
  },
  captureButtonInner: {
    width: SIZES.captureButton - 16,
    height: SIZES.captureButton - 16,
    borderRadius: (SIZES.captureButton - 16) / 2,
    backgroundColor: COLORS.text,
  },
  smallButton: {
    width: SIZES.smallIcon,
    height: SIZES.smallIcon,
    borderRadius: SIZES.smallIcon / 2,
    backgroundColor: "rgba(31, 41, 55, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Permission Screen
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  permissionMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

