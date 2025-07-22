import { AppWebView } from '@/components/AppWebView';
import { WebViewConfig } from '@/constants/WebViewConfig';
import React from 'react';

export default function OrdersAndReceiptsScreen() {
  return (
    <AppWebView 
      baseUrl={WebViewConfig.BASE_URL}
      route={WebViewConfig.ROUTES.ORDERS_AND_RECEIPTS}
      headerTitle="Recetas y Órdenes"
    />
  );
} 