import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { loginAsGuest } from "@/services/auth";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "SNAP RECEIPTS",
    subtitle: "Fast capture with edge auto-detect.",
    emoji: "📷",
  },
  {
    title: "ORGANIZE AUTOMATICALLY",
    subtitle: "We file by month and vendor for you.",
    emoji: "🗂️",
  },
  {
    title: "READY FOR BOOKKEEPING",
    subtitle: "Review totals and export when you're done.",
    emoji: "📄",
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      router.push("/(tabs)/camera"); // Go directly to app
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Skip to App */}
      <TouchableOpacity 
        className="absolute top-16 right-6 z-10"
        onPress={() => router.push("/(tabs)/camera")}
      >
        <Text className="text-[#259fc7] font-semibold">SKIP</Text>
      </TouchableOpacity>

      {/* Demo Mode - Quick Access with AI */}
      <TouchableOpacity 
        className="absolute top-16 left-6 z-10 bg-[#259fc7] px-4 py-2 rounded-lg"
        onPress={async () => {
          try {
            await loginAsGuest();
            router.push("/(tabs)/camera");
          } catch (error) {
            console.error("Failed to start demo:", error);
          }
        }}
      >
        <Text className="text-white font-semibold text-sm">🚀 Demo Mode</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View
            style={{ width }}
            className="flex-1 items-center justify-center"
          >
            <View className="w-24 h-24 border-2 border-gray-300 rounded-2xl items-center justify-center">
              <Text className="text-4xl">{item.emoji}</Text>
            </View>
            <Text className="text-xl font-extrabold mt-10 text-black">
              {item.title}
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View className="flex-row justify-center items-center mb-6">
        {slides.map((_, i) => (
          <View
            key={i}
            className={`w-2.5 h-2.5 rounded-full mx-1 ${
              i === index ? "bg-[#259fc7]" : "bg-gray-300"
            }`}
          />
        ))}
      </View>

      {/* Next / Get Started */}
      <View className="items-center mb-10">
        <TouchableOpacity
          onPress={handleNext}
          className="bg-[#259fc7] w-[85%] py-4 rounded-2xl active:opacity-80"
        >
          <Text className="text-white font-semibold text-lg text-center">
            {index === slides.length - 1 ? "Get started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
