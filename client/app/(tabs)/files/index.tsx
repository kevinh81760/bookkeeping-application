import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getLocalReceipts, deleteLocalReceipt, type LocalReceipt, getLocalFolders, type LocalFolder } from "@/services/storage";
import { syncUserData } from "@/services/sync";

export default function FilesScreen() {
  const [receipts, setReceipts] = useState<LocalReceipt[]>([]);
  const [folders, setFolders] = useState<LocalFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const router = useRouter();

  // Load receipts and folders when screen is focused
  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Sync folders from backend (this merges backend + local)
      console.log("🔄 [Files] Starting sync...");
      const syncResult = await syncUserData();
      console.log("🔄 [Files] Sync completed. Success:", syncResult.success, "Folders:", syncResult.folders.length);
      
      // 2. Load synced data from local storage
      const [receiptsData, foldersData] = await Promise.all([
        getLocalReceipts(),
        getLocalFolders(),
      ]);
      
      setReceipts(receiptsData);
      setFolders(foldersData);
      console.log(`📁 Loaded ${foldersData.length} folders, ${receiptsData.length} receipts`);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Receipt",
      "Are you sure you want to delete this receipt?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteLocalReceipt(id);
            loadData();
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
      hour: "2-digit",
      minute: "2-digit",
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
    
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Empty state when no folders exist
  if (loading) {
    return (
      <View className="flex-1 bg-[#F8F8F8]">
        <View className="pt-[60px] px-6 pb-6 bg-white">
          <Text className="text-[32px] font-bold text-gray-900">My Files</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-gray-400">Loading...</Text>
        </View>
      </View>
    );
  }

  if (folders.length === 0) {
    return (
      <View className="flex-1 bg-[#F8F8F8]">
        {/* Header */}
        <View className="pt-[60px] px-6 pb-6 bg-white">
          <Text className="text-[32px] font-bold text-gray-900">My Files</Text>
        </View>

        {/* Empty State */}
        <View className="flex-1 items-center justify-center px-6">
          {/* Folder Icon */}
          <View className="mb-8">
            <Ionicons name="folder-open-outline" size={120} color="#D1D5DB" />
            <View className="absolute top-12 left-12 w-3 h-3 rounded-full bg-[#E05C35]" />
          </View>

          {/* Text */}
          <Text className="text-[28px] font-bold text-gray-900 mb-3">NO FOLDERS YET</Text>
          <Text className="text-base text-gray-500 text-center mb-10 leading-6">
            Create a folder to organize your receipts.{"\n"}
            Then export them to Google Sheets!
          </Text>

          {/* Create Folder Button */}
          <TouchableOpacity
            className="bg-[#259fc7] py-4 px-8 rounded-xl active:opacity-80"
            onPress={() => router.push("/(tabs)/files/create-folder")}
          >
            <Text className="text-base font-semibold text-white">Create Folder</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Main view with folders
  return (
    <View className="flex-1 bg-[#F8F8F8]">
      {/* Header */}
      <View className="pt-[60px] px-6 pb-6 bg-white">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[32px] font-bold text-gray-900">My Files</Text>
            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center mr-4">
                <View className="w-2 h-2 rounded-full bg-[#259fc7] mr-2" />
                <Text className="text-base text-gray-600">
                  {folders.length} folder{folders.length === 1 ? '' : 's'}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                <Text className="text-base text-gray-600">
                  {receipts.length} receipt{receipts.length === 1 ? '' : 's'}
                </Text>
              </View>
            </View>
          </View>
          {/* Create Folder FAB */}
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-[#259fc7] items-center justify-center active:opacity-80"
            onPress={() => router.push("/(tabs)/files/create-folder")}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6" 
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
        {/* Folders Section */}
        <View className="mt-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            📁 FOLDERS
          </Text>
          {folders.map((folder) => {
            // Count receipts in this folder
            const folderReceiptCount = receipts.filter(r => r.folderId === folder.id).length;
            
            return (
              <TouchableOpacity
                key={folder.id}
                className="bg-white rounded-2xl p-5 mb-3 active:opacity-80"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
                onPress={() => router.push(`/(tabs)/files/${folder.id}`)}
              >
                <View className="flex-row items-center mb-2">
                  <View className="w-12 h-12 rounded-xl bg-[#259fc7]/10 items-center justify-center relative">
                    <Ionicons name="folder" size={24} color="#259fc7" />
                    {folderReceiptCount > 0 && (
                      <View className="absolute -top-1 -right-1 bg-[#E05C35] rounded-full min-w-[20px] h-5 items-center justify-center px-1.5">
                        <Text className="text-xs font-bold text-white">
                          {folderReceiptCount > 99 ? '99+' : folderReceiptCount}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {folder.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-sm text-gray-500">
                        {folderReceiptCount} item{folderReceiptCount === 1 ? '' : 's'}
                      </Text>
                      <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                      <Text className="text-sm text-gray-500">
                        {formatRelativeTime(folder.timestamp)}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
                {folder.description ? (
                  <Text className="text-sm text-gray-600 mt-2" numberOfLines={2}>
                    {folder.description}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Uncategorized Receipts */}
        {receipts.filter(r => !r.folderId).length > 0 && (
          <View className="mt-6 mb-6">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              📄 UNCATEGORIZED
            </Text>
            {receipts.filter(r => !r.folderId).map((receipt) => (
              <View key={receipt.id} className="flex-row bg-white rounded-2xl p-3 mb-3 items-center" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}>
                <Image source={{ uri: receipt.uri }} className="w-[60px] h-[60px] rounded-lg bg-gray-200" />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={1}>
                    {receipt.filename}
                  </Text>
                  <Text className="text-sm text-gray-500">{formatDate(receipt.timestamp)}</Text>
                </View>
                <TouchableOpacity
                  className="p-2"
                  onPress={() => handleDelete(receipt.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

