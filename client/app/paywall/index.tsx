import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Paywall() {
  const [reminder, setReminder] = useState(false);
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-between">
      {/* Wrapper for paywall content */}
      <View>
        {/* Close button */}
        <View className="items-end pt-4 pr-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-8 h-8 items-center justify-center"
          >
            <Text className="text-gray-500 text-2xl">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom content */}
        <View className="px-6 pb-10 mt-12">
          <Text className="text-2xl font-bold text-center mb-4">
            Start simplifying today
          </Text>

          <View className="mb-24">
            <Feature text="Auto-categorize receipts by type" />
            <Feature text="Sync with Google Sheets & CPA tools" />
            <Feature text="Generate monthly summaries automatically" />
            <Feature text="First 7 days free — cancel anytime" />
          </View>

          {/* Outer wrapper for pricing section */}
          <View className="relative mt-24 pt-5">
            <View className="bg-gray-50 p-4 rounded-2xl">
              <Text className="text-center text-gray-500 mb-4 mt-4">
                7 days free, then $4.99/month
              </Text>

          <TouchableOpacity className="bg-[#259fc7] py-4 rounded-2xl mb-4 active:opacity-80">
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
      </View>
    </View>
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
