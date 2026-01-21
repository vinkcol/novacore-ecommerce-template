import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foodie - Delicias a tu puerta",
  description: "Tu menú digital favorito con pedidos directos por WhatsApp",
  icons: {
    icon: "/favicon.png",
  },
};

import { Toaster } from "sonner";
import { FloatingWhatsApp } from "@/components/organisms/FloatingWhatsApp/FloatingWhatsApp";
import { ThemeApplicator } from "@/features/configuration/components/ThemeApplicator";

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('vink-theme');
    if (stored) {
      var theme = JSON.parse(stored);
      var root = document.documentElement;
      if (theme.primaryColor) {
        root.style.setProperty('--primary', theme.primaryColor);
        root.style.setProperty('--ring', theme.primaryColor);
        root.style.setProperty('--secondary-foreground', theme.primaryColor);
      }
      if (theme.primaryForeground) {
        root.style.setProperty('--primary-foreground', theme.primaryForeground);
      }
      if (theme.radius) {
        root.style.setProperty('--radius', theme.radius);
      }
      window.__THEME_APPLIED__ = true;
    }
  } catch (e) {}
})();
`;

import { AuthProvider } from "@/features/auth/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <ThemeApplicator>
              {children}
              <Toaster
                position="top-right"
                richColors
                expand={false}
                toastOptions={{
                  style: {
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                  },
                  className: 'font-sans font-medium',
                }}
              />
              <FloatingWhatsApp />
            </ThemeApplicator>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
