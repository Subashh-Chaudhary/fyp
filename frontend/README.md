# Crop Disease Detection System

A production-ready mobile application built with Expo Router (SDK 53) and TypeScript for detecting crop diseases using AI-powered image analysis.

## 🚀 Features

### Core Functionality

- **AI-Powered Disease Detection**: Scan crop images to identify diseases with confidence scores
- **Camera & Gallery Integration**: Capture photos or select existing images for analysis
- **User Type Support**: Separate interfaces for Farmers and Experts
- **Scan History**: Track and manage all your previous scans
- **Real-time Analysis**: Get instant results with treatment recommendations

### User Experience

- **Modern UI/UX**: Clean, intuitive interface with Tailwind CSS styling
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Responsive Design**: Optimized for various screen sizes
- **Offline Support**: Core functionality works without internet connection

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for efficient global state management
- **Navigation**: Expo Router with type-safe routing
- **Image Processing**: Optimized image handling and compression
- **Data Persistence**: Local storage for user preferences and scan history

## 📱 Screens

### 1. Welcome Screen

- First-time user onboarding
- User type selection (Farmer/Expert)
- App features overview

### 2. Home Tab

- Dashboard with quick stats
- Recent scans overview
- Quick action buttons
- Tips for better results

### 3. Feed Tab

- Latest news and articles
- Educational content
- Community updates
- Expert tips and recommendations

### 4. Scan Tab

- Camera capture interface
- Gallery image selection
- Image preview and editing
- Processing status and results

### 5. History Tab

- Complete scan history
- Filter by status (All/Completed/Failed)
- Detailed scan information
- Export functionality

### 6. Settings Tab

- User profile management
- Theme preferences
- Notification settings
- Data management options

## 🛠 Tech Stack

- **Framework**: Expo SDK 53
- **Language**: TypeScript
- **Navigation**: Expo Router v5
- **State Management**: Zustand
- **Styling**: Tailwind CSS React Native
- **UI Components**: Custom component library
- **Image Handling**: Expo Image Picker & Camera
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons (Ionicons)

## 📁 Project Structure

```
frontend/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout
│   └── welcome.tsx        # Welcome screen
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── constants/            # App constants and configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and API clients
├── store/               # Zustand state management
├── styles/              # Global styles and Tailwind config
├── types/               # TypeScript type definitions
└── assets/              # Images, fonts, and static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🔧 Configuration

### Environment Setup

The app is configured to work out of the box, but you can customize:

- **API Endpoints**: Update `constants/index.ts` with your backend URLs
- **App Colors**: Modify `tailwind.config.js` for custom theming
- **Splash Screen**: Update `app.json` for custom splash screen

### Permissions

The app requires the following permissions:

- Camera access for taking photos
- Photo library access for selecting images
- Storage access for saving scan results

## 📊 State Management

The app uses Zustand for state management with the following stores:

- **User State**: Authentication and user profile
- **Theme State**: Dark/light mode preferences
- **Scan History**: Local storage of scan results
- **App Settings**: User preferences and configuration

## 🎨 UI Components

### Base Components

- `Button`: Multiple variants (primary, secondary, outline, danger)
- `Card`: Flexible container with different styles
- `Input`: Form input with validation states
- `Modal`: Overlay dialogs and sheets

### Custom Hooks

- `useAuth`: Authentication management
- `useTheme`: Theme switching and management
- `useAppStore`: Global state access

## 🔒 Security Features

- Secure image processing
- Local data encryption
- Permission-based access control
- Input validation and sanitization

## 📈 Performance Optimizations

- Image compression and optimization
- Lazy loading for large lists
- Efficient state updates
- Memory management for image processing

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📦 Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔮 Future Enhancements

- [ ] Real-time disease tracking
- [ ] Expert consultation features
- [ ] Weather integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline AI model support
- [ ] Social features and community
- [ ] Integration with farming equipment

---

**Built with ❤️ for the agricultural community**
