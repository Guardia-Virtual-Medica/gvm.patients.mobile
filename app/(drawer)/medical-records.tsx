import { AppWebView } from '@/components/AppWebView';
import { WebViewConfig } from '@/constants/WebViewConfig';
import React from 'react';

export default function MedicalRecordsScreen() {
  return (
    <AppWebView 
      baseUrl={WebViewConfig.BASE_URL}
      route={WebViewConfig.ROUTES.MEDICAL_RECORDS}
      headerTitle="Historial Médico"
    />
  );
} 