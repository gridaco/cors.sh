import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "react-hot-toast";
import '../globals.css'
import GoogleAnalytics from '@/components/ga';
import ChatwootWidget from "@/components/chatwoot";
import { Heading, Link, Theme } from '@radix-ui/themes';
import { GearIcon, GitHubLogoIcon, MagnifyingGlassIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s - Console - CORS.SH',
    default: 'Console - CORS.SH',
  },
  description: "One CORS Proxy you'll ever need",
  metadataBase: new URL('https://cors.sh'),
  openGraph: {
    images: [
      "/og-image-01.jpg",
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics gaid=
            {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        <ChatwootWidget />
        <div className='selection:bg-amber-500 selection:text-amber-900'>
          <div suppressHydrationWarning>
            <Toaster position="bottom-center" />
          </div>
          <Theme hasBackground={false}>
            <div className="w-screen h-screen flex flex-row">
              <Sidebar />
              <ContentArea>
                {children}
              </ContentArea>
            </div>
          </Theme>
        </div>
      </body>
    </html>
  )
}


function Sidebar() {
  return <div className="border-r border-black/5">
    <Heading className="p-4">
      CORS.SH
    </Heading>
    <div className="flex-1 p-4 flex flex-col gap-2 min-w-[240px]">
      <NavItem href="/console">
        <GearIcon />
        Dashboard
      </NavItem>
      <NavItem href="/console/apps">
        <GearIcon />
        Apps
      </NavItem>
      <NavItem href="/console/events">
        <GearIcon />
        Events
      </NavItem>
      <NavItem href="https://github.com/gridaco/cors.sh" target="_blank">
        <GitHubLogoIcon />
        Github
      </NavItem>
    </div>
  </div>
}

function NavItem({ children, ...props }: React.PropsWithChildren<React.ComponentProps<typeof Link>>) {
  return (
    <Link
      className="flex flex-row items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
      {...props}
    >
      {children}
    </Link>
  )
}


function ContentArea({ children }: React.PropsWithChildren<{}>) {
  return <div className="flex-1 flex flex-col">
    {children}
  </div>

}