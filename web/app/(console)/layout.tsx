import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "@workspace/ui/components/sonner";
import ChatwootWidget from "@/components/chatwoot";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Console - CORS.SH",
    default: "Console - CORS.SH",
  },
  description: "One CORS Proxy you'll ever need",
  metadataBase: new URL("https://cors.sh"),
  openGraph: {
    images: ["/og-image-01.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} font-sans antialiased selection:bg-amber-500 selection:text-amber-900`}
      >
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        <ChatwootWidget />
        <Providers>
          <Toaster position="bottom-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
