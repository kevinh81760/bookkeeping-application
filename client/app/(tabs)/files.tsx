import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getLocalReceipts, deleteLocalReceipt, type LocalReceipt } from "@/services/storage";

export default function FilesScreen() {
  const [receipts, setReceipts] = useState<LocalReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused(); // Refresh when tab is focused

  // Load receipts when screen is focused
  useEffect(() => {
    if (isFocused) {
      loadReceipts();
    }
  }, [isFocused]);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      const data = await getLocalReceipts();
      setReceipts(data);
      console.log(`📁 Loaded ${data.length} receipts`);
    } catch (error) {
      console.error("Error loading receipts:", error);
    } finally {
      setLoading(false);
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
            loadReceipts(); // Refresh list
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

  return (
    <View className="flex-1 bg-gray-900">
      <View className="pt-[60px] px-6 pb-6">
        <Text className="text-[32px] font-bold text-gray-50 mb-1">My Receipts</Text>
        <Text className="text-base text-gray-400">
          {receipts.length > 0 
            ? `${receipts.length} receipt${receipts.length === 1 ? '' : 's'} captured`
            : "All your captured receipts"}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {loading ? (
          <View className="items-center justify-center py-20">
            <Text className="text-base text-gray-400 text-center leading-6">Loading...</Text>
          </View>
        ) : receipts.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-[64px] mb-4">📸</Text>
            <Text className="text-xl font-semibold text-gray-50 mb-2">No receipts yet</Text>
            <Text className="text-base text-gray-400 text-center leading-6">
              Tap the "🧪 TEST CAMERA" button{"\n"}to start capturing receipts
            </Text>
          </View>
        ) : (
          <View className="pb-6">
            {receipts.map((receipt) => (
              <View key={receipt.id} className="flex-row bg-gray-800 rounded-xl p-3 mb-3 items-center">
                <Image source={{ uri: receipt.uri }} className="w-[60px] h-[60px] rounded-lg bg-gray-700" />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-gray-50 mb-1" numberOfLines={1}>
                    {receipt.filename}
                  </Text>
                  <Text className="text-sm text-gray-400">{formatDate(receipt.timestamp)}</Text>
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

        {/* Testing Info */}
        {receipts.length > 0 && (
          <View className="flex-row bg-gray-800 rounded-xl p-4 mt-2 mb-6 items-start">
            <Ionicons name="information-circle" size={20} color="#9CA3AF" />
            <Text className="flex-1 text-sm text-gray-400 ml-3 leading-5">
              🧪 Testing Mode: Receipts saved locally{"\n"}
              Upload to backend coming soon!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
