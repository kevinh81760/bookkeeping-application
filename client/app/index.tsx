import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Text className="text-3xl font-bold text-blue-600 mb-6">
        Layang Bookkeeping 📘
      </Text>

      <Text className="text-gray-600 mb-4 text-center">
        Simple test screen with Tailwind + NativeWindddddddd
      </Text>

      <TouchableOpacity
        className="bg-blue-500 px-6 py-3 rounded-xl active:opacity-80"
        onPress={() => navigation.navigate("next" as never)}
      >
        <Text className="text-white font-semibold text-lg">Next Screen →</Text>
      </TouchableOpacity>
    </View>
  );
}
