# Network Setup Guide

This guide explains how to configure the network settings for different development environments.

## Overview

Your React Native app needs to connect to your backend server. The configuration varies depending on whether you're using:

- Physical device with Expo Go
- Android emulator
- iOS simulator
- Web development

## Quick Configuration

### 1. Find Your Computer's Local IP Address

Run this command to find your computer's IP address on your local network:

```bash
ip route get 1.1.1.1 | awk '{print $7}' | head -1
```

This will return something like `192.168.18.78`.

### 2. Update Network Configuration

Edit `src/config/network.config.ts` and update the `LOCAL_IP` value:

```typescript
export const NETWORK_CONFIG = {
  // Your computer's local IP address on your network
  LOCAL_IP: "192.168.18.78", // ← Update this value

  // Backend port
  BACKEND_PORT: 3000,

  // Development URLs for different platforms
  DEVELOPMENT_URLS: {
    // For physical devices using Expo Go
    PHYSICAL_DEVICE: "http://192.168.18.78:3000", // ← This will auto-update

    // For Android emulator
    ANDROID_EMULATOR: "http://10.0.2.2:3000",

    // For iOS simulator
    IOS_SIMULATOR: "http://localhost:3000",

    // For web development
    WEB: "http://localhost:3000",
  },
  // ... rest of config
};
```

## Development Scenarios

### Physical Device with Expo Go

**Configuration**: Uses `PHYSICAL_DEVICE` URL
**URL**: `http://192.168.18.78:3000`
**Requirements**:

- Device must be on the same WiFi network as your computer
- Backend must be accessible from your local network

### Android Emulator

**Configuration**: Uses `ANDROID_EMULATOR` URL
**URL**: `http://10.0.2.2:3000`
**Requirements**:

- Standard Android emulator setup
- Backend running on localhost

### iOS Simulator

**Configuration**: Uses `IOS_SIMULATOR` URL
**URL**: `http://localhost:3000`
**Requirements**:

- macOS with Xcode
- Backend running on localhost

### Web Development

**Configuration**: Uses `WEB` URL
**URL**: `http://localhost:3000`
**Requirements**:

- Backend running on localhost

## Troubleshooting

### "Network Error" on Physical Device

1. **Check IP Address**: Make sure `LOCAL_IP` in `network.config.ts` matches your computer's actual IP
2. **Verify Network**: Ensure your device and computer are on the same WiFi network
3. **Test Connectivity**: Try accessing `http://YOUR_IP:3000` from your device's browser
4. **Check Backend**: Ensure your backend is running and accessible from the network

### Backend Not Accessible from Network

If your backend is only accessible via localhost, you may need to bind it to all network interfaces:

```bash
# For Node.js/Express
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});

# Or check if it's already bound to all interfaces
netstat -tlnp | grep :3000
# Should show :::3000 or 0.0.0.0:3000
```

### Testing Network Configuration

Run the network utility tests to verify your configuration:

```bash
npm test -- --testPathPattern=network.utils.test.ts
```

## Environment Variables

You can also use environment variables to override the configuration:

```bash
# In your .env file
LOCAL_IP=192.168.18.78
BACKEND_PORT=3000
```

## Production

In production, the app automatically uses the production URL:

- **URL**: `https://api.cropdisease.com/v1`
- **Timeout**: 30 seconds
- **No local network configuration needed**

## Support

If you're still having issues:

1. Check the console logs for network configuration details
2. Verify your backend is running and accessible
3. Test network connectivity manually
4. Check firewall and network security settings
