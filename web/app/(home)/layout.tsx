import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
import { Toaster } from "@workspace/ui/components/sonner";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "CORS.SH — A fast & reliable CORS proxy for your frontend",
    template: "%s — CORS.SH",
  },
  description:
    "Drop the CORS errors. CORS.SH is a fast, reliable CORS proxy running on Cloudflare's edge — origin-pinned API keys, generous quotas, zero server required.",
  metadataBase: new URL("https://cors.sh"),
  openGraph: {
    images: ["/og-image-01.jpg"],
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        <Providers>
          <Toaster position="bottom-center" />
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
