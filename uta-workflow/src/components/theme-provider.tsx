"use client";

import type React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

// We're using a hardcoded dark theme in the HTML element, so this is just a wrapper
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>;
}
