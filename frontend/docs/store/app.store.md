# App Store Documentation

## Overview

The App Store is a Zustand-based state management solution for handling general application state in the Crop Disease Detection System. It manages non-sensitive application data such as theme preferences, scan history, app settings, and network status using AsyncStorage for persistence.

## Features

### 🎨 **Theme Management**

- **Light/Dark theme support**
- **Persistent theme preferences**
- **Automatic theme switching**
- **System theme detection**

### 📱 **App Settings**

- **First launch detection**
- **Notification preferences**
- **Location permissions**
- **Language settings**

### 📊 **Data Management**

- **Scan history storage**
- **Network status monitoring**
- **Last sync tracking**
- **Loading states**

### 💾 **Persistence**

- **AsyncStorage integration**
- **Selective data persistence**
- **Automatic state restoration**
- **Data cleanup utilities**

## Architecture

### File Structure

```
src/
├── store/
│   └── app.store.ts            # App store implementation
├── interfaces/
│   └── app.types.ts            # App state interface
└── types/
    └── index.ts                # Type definitions
```

### Dependencies

- **Zustand**: State management
- **@react-native-async-storage/async-storage**: Persistence
- **TypeScript**: Type safety

## State Interface

```typescript
interface AppState {
  // State
  theme: Theme;
  isFirstLaunch: boolean;
  scanHistory: ScanResult[];
  isLoading: boolean;
  networkStatus: "online" | "offline";
  lastSyncTime: Date | null;
  notifications: boolean;
  locationEnabled: boolean;
  language: string;

  // Actions
  setTheme: (theme: Theme) => void;
  setFirstLaunch: (isFirst: boolean) => void;
  addScanToHistory: (scan: ScanResult) => void;
  removeScanFromHistory: (scanId: string) => void;
  clearScanHistory: () => void;
  setLoading: (loading: boolean) => void;
  setNetworkStatus: (status: "online" | "offline") => void;
  setLastSyncTime: (time: Date) => void;
  setNotifications: (enabled: boolean) => void;
  setLocationEnabled: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  resetApp: () => void;
}
```

## State Properties

### **theme: Theme**

- Current app theme (`'light' | 'dark'`)
- Default: `'light'`
- Persisted across app restarts

### **isFirstLaunch: boolean**

- Indicates if this is the user's first app launch
- Default: `true`
- Used for onboarding flows

### **scanHistory: ScanResult[]**

- Array of recent scan results
- Limited to last 100 scans
- Persisted for offline access

### **isLoading: boolean**

- Global loading state
- Used for app-wide loading indicators
- Not persisted

### **networkStatus: 'online' | 'offline'**

- Current network connectivity status
- Default: `'online'`
- Updated automatically

### **lastSyncTime: Date | null**

- Timestamp of last successful data sync
- Default: `null`
- Used for sync indicators

### **notifications: boolean**

- User's notification preference
- Default: `true`
- Persisted across sessions

### **locationEnabled: boolean**

- Location permission status
- Default: `false`
- Updated when permissions change

### **language: string**

- User's preferred language
- Default: `'en'`
- Persisted across sessions

## Actions

### **setTheme(theme: Theme): void**

Updates the app theme.

```typescript
const { setTheme } = useAppStore();

setTheme("dark"); // Switch to dark theme
setTheme("light"); // Switch to light theme
```

**What it does:**

- Updates theme state
- Persists theme preference
- Triggers UI theme changes

### **setFirstLaunch(isFirst: boolean): void**

Updates first launch status.

```typescript
const { setFirstLaunch } = useAppStore();

setFirstLaunch(false); // Mark as not first launch
```

### **addScanToHistory(scan: ScanResult): void**

Adds a scan result to history.

```typescript
const { addScanToHistory } = useAppStore();

addScanToHistory({
  id: "scan-123",
  imageUrl: "file://image.jpg",
  cropId: "tomato-1",
  confidence: 0.95,
  status: "completed",
  createdAt: new Date(),
  analysis: {
    /* ... */
  },
});
```

**What it does:**

- Adds scan to beginning of history
- Limits history to 100 items
- Persists updated history

### **removeScanFromHistory(scanId: string): void**

Removes a specific scan from history.

```typescript
const { removeScanFromHistory } = useAppStore();

removeScanFromHistory("scan-123");
```

### **clearScanHistory(): void**

Clears all scan history.

```typescript
const { clearScanHistory } = useAppStore();

clearScanHistory();
```

### **setLoading(loading: boolean): void**

Updates global loading state.

```typescript
const { setLoading } = useAppStore();

setLoading(true); // Show global loading
setLoading(false); // Hide global loading
```

### **setNetworkStatus(status: 'online' | 'offline'): void**

Updates network connectivity status.

```typescript
const { setNetworkStatus } = useAppStore();

setNetworkStatus("offline"); // Mark as offline
setNetworkStatus("online"); // Mark as online
```

### **setLastSyncTime(time: Date): void**

Updates last sync timestamp.

```typescript
const { setLastSyncTime } = useAppStore();

setLastSyncTime(new Date()); // Update sync time
```

### **setNotifications(enabled: boolean): void**

Updates notification preference.

```typescript
const { setNotifications } = useAppStore();

setNotifications(false); // Disable notifications
setNotifications(true); // Enable notifications
```

### **setLocationEnabled(enabled: boolean): void**

Updates location permission status.

```typescript
const { setLocationEnabled } = useAppStore();

setLocationEnabled(true); // Location enabled
setLocationEnabled(false); // Location disabled
```

### **setLanguage(language: string): void**

Updates preferred language.

```typescript
const { setLanguage } = useAppStore();

setLanguage("es"); // Spanish
setLanguage("fr"); // French
setLanguage("en"); // English
```

### **resetApp(): void**

Resets all app state to defaults.

```typescript
const { resetApp } = useAppStore();

resetApp(); // Reset everything to defaults
```

**What it does:**

- Resets all state properties to defaults
- Clears scan history
- Resets all preferences
- Persists reset state

## Usage Examples

### 1. **Theme Management**

```typescript
import { useAppStore } from "../src/store/app.store";

const ThemeToggle = () => {
  const { theme, setTheme } = useAppStore();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button onPress={toggleTheme}>
      Switch to {theme === "light" ? "Dark" : "Light"} Theme
    </Button>
  );
};

const ThemedComponent = () => {
  const { theme } = useAppStore();

  return (
    <View style={theme === "dark" ? darkStyles : lightStyles}>
      <Text>Current theme: {theme}</Text>
    </View>
  );
};
```

### 2. **Scan History Management**

```typescript
import { useAppStore } from "../src/store/app.store";

const ScanHistoryScreen = () => {
  const { scanHistory, removeScanFromHistory, clearScanHistory } =
    useAppStore();

  const handleDeleteScan = (scanId: string) => {
    removeScanFromHistory(scanId);
  };

  const handleClearHistory = () => {
    clearScanHistory();
  };

  return (
    <View>
      <Text>Scan History ({scanHistory.length})</Text>

      {scanHistory.map((scan) => (
        <ScanCard
          key={scan.id}
          scan={scan}
          onDelete={() => handleDeleteScan(scan.id)}
        />
      ))}

      <Button onPress={handleClearHistory}>Clear All History</Button>
    </View>
  );
};
```

### 3. **App Settings**

```typescript
import { useAppStore } from "../src/store/app.store";

const SettingsScreen = () => {
  const {
    notifications,
    setNotifications,
    locationEnabled,
    setLocationEnabled,
    language,
    setLanguage,
    resetApp,
  } = useAppStore();

  return (
    <View>
      <Switch
        value={notifications}
        onValueChange={setNotifications}
        title="Push Notifications"
      />

      <Switch
        value={locationEnabled}
        onValueChange={setLocationEnabled}
        title="Location Services"
      />

      <Picker selectedValue={language} onValueChange={setLanguage}>
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Spanish" value="es" />
        <Picker.Item label="French" value="fr" />
      </Picker>

      <Button onPress={resetApp} color="red">
        Reset All Settings
      </Button>
    </View>
  );
};
```

### 4. **Network Status Monitoring**

```typescript
import { useAppStore } from "../src/store/app.store";

const NetworkIndicator = () => {
  const { networkStatus } = useAppStore();

  return (
    <View style={networkStatus === "offline" ? offlineStyles : onlineStyles}>
      <Text>{networkStatus === "offline" ? "Offline" : "Online"}</Text>
    </View>
  );
};

const SyncStatus = () => {
  const { lastSyncTime, setLastSyncTime } = useAppStore();

  const handleSync = async () => {
    try {
      // Perform sync operation
      await syncData();
      setLastSyncTime(new Date());
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  return (
    <View>
      <Text>
        Last sync: {lastSyncTime ? lastSyncTime.toLocaleString() : "Never"}
      </Text>
      <Button onPress={handleSync}>Sync Now</Button>
    </View>
  );
};
```

### 5. **First Launch Detection**

```typescript
import { useAppStore } from "../src/store/app.store";

const AppInitializer = () => {
  const { isFirstLaunch, setFirstLaunch } = useAppStore();

  useEffect(() => {
    if (isFirstLaunch) {
      // Show onboarding
      showOnboarding();
      setFirstLaunch(false);
    }
  }, [isFirstLaunch]);

  if (isFirstLaunch) {
    return <OnboardingScreen />;
  }

  return <MainApp />;
};
```

## Persistence Configuration

### **Storage Configuration**

```typescript
{
  name: 'app-storage',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({
    theme: state.theme,
    isFirstLaunch: state.isFirstLaunch,
    scanHistory: state.scanHistory,
    notifications: state.notifications,
    locationEnabled: state.locationEnabled,
    language: state.language,
  }),
}
```

### **Persisted Data**

- ✅ **theme**: User's theme preference
- ✅ **isFirstLaunch**: First launch status
- ✅ **scanHistory**: Recent scan results
- ✅ **notifications**: Notification preference
- ✅ **locationEnabled**: Location permission status
- ✅ **language**: Language preference

### **Non-Persisted Data**

- ❌ **isLoading**: Temporary loading state
- ❌ **networkStatus**: Real-time network status
- ❌ **lastSyncTime**: Sync timestamp

## Data Management

### **Scan History Limits**

```typescript
addScanToHistory: (scan: ScanResult) => {
  const { scanHistory } = get();
  const updatedHistory = [scan, ...scanHistory];
  // Keep only last 100 scans
  const limitedHistory = updatedHistory.slice(0, 100);
  set({ scanHistory: limitedHistory });
};
```

### **Data Cleanup**

```typescript
// Clear old scan data
const cleanupOldScans = () => {
  const { scanHistory } = useAppStore.getState();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const filteredScans = scanHistory.filter(
    (scan) => new Date(scan.createdAt) > thirtyDaysAgo
  );

  useAppStore.setState({ scanHistory: filteredScans });
};
```

## Integration with Components

### **Theme Provider Integration**

```typescript
const ThemeProvider = ({ children }) => {
  const { theme } = useAppStore();

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
```

### **Network Status Integration**

```typescript
const NetworkProvider = ({ children }) => {
  const { setNetworkStatus } = useAppStore();

  useEffect(() => {
    const handleOnline = () => setNetworkStatus("online");
    const handleOffline = () => setNetworkStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return children;
};
```

## Performance Optimization

### **Selective Updates**

```typescript
// Only update specific parts of state
const { setTheme } = useAppStore((state) => ({ setTheme: state.setTheme }));

// Avoid unnecessary re-renders
const theme = useAppStore((state) => state.theme);
```

### **Batch Updates**

```typescript
const updateMultipleSettings = () => {
  useAppStore.setState({
    notifications: false,
    locationEnabled: true,
    language: "es",
  });
};
```

## Error Handling

### **Storage Errors**

```typescript
// Handle AsyncStorage errors gracefully
const handleStorageError = (error: Error) => {
  console.error("Storage error:", error);
  // Fallback to default values
  useAppStore.setState({
    theme: "light",
    notifications: true,
    language: "en",
  });
};
```

### **Data Validation**

```typescript
const validateScanData = (scan: ScanResult) => {
  if (!scan.id || !scan.imageUrl) {
    console.error("Invalid scan data:", scan);
    return false;
  }
  return true;
};

const addScanToHistory = (scan: ScanResult) => {
  if (validateScanData(scan)) {
    // Add to history
  }
};
```

## Testing

### **Unit Testing**

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import { useAppStore } from "../src/store/app.store";

test("should set theme", () => {
  const { result } = renderHook(() => useAppStore());

  act(() => {
    result.current.setTheme("dark");
  });

  expect(result.current.theme).toBe("dark");
});

test("should add scan to history", () => {
  const { result } = renderHook(() => useAppStore());
  const mockScan = { id: "1", imageUrl: "test.jpg" };

  act(() => {
    result.current.addScanToHistory(mockScan);
  });

  expect(result.current.scanHistory).toContain(mockScan);
});
```

### **Integration Testing**

```typescript
test("should persist theme across app restarts", () => {
  // Set theme
  useAppStore.getState().setTheme("dark");

  // Simulate app restart
  // Re-initialize store

  // Verify theme persisted
  expect(useAppStore.getState().theme).toBe("dark");
});
```

## Best Practices

### 1. **Use Selective State Access**

```typescript
// ✅ Good - Only re-renders when theme changes
const theme = useAppStore((state) => state.theme);

// ❌ Bad - Re-renders on any state change
const { theme } = useAppStore();
```

### 2. **Handle Async Operations**

```typescript
// ✅ Good - Handle async operations properly
const handleSync = async () => {
  setLoading(true);
  try {
    await syncData();
    setLastSyncTime(new Date());
  } finally {
    setLoading(false);
  }
};
```

### 3. **Validate Data**

```typescript
// ✅ Good - Validate data before storing
const addScan = (scan: ScanResult) => {
  if (scan && scan.id) {
    addScanToHistory(scan);
  }
};
```

### 4. **Clean Up Data**

```typescript
// ✅ Good - Clean up old data periodically
useEffect(() => {
  const cleanup = setInterval(() => {
    cleanupOldScans();
  }, 24 * 60 * 60 * 1000); // Daily cleanup

  return () => clearInterval(cleanup);
}, []);
```

## Troubleshooting

### **Common Issues**

1. **Data not persisting**

   - Check AsyncStorage permissions
   - Verify storage configuration
   - Check for storage errors

2. **Performance issues**

   - Use selective state access
   - Avoid unnecessary re-renders
   - Implement data cleanup

3. **Memory leaks**
   - Clean up old scan history
   - Limit data storage
   - Monitor memory usage

### **Debug Mode**

```typescript
// Enable debug logging
if (__DEV__) {
  console.log("App State:", useAppStore.getState());
}
```

## Migration Guide

### **From Redux**

1. Replace Redux store with Zustand
2. Update component imports
3. Convert reducers to actions
4. Update persistence logic

### **From Context API**

1. Replace Context with Zustand
2. Remove Context providers
3. Update component hooks
4. Test state persistence

## Conclusion

The App Store provides a lightweight, efficient, and easy-to-use solution for managing application state in React Native applications. It offers persistence, performance optimization, and a clean API for developers.

For more information, see:

- [Auth Store Documentation](./auth.store.md)
- [API Structure Documentation](../module/API_STRUCTURE.md)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
