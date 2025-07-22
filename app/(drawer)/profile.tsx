import { AppWebView } from '@/components/AppWebView';
import { WebViewConfig } from '@/constants/WebViewConfig';
import React from 'react';

export default function ProfileScreen() {
  return (
    <AppWebView 
      baseUrl={WebViewConfig.BASE_URL}
      route={WebViewConfig.ROUTES.PROFILE}
      headerTitle="Perfil"
    />
  );
} 