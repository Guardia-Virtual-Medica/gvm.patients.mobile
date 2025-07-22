import { Platform } from "react-native";

// Environment configuration
const ENV = process.env.EXPO_PUBLIC_ENV;
const BASE_DOMAIN = process.env.EXPO_PUBLIC_BASE_DOMAIN;

// Construct base URL dynamically based on environment
const constructBaseUrl = (
  env: string | undefined,
  domain: string | undefined
): string => {
  return `https://${env}.${domain}`;
};

export const WebViewConfig = {
  // Dynamic base URL based on environment
  BASE_URL: constructBaseUrl(ENV, BASE_DOMAIN),

  // Environment info
  ENVIRONMENT: {
    ENV,
    BASE_DOMAIN,
    IS_DEV: ENV === "pacientes-dev",
    IS_STAGING: ENV === "pacientes-staging",
    IS_PROD: ENV === "pacientes",
  },

  // Common routes for your application
  ROUTES: {
    HOME: "/",
    PROFILE: "/perfil",
    STUDIES: "/mis-estudios",
    APPOINTMENTS: "/mis-turnos",
    MEDICAL_RECORDS: "/historial-medico",
    ORDERS_AND_RECEIPTS: "/recetas-ordenes",
    HISTORY: "/consultas-anteriores",
    HELP: "/ayuda-soporte",
  },

  // Performance and security settings
  SETTINGS: {
    // Security
    javaScriptEnabled: true,
    domStorageEnabled: true,
    allowFileAccess: false,
    allowsLinkPreview: false,

    // Performance
    cacheEnabled: true,
    androidLayerType: "hardware" as const,
    incognito: false,

    // UI/UX
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    allowsBackForwardNavigationGestures: Platform.OS === "ios",
    startInLoadingState: false,

    // Media
    allowsInlineMediaPlayback: true,
    allowsFullscreenVideo: true,
    mediaPlaybackRequiresUserAction: false,

    // Network
    mixedContentMode: "compatibility" as const,
    scalesPageToFit: true,
  },

  // User agent string to identify your app and environment
  USER_AGENT: `PatientsMobileApp/${Platform.OS}/${ENV}`,

  // Timeout settings (adjust based on environment)
  TIMEOUTS: {
    loadTimeout: ENV === "dev" ? 15000 : 10000, // Longer timeout for dev
    navigationTimeout: ENV === "dev" ? 20000 : 15000,
  },

  // JavaScript injection for better integration
  INJECTED_JAVASCRIPT: `
    // Function to hide the navbar - targeting the correct element structure
    function hideNavbar() {
      console.log('Attempting to hide navbar...');
      
      // Primary target: the exact navbar container with css-ojctrn class
      const navbarContainer = document.querySelector('div.css-ojctrn');
      if (navbarContainer) {
        navbarContainer.style.display = 'none';
        console.log('Navbar hidden via css-ojctrn class');
        return;
      }

      // Secondary target: find by the specific structure you provided
      const containers = document.querySelectorAll('div');
      containers.forEach(container => {
        // Look for the specific structure: container with MuiBox-root css-8uvz8l containing logo
        const logoBox = container.querySelector('div.MuiBox-root.css-8uvz8l > img[alt="ondoctor365-logo"]');
        const logoutBox = container.querySelector('div.MuiBox-root.css-1a9getn > button.MuiButtonBase-root.MuiIconButton-root');
        
        if (logoBox && logoutBox) {
          container.style.display = 'none';
          console.log('Navbar hidden via structure detection');
          return;
        }
      });

      // Tertiary target: find by logo and logout button combination
      const logoElement = document.querySelector('img[alt="ondoctor365-logo"]');
      if (logoElement) {
        // Walk up the DOM tree to find the main container
        let parent = logoElement.parentElement;
        while (parent && parent !== document.body) {
          // Check if this parent contains both logo and logout button
          const hasLogo = parent.querySelector('img[alt="ondoctor365-logo"]');
          const hasLogout = parent.querySelector('svg[data-testid="LogoutOutlinedIcon"]');
          
          if (hasLogo && hasLogout) {
            parent.style.display = 'none';
            console.log('Navbar hidden via parent traversal');
            break;
          }
          parent = parent.parentElement;
        }
      }
    }

    // More aggressive CSS targeting the specific structure
    function injectNavbarHidingCSS() {
      const style = document.createElement('style');
      style.id = 'navbar-hiding-styles';
      style.textContent = \`
        /* Hide the main navbar container */
        div.css-ojctrn {
          display: none !important;
        }
        
        /* Hide container with the specific logo */
        div:has(> div.MuiBox-root.css-8uvz8l > img[alt="ondoctor365-logo"]) {
          display: none !important;
        }
        
        /* Hide any div containing both logo and logout button */
        div:has(img[alt="ondoctor365-logo"]):has(svg[data-testid="LogoutOutlinedIcon"]) {
          display: none !important;
        }
        
        /* Target the specific MUI structure */
        div.MuiBox-root.css-8uvz8l:has(img[alt="ondoctor365-logo"]) {
          display: none !important;
        }
        
        /* Hide parent of logo container if it contains logout */
        div:has(> div.MuiBox-root.css-8uvz8l img[alt="ondoctor365-logo"]):has(div.MuiBox-root.css-1a9getn) {
          display: none !important;
        }
        
        /* Fallback: hide any element with the exact button structure */
        div:has(button.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-mfslm7 svg[data-testid="LogoutOutlinedIcon"]) {
          display: none !important;
        }
        
        /* Ensure no top padding/margin compensation */i
        body {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        
        /* Hide the entire navigation area */
        header, nav, [role="banner"] {
          display: none !important;
        }
      \`;
      
      // Remove existing style if present
      const existingStyle = document.getElementById('navbar-hiding-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      document.head.appendChild(style);
      console.log('Navbar hiding CSS injected');
    }

    // Execute immediately
    injectNavbarHidingCSS();
    hideNavbar();

    // Execute when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        injectNavbarHidingCSS();
        hideNavbar();
      });
    }

    // Monitor for dynamic changes (SPA navigation, etc.)
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes might be the navbar
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              const element = node;
              if (element.classList?.contains('css-ojctrn') || 
                  element.querySelector?.('img[alt="ondoctor365-logo"]') ||
                  element.querySelector?.('svg[data-testid="LogoutOutlinedIcon"]')) {
                shouldCheck = true;
              }
            }
          });
        }
      });
      
      if (shouldCheck) {
        setTimeout(() => {
          injectNavbarHidingCSS();
          hideNavbar();
        }, 100);
      }
    });

    // Start observing with more specific configuration
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      attributeOldValue: false,
      characterData: false,
      characterDataOldValue: false
    });

    // Disable zoom and selection for better mobile experience
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', viewport.content + ', user-scalable=no, maximum-scale=1.0');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // Disable text selection and context menu for native app feel
    document.addEventListener('selectstart', e => e.preventDefault());
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Add platform and environment information to window object
    window.isNativeApp = true;
    window.platform = '${Platform.OS}';
    window.environment = '${ENV}';
    window.appVersion = '1.0.0';

    // Prevent accidental double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Custom error logging with environment context
    window.addEventListener('error', (e) => {
      window.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'error',
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        environment: '${ENV}',
        timestamp: new Date().toISOString()
      }));
    });

    // Enhanced console logging for development
    if ('${ENV}' === 'pacientes-dev') {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = function(...args) {
        originalLog.apply(console, args);
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'console.log',
          message: args.join(' '),
          environment: '${ENV}',
          timestamp: new Date().toISOString()
        }));
      };

      console.error = function(...args) {
        originalError.apply(console, args);
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'console.error',
          message: args.join(' '),
          environment: '${ENV}',
          timestamp: new Date().toISOString()
        }));
      };

      console.warn = function(...args) {
        originalWarn.apply(console, args);
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'console.warn',
          message: args.join(' '),
          environment: '${ENV}',
          timestamp: new Date().toISOString()
        }));
      };
    }

    true; // Required for injected JavaScript
  `,

  // Headers for better caching and security
  HEADERS: {
    "Cache-Control": ENV === "dev" ? "no-cache" : "max-age=3600",
    "X-Requested-With": `PatientsMobileApp-${ENV}`,
    "X-Environment": ENV,
  },

  // Utility function to get full URL for a route
  getFullUrl: (route: string = ""): string => {
    return `${constructBaseUrl(ENV, BASE_DOMAIN)}${route}`;
  },
};
