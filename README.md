# Guardia Médica - Mobile WebView App

A React Native application that wraps the Guardia Médica web application with native mobile navigation using drawer navigation and optimized WebView components.

## 🏗️ Architecture

This is a **hybrid mobile app** that uses React Native to provide:
- Native drawer navigation
- Optimized WebView components
- Native mobile features (future: zoom functionality)
- Better user experience compared to a responsive website

## 📱 Navigation Structure

The app uses **drawer navigation** with the following screens:

- **Inicio** - Home dashboard (`/`)
- **Perfil** - User profile (`/perfil`)
- **Mis Estudios** - Medical studies (`/mis-estudios`)
- **Mis Turnos** - Appointments (`/mis-turnos`)
- **Historial Médico** - Medical records (`/historial-medico`)
- **Recetas y Órdenes** - Prescriptions and orders (`/recetas-ordenes`)
- **Consultas Anteriores** - Previous consultations (`/consultas-anteriores`)
- **Ayuda** - Help section (`/ayuda-soporte`)

Each drawer item loads a different route of the web application while maintaining native navigation.

## 🚀 Getting Started

### Prerequisites

- Node.js (latest LTS)
- React Native development environment
- iOS Simulator / Android Emulator

### Installation

```bash
npm install
```

### Environment Configuration

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment:**
   Edit `.env` and set your desired environment:
   ```env
   # Environment Configuration
   EXPO_PUBLIC_ENV=dev
   EXPO_PUBLIC_BASE_DOMAIN=ondoctor365.com
   ```

3. **Available environments:**
   - `dev` → `https://dev.ondoctor365.com`
   - `staging` → `https://staging.ondoctor365.com`
   - `prod` → `https://ondoctor365.com` (or `https://prod.ondoctor365.com`)

### Running the app

```bash
# Start Metro bundler
npm start

# iOS
npm run ios

# Android  
npm run android
```

## 🔧 WebView Configuration

The app includes optimized WebView configuration in `constants/WebViewConfig.ts`:

### Environment-Based Configuration
- **Dynamic URL Construction**: URLs are built based on `EXPO_PUBLIC_ENV`
- **Environment-Specific Settings**: Different timeouts and caching for dev vs production
- **Enhanced Logging**: Console forwarding enabled in development mode
- **User Agent**: Includes environment information for backend tracking


## 📦 Components

### `AppWebView`
A reusable WebView component with:
- Error handling and retry functionality
- Loading states
- Hardware back button support (Android)
- Enhanced JavaScript injection
- Navigation state management

### `WebViewConfig`
Environment-aware configuration system:
- Dynamic base URL construction
- Environment-specific settings
- Route management
- Utility functions for URL construction

## 🌍 Environment Management

### Setting Up Different Environments

1. **Development Environment:**
   ```env
   EXPO_PUBLIC_ENV=dev
   EXPO_PUBLIC_BASE_DOMAIN=ondoctor365.com
   ```
   Points to: `https://dev.ondoctor365.com`

2. **Staging Environment:**
   ```env
   EXPO_PUBLIC_ENV=staging
   EXPO_PUBLIC_BASE_DOMAIN=ondoctor365.com
   ```
   Points to: `https://staging.ondoctor365.com`

3. **Production Environment:**
   ```env
   EXPO_PUBLIC_ENV=prod
   EXPO_PUBLIC_BASE_DOMAIN=ondoctor365.com
   ```
   Points to: `https://ondoctor365.com`

### Environment-Specific Features

- **Development**: Extended timeouts, console logging, no caching
- **Staging**: Production-like settings with moderate timeouts
- **Production**: Optimized caching, shorter timeouts, minimal logging

## 📝 Configuration

### Adding New Routes

1. Add the route to `constants/WebViewConfig.ts`:
   ```typescript
   ROUTES: {
     // ... existing routes
     NEW_ROUTE: '/new-route',
   }
   ```

2. Create a new screen component in `app/(drawer)/`:
   ```tsx
   import React from 'react';
   import { AppWebView } from '@/components/AppWebView';
   import { WebViewConfig } from '@/constants/WebViewConfig';

   export default function NewScreen() {
     return (
       <AppWebView 
         baseUrl={WebViewConfig.BASE_URL}
         route={WebViewConfig.ROUTES.NEW_ROUTE}
         headerTitle="New Screen"
       />
     );
   }
   ```

3. Add the screen to the drawer navigation in `app/(drawer)/_layout.tsx`

### Changing Base Domain

Simply update the `EXPO_PUBLIC_BASE_DOMAIN` in your `.env` file:
```env
EXPO_PUBLIC_BASE_DOMAIN=your-new-domain.com
```


### Limitations to Consider
- Network dependency
- Limited offline functionality
- Performance constraints

This architecture provides the best of both worlds: native navigation and performance with web application flexibility, while supporting multiple deployment environments.
