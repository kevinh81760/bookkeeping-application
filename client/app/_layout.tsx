import "@/global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        {/* Onboarding (first screen) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Paywall modal (slides up when "Get started" pressed) */}
        <Stack.Screen
          name="paywall"
          options={{
            presentation: "modal", // makes it slide up
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />

        {/* Main app with tabs (Camera, Files, Profile) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
