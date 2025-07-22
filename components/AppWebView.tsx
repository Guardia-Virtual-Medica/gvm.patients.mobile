import { WebViewConfig } from "@/constants/WebViewConfig";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface AppWebViewProps {
  baseUrl: string;
  route?: string;
  onNavigationStateChange?: (navState: WebViewNavigation) => void;
  onMessage?: (event: WebViewMessageEvent) => void;
  injectedJavaScript?: string;
  showHeader?: boolean;
  headerTitle?: string;
}

export const AppWebView: React.FC<AppWebViewProps> = ({
  baseUrl,
  route = "",
  onNavigationStateChange,
  onMessage,
  injectedJavaScript,
  showHeader = false,
  headerTitle,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const fullUrl = route ? `${baseUrl}${route}` : baseUrl;

  // Handle hardware back button on Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };

      if (Platform.OS === "android") {
        const subscription = BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress
        );
        return () => subscription.remove();
      }
    }, [canGoBack])
  );

  const handleWebViewError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView Error:", nativeEvent);
    setError(`Failed to load: ${nativeEvent.description}`);
    setLoading(false);
  }, []);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCanGoBack(navState.canGoBack);
      onNavigationStateChange?.(navState);
    },
    [onNavigationStateChange]
  );

  const handleHttpError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn("WebView HTTP Error:", nativeEvent);
    if (nativeEvent.statusCode >= 400) {
      setError(`HTTP Error: ${nativeEvent.statusCode}`);
    }
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  // Enhanced JavaScript injection for better web app integration
  const enhancedInjectedJS = `
    // Disable zoom
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', viewport.content + ', user-scalable=no');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // Prevent context menu on long press
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Add native app identifier
    window.isNativeApp = true;
    window.platform = '${Platform.OS}';

    // Custom error handler
    window.addEventListener('error', (e) => {
      window.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'error',
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
      }));
    });

    ${WebViewConfig.INJECTED_JAVASCRIPT || ""}
    
    true; // Note: this is required, or you'll sometimes get silent failures
  `;

  if (error) {
    return (
      <ThemedView style={styles.container}>
        {showHeader && (
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle">{headerTitle}</ThemedText>
          </ThemedView>
        )}
        <View style={styles.errorContainer}>
          <ThemedText type="title">Connection Error</ThemedText>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <ThemedText style={styles.retryButton} onPress={retry}>
            Tap to Retry
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {showHeader && (
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">{headerTitle}</ThemedText>
        </ThemedView>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: fullUrl }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleWebViewError}
        onHttpError={handleHttpError}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        allowsBackForwardNavigationGestures={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        startInLoadingState={false}
        injectedJavaScript={enhancedInjectedJS}
        // Security settings
        allowsFullscreenVideo={true}
        allowFileAccess={false}
        allowsLinkPreview={false}
        // Performance optimizations
        androidLayerType="hardware"
        cacheEnabled={true}
        incognito={false}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1000,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#666",
  },
  retryButton: {
    color: "#0066cc",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
