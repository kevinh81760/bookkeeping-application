import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Linking,
  Image,
  Share,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import {
  getLocalFolder,
  getReceiptsByFolder,
  deleteLocalFolder,
  deleteLocalReceipt,
  type LocalFolder,
  type LocalReceipt,
} from "@/services/storage";
import { exportFolderToSheets, downloadFolderAsCSV } from "@/services/export";

export default function FolderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [folder, setFolder] = useState<LocalFolder | null>(null);
  const [receipts, setReceipts] = useState<LocalReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadFolderData();
  }, [id]);

  const loadFolderData = async () => {
    try {
      setLoading(true);
      
      if (!id) {
        Alert.alert("Error", "Folder ID not found");
        router.back();
        return;
      }

      // Load folder details
      const folderData = await getLocalFolder(id);
      
      if (!folderData) {
        Alert.alert("Error", "Folder not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }

      // Load receipts for this folder
      const receiptsData = await getReceiptsByFolder(id);
      
      setFolder(folderData);
      setReceipts(receiptsData);
      
      console.log(`📁 Loaded folder "${folderData.name}" with ${receiptsData.length} receipts`);
    } catch (error) {
      console.error("Error loading folder data:", error);
      Alert.alert("Error", "Failed to load folder data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadFolderData();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportToSheets = async () => {
    if (!folder) return;

    // Check if logged in
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      Alert.alert(
        "Login Required",
        "Google Sheets export requires logging in with Google.\n\nWould you like to log in now?",
        [
          { text: "Not Now", style: "cancel" },
          {
            text: "Log In",
            onPress: () => {
              router.push("/paywall");
            },
          },
        ]
      );
      return;
    }

    if (receipts.length === 0) {
      Alert.alert(
        "No Receipts",
        "This folder doesn't have any receipts yet. Add some receipts before exporting.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Export to Google Sheets",
      `Export ${receipts.length} receipt${receipts.length === 1 ? "" : "s"} from "${folder.name}" to Google Sheets?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: async () => {
            try {
              setExporting(true);
              
              const result = await exportFolderToSheets(id);
              
              if (result.success && result.spreadsheetUrl) {
                Alert.alert(
                  "Success! 📊",
                  `Exported ${result.totalRows} items to Google Sheets`,
                  [
                    { text: "Close", style: "cancel" },
                    {
                      text: "Open Sheet",
                      onPress: () => {
                        Linking.openURL(result.spreadsheetUrl!);
                      },
                    },
                  ]
                );
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
              Alert.alert("Export Failed", errorMessage);
            } finally {
              setExporting(false);
            }
          },
        },
      ]
    );
  };

  const handleExportToCSV = async () => {
    if (!folder) return;

    if (receipts.length === 0) {
      Alert.alert(
        "No Receipts",
        "This folder doesn't have any receipts yet. Add some receipts before exporting.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      setExporting(true);
      
      console.log("📥 Downloading CSV...");
      const csvContent = await downloadFolderAsCSV(id);
      
      // Save CSV to file system
      const fileName = `${folder.name.replace(/[^a-z0-9]/gi, '_')}_export_${Date.now()}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: "utf8",
      });
      
      console.log("✅ CSV saved to:", fileUri);
      
      // Share the file - this opens iOS share sheet with "Save to Files" option
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export CSV',
          UTI: 'public.comma-separated-values-text',
        });
        
        console.log("✅ Share sheet opened - user can save to Files app");
      } else {
        // Fallback: try to use Share API
        await Share.share({
          url: fileUri,
          title: 'Export CSV',
        });
        
        Alert.alert("Success! 📊", "CSV file ready to save");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ CSV export error:", errorMessage);
      Alert.alert("Export Failed", errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteFolder = () => {
    if (!folder) return;

    Alert.alert(
      "Delete Folder",
      `Are you sure you want to delete "${folder.name}"?\n\nThis will ${receipts.length > 0 ? `move ${receipts.length} receipt${receipts.length === 1 ? "" : "s"} back to uncategorized.` : "permanently delete this folder."}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete folder
              await deleteLocalFolder(id);
              
              // Note: Receipts will automatically become uncategorized (folderId will just not match any folder)
              // We don't need to explicitly update them
              
              Alert.alert("Deleted", "Folder deleted successfully", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (error) {
              console.error("Error deleting folder:", error);
              Alert.alert("Error", "Failed to delete folder");
            }
          },
        },
      ]
    );
  };

  const handleDeleteReceipt = (receiptId: string) => {
    Alert.alert(
      "Delete Receipt",
      "Are you sure you want to delete this receipt?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteLocalReceipt(receiptId);
            loadFolderData();
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return formatDate(timestamp);
  };

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 bg-[#F8F8F8]">
        <View className={`bg-white ${Platform.OS === "ios" ? "pt-[60px]" : "pt-4"} px-6 pb-4 border-b border-gray-200`}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Loading...</Text>
            <View className="w-8" />
          </View>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#259fc7" />
        </View>
      </View>
    );
  }

  // Folder not found
  if (!folder) {
    return (
      <View className="flex-1 bg-[#F8F8F8]">
        <View className={`bg-white ${Platform.OS === "ios" ? "pt-[60px]" : "pt-4"} px-6 pb-4 border-b border-gray-200`}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Error</Text>
            <View className="w-8" />
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 mt-4">Folder Not Found</Text>
        </View>
      </View>
    );
  }

  // Main content
  return (
    <View className="flex-1 bg-[#F8F8F8]">
      {/* Header */}
      <View className={`bg-white ${Platform.OS === "ios" ? "pt-[60px]" : "pt-4"} px-6 pb-4 border-b border-gray-200`}>
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteFolder}
            className="p-2 -mr-2"
          >
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center mb-2">
          <View className="w-14 h-14 rounded-xl bg-[#259fc7]/10 items-center justify-center mr-4">
            <Ionicons name="folder" size={28} color="#259fc7" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">{folder.name}</Text>
            <Text className="text-sm text-gray-500 mt-1">
              {receipts.length} receipt{receipts.length === 1 ? "" : "s"} • Created {formatRelativeTime(folder.timestamp)}
            </Text>
          </View>
        </View>

        {folder.description ? (
          <Text className="text-sm text-gray-600 mt-2 leading-5">
            {folder.description}
          </Text>
        ) : null}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#259fc7"
            colors={["#259fc7"]}
          />
        }
      >
        {/* Export Button */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            className={`bg-[#259fc7] py-4 rounded-xl flex-row items-center justify-center ${
              exporting ? "opacity-60" : ""
            }`}
            onPress={handleExportToCSV}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                <Text className="text-base font-bold text-white">Exporting...</Text>
              </>
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="white" />
                <Text className="text-base font-bold text-white ml-2">Download CSV</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        {folder.categories && folder.categories.length > 0 && (
          <View className="bg-white mt-6 px-6 py-5">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              📋 CATEGORIES
            </Text>
            <View className="flex-row flex-wrap">
              {folder.categories.map((category, index) => (
                <View
                  key={index}
                  className="bg-[#F8F8F8] rounded-lg px-3 py-2 mr-2 mb-2 flex-row items-center"
                >
                  <Text className="text-sm font-semibold text-gray-900">
                    {category.name}
                  </Text>
                  <View className="w-1 h-1 rounded-full bg-gray-400 mx-2" />
                  <Text className="text-xs text-gray-500">{category.type}</Text>
                  {category.required && (
                    <Text className="text-xs text-[#E05C35] ml-1">*</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Receipts Section */}
        {receipts.length > 0 ? (
          <View className="mt-6 px-6 pb-6">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              📄 RECEIPTS
            </Text>
            {receipts.map((receipt) => (
              <View
                key={receipt.id}
                className="flex-row bg-white rounded-2xl p-3 mb-3 items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Image
                  source={{ uri: receipt.uri }}
                  className="w-[60px] h-[60px] rounded-lg bg-gray-200"
                />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={1}>
                    {receipt.filename}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {formatDate(receipt.timestamp)}
                  </Text>
                </View>
                <TouchableOpacity
                  className="p-2"
                  onPress={() => handleDeleteReceipt(receipt.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          /* Empty State */
          <View className="flex-1 items-center justify-center px-6 py-16">
            <View className="mb-6">
              <Ionicons name="receipt-outline" size={80} color="#D1D5DB" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">No Receipts Yet</Text>
            <Text className="text-base text-gray-500 text-center leading-6">
              Capture receipts from the camera tab{"\n"}and assign them to this folder
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
