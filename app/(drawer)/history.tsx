import { AppWebView } from '@/components/AppWebView';
import { WebViewConfig } from '@/constants/WebViewConfig';
import React from 'react';

export default function HistoryScreen() {
  return (
    <AppWebView 
      baseUrl={WebViewConfig.BASE_URL}
      route={WebViewConfig.ROUTES.HISTORY}
      headerTitle="Consultas Anteriores"
    />
  );
} 