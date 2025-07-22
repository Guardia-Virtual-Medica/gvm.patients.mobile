import { AppWebView } from "@/components/AppWebView";
import { WebViewConfig } from "@/constants/WebViewConfig";
import React from "react";

export default function DashboardScreen() {
  return (
    <AppWebView
      baseUrl={WebViewConfig.BASE_URL}
      route={WebViewConfig.ROUTES.HOME}
      headerTitle="Inicio"
    />
  );
}
