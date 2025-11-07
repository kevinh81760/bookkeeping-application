import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter, Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

// Tell WebBrowser to handle OAuth session properly
WebBrowser.maybeCompleteAuthSession();

export default function Paywall() {
  const [reminder, setReminder] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const BACKEND_URL = "http://localhost:4000";

  // 🧪 TEST: Check if backend is reachable
  useEffect(() => {
    fetch('http://localhost:4000/')
      .then(res => res.text())
      .then(text => console.log('✅ Backend reachable:', text))
      .catch(err => console.error('❌ Cannot reach backend:', err));
  }, []);

  // Listen for deep link redirects from OAuth callback
  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const { url } = event;
      console.log("🔗 Deep link received:", url);

      if (url.includes("auth")) {
        console.log("🔐 Auth deep link detected, processing...");
        try {
          const params = new URLSearchParams(url.split("?")[1]);
          const token = params.get("token");
          const error = params.get("error");

          console.log("📝 Extracted params - token:", token ? "present" : "missing", "error:", error || "none");

          if (error) {
            Alert.alert(
              "Login Failed",
              "Unable to authenticate with Google. Please try again."
            );
            setLoading(false);
            return;
          }

          if (token) {
            console.log("💾 [Deep Link] Saving token and redirecting...");
            console.log("🔍 [Deep Link] Token (first 50 chars):", token.substring(0, 50) + "...");
            
            // Decode and log token payload for debugging
            try {
              const parts = token.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                console.log("👤 [Deep Link] Token payload:", JSON.stringify(payload, null, 2));
              } else {
                console.warn("⚠️ [Deep Link] Token doesn't have 3 parts:", parts.length);
              }
            } catch (decodeError) {
              console.error("❌ [Deep Link] Failed to decode token:", decodeError);
            }
            
            await SecureStore.setItemAsync("userToken", token);
            console.log("✅ [Deep Link] Token saved, navigating to camera...");
            router.replace("/(tabs)/camera");
            setLoading(false);
          } else {
            console.warn("⚠️ Token not found in deep link params");
            setLoading(false);
          }
        } catch (err) {
          console.error("❌ Error handling deep link:", err);
          Alert.alert("Error", "Failed to process login. Please try again.");
          setLoading(false);
        }
      } else {
        console.log("ℹ️ Deep link does not contain 'auth', ignoring");
      }
    };

    console.log("👂 Deep link listener registered");
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      console.log("🔇 Deep link listener removed");
      subscription.remove();
    };
  }, [router]);

  const handleStartTrial = async () => {
    try {
      setLoading(true);
      console.log("🚀 Opening Google OAuth...");

      const result = await WebBrowser.openAuthSessionAsync(
        `${BACKEND_URL}/api/auth/google`,
        "client://auth"
      );

      console.log("📱 Auth session result:", JSON.stringify(result, null, 2));

      if (result.type === "success" && result.url) {
        console.log("✅ Success URL received:", result.url);
        
        // Handle the URL directly if it contains auth data
        if (result.url.includes("auth")) {
          try {
            const params = new URLSearchParams(result.url.split("?")[1]);
            const token = params.get("token");
            const error = params.get("error");

            if (error) {
              Alert.alert(
                "Login Failed",
                "Unable to authenticate with Google. Please try again."
              );
              setLoading(false);
              return;
            }

            if (token) {
              console.log("💾 [Success URL] Saving token and redirecting...");
              console.log("🔍 [Success URL] Token (first 50 chars):", token.substring(0, 50) + "...");
              
              // Decode and log token payload for debugging
              try {
                const parts = token.split('.');
                if (parts.length === 3) {
                  const payload = JSON.parse(atob(parts[1]));
                  console.log("👤 [Success URL] Token payload:", JSON.stringify(payload, null, 2));
                } else {
                  console.warn("⚠️ [Success URL] Token doesn't have 3 parts:", parts.length);
                }
              } catch (decodeError) {
                console.error("❌ [Success URL] Failed to decode token:", decodeError);
              }
              
              await SecureStore.setItemAsync("userToken", token);
              console.log("✅ [Success URL] Token saved, navigating to camera...");
              router.replace("/(tabs)/camera");
              setLoading(false);
            }
          } catch (err) {
            console.error("Error parsing success URL:", err);
            setLoading(false);
          }
        }
      } else if (result.type === "cancel") {
        console.log("❌ User cancelled login");
        setLoading(false);
      } else if (result.type === "dismiss") {
        console.log("ℹ️ Browser dismissed");
        setLoading(false);
      } else {
        console.log("⚠️ Unknown result type:", result.type);
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Error opening browser:", error);
      Alert.alert(
        "Error",
        "Unable to open login page. Please check your network connection."
      );
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white">
        {/* Close button with safe area + lower offset */}
        <SafeAreaView edges={["top"]} className="items-end pr-4">
          <TouchableOpacity
            onPress={() => router.replace("/")}
            className="w-10 h-10 items-center justify-center mt-3"
          >
            <Text className="text-gray-500 text-2xl">✕</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Main content */}
        <View className="flex-1 justify-between px-6 pb-10">
          <View className="mt-10">
            <Text className="text-2xl font-bold text-center mb-4">
              Start simplifying today
            </Text>

            <View className="mb-16 ml-6">
              <Feature text="Auto-categorize receipts by type" />
              <Feature text="Sync with Google Sheets & CPA tools" />
              <Feature text="Generate monthly summaries automatically" />
              <Feature text="First 7 days free — cancel anytime" />
            </View>
          </View>

          <View className="bg-gray-50 p-4 rounded-2xl">
            <Text className="text-center text-gray-500 mb-4 mt-2">
              7 days free, then $4.99/month
            </Text>

            <TouchableOpacity
              onPress={handleStartTrial}
              disabled={loading}
              className="bg-[#259fc7] py-4 rounded-2xl mb-4 active:opacity-80"
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? "Opening..." : "Start free trial"}
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
