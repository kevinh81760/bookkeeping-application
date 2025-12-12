import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../config/api";
import type { LocalFolder } from "./storage";

/**
 * Fetch folders from backend
 */
export async function fetchFoldersFromBackend(): Promise<LocalFolder[]> {
    try {
        const token = await SecureStore.getItemAsync("userToken");
        if (!token) {
            console.log("ℹ️ Not logged in, skipping backend folder sync");
            return [];
        }
        
        // Fetch folders from server
        const response = await fetch(`${BACKEND_URL}/folders/getFolders`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch folders: ${response.status}`);
        }
        
        const data = await response.json();
        const backendFolders = data.folders || [];
        
        // Transform backend folders to match LocalFolder interface
        const transformedFolders: LocalFolder[] = backendFolders.map((folder: any) => ({
            id: folder.folderId,
            name: folder.name,
            description: folder.description || "",
            categories: folder.categories || [],
            advanced: {
                ocrParseFrom: "",
                validationRules: "",
            },
            timestamp: new Date(folder.createdAt).getTime(),
        }));
        
        console.log(`✅ Fetched ${transformedFolders.length} folders from backend`);
        return transformedFolders;
        
    } catch (error) {
        console.error("❌ Error fetching folders from backend:", error);
        // Return empty array on error, don't throw
        return [];
    }
}

/**
 * Sync user data from backend to local storage
 * 
 * This function:
 * 1. Fetches folders from the backend
 * 2. Merges with local folders (keeps both local and backend)
 * 3. Stores merged list locally in AsyncStorage
 * 4. Can be called on app startup or when user pulls to refresh
 */
export async function syncUserData(): Promise<{ success: boolean; folders: LocalFolder[] }> {
    try {
        // 1. Fetch folders from backend
        const backendFolders = await fetchFoldersFromBackend();
        
        // 2. Get existing local folders
        const localData = await AsyncStorage.getItem("@folders");
        const localFolders: LocalFolder[] = localData ? JSON.parse(localData) : [];
        
        // 3. Merge: combine backend and local folders, removing duplicates by ID
        const folderMap = new Map<string, LocalFolder>();
        
        // Add backend folders first (they take priority)
        backendFolders.forEach(folder => {
            folderMap.set(folder.id, folder);
        });
        
        // Add local folders that don't exist in backend
        localFolders.forEach(folder => {
            if (!folderMap.has(folder.id)) {
                folderMap.set(folder.id, folder);
            }
        });
        
        const mergedFolders = Array.from(folderMap.values());
        
        // Sort by timestamp (most recent first)
        mergedFolders.sort((a, b) => b.timestamp - a.timestamp);
        
        // 4. Store merged folders locally
        await AsyncStorage.setItem("@folders", JSON.stringify(mergedFolders));
        
        console.log(`✅ Synced ${mergedFolders.length} folders (${backendFolders.length} from backend, ${localFolders.length} local)`);
        
        return { success: true, folders: mergedFolders };
        
    } catch (error) {
        console.error("❌ Error syncing user data:", error);
        
        // On error, return local folders
        const localData = await AsyncStorage.getItem("@folders");
        const localFolders: LocalFolder[] = localData ? JSON.parse(localData) : [];
        
        return { success: false, folders: localFolders };
    }
}