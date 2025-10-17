import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getLocalReceipts, deleteLocalReceipt, type LocalReceipt } from "@/lib/localStorage";

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Receipts</Text>
        <Text style={styles.subtitle}>
          {receipts.length > 0 
            ? `${receipts.length} receipt${receipts.length === 1 ? '' : 's'} captured`
            : "All your captured receipts"}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyMessage}>Loading...</Text>
          </View>
        ) : receipts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyTitle}>No receipts yet</Text>
            <Text style={styles.emptyMessage}>
              Tap the "🧪 TEST CAMERA" button{"\n"}to start capturing receipts
            </Text>
          </View>
        ) : (
          <View style={styles.receiptList}>
            {receipts.map((receipt) => (
              <View key={receipt.id} style={styles.receiptCard}>
                <Image source={{ uri: receipt.uri }} style={styles.receiptImage} />
                <View style={styles.receiptInfo}>
                  <Text style={styles.receiptFilename} numberOfLines={1}>
                    {receipt.filename}
                  </Text>
                  <Text style={styles.receiptDate}>{formatDate(receipt.timestamp)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
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
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#9CA3AF" />
            <Text style={styles.infoText}>
              🧪 Testing Mode: Receipts saved locally{"\n"}
              Upload to backend coming soon!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 24,
  },
  receiptList: {
    paddingBottom: 24,
  },
  receiptCard: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  receiptImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#374151",
  },
  receiptInfo: {
    flex: 1,
    marginLeft: 12,
  },
  receiptFilename: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  receiptDate: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  deleteButton: {
    padding: 8,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#9CA3AF",
    marginLeft: 12,
    lineHeight: 20,
  },
});

