import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { redirect } from "next/navigation";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
import { Toaster } from "@workspace/ui/components/sonner";

import "@workspace/ui/globals.css";
import { auth } from "@/auth";
import { Providers } from "@/components/providers";
import { ConsoleHeader } from "@/components/console-header";

export const metadata: Metadata = {
  title: {
    template: "%s — Console — CORS.SH",
    default: "Console — CORS.SH",
  },
  description: "Manage your CORS.SH projects, API keys, and usage.",
  metadataBase: new URL("https://cors.sh"),
  openGraph: {
    images: ["/og-image-01.jpg"],
  },
};

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  // Gate the whole console. No session → /login (with a return path back here).
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/console");

  const user = {
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    tier: session.user.tier ?? "free",
  };

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
          <ConsoleHeader user={user} />
          <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
