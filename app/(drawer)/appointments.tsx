import { AppWebView } from '@/components/AppWebView';
import { WebViewConfig } from '@/constants/WebViewConfig';
import React from 'react';

export default function AppointmentsScreen() {
  return (
    <AppWebView 
      baseUrl={WebViewConfig.BASE_URL}
      route={WebViewConfig.ROUTES.APPOINTMENTS}
      headerTitle="Mis Turnos"
    />
  );
} 