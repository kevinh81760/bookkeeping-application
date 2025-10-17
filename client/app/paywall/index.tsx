import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";

export default function Paywall() {
  const [reminder, setReminder] = useState(false);
  const router = useRouter();
  const BACKEND_URL = "http://localhost:4000"; // replace with local IP when testing on device

  const handleStartTrial = async () => {
    try {
      await WebBrowser.openBrowserAsync(`${BACKEND_URL}/api/auth/google`);
    } catch (error) {
      console.error("Error opening browser:", error);
    }
  };

  return (
    <>
      {/* Hide the default route header */}
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white justify-between">
        {/* Close button */}
        <View className="items-end pt-4 pr-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-8 h-8 items-center justify-center"
          >
            <Text className="text-gray-500 text-2xl">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View className="flex-1 justify-between px-6 pb-10 py-10">
          {/* Top features */}
          <View className="mt-10">
            <Text className="text-2xl font-bold text-center mb-4">
              Start simplifying today
            </Text>

            <View className="mb-16">
              <Feature text="Auto-categorize receipts by type" />
              <Feature text="Sync with Google Sheets & CPA tools" />
              <Feature text="Generate monthly summaries automatically" />
              <Feature text="First 7 days free — cancel anytime" />
            </View>
          </View>

          {/* Pricing box anchored lower */}
          <View className="bg-gray-50 p-4 rounded-2xl">
            <Text className="text-center text-gray-500 mb-4 mt-2">
              7 days free, then $4.99/month
            </Text>

            <TouchableOpacity
              onPress={handleStartTrial}
              className="bg-[#259fc7] py-4 rounded-2xl mb-4 active:opacity-80"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Start free trial
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-between items-center border border-gray-300 rounded-2xl px-4 py-3">
              <Text className="text-gray-700 font-medium flex-1">
                Get notified before trial ends
              </Text>
              <Switch
                value={reminder}
                onValueChange={setReminder}
                thumbColor={reminder ? "#259fc7" : "#f4f3f4"}
                trackColor={{ false: "#e5e5e5", true: "#b3ddf0" }}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <View className="flex-row items-start mb-3">
      <Text className="text-green-600 text-lg mr-2">✓</Text>
      <Text className="text-gray-600 flex-1">{text}</Text>
    </View>
  );
}
