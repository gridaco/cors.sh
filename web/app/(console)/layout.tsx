import Image from 'next/image'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "react-hot-toast";
import GoogleAnalytics from '@/components/ga';
import ChatwootWidget from "@/components/chatwoot";
import { Heading, Link, Theme } from '@radix-ui/themes';
import { FileTextIcon, GearIcon, GitHubLogoIcon, HomeIcon, LayersIcon, LightningBoltIcon, MagnifyingGlassIcon, OpenInNewWindowIcon, QuestionMarkCircledIcon, RocketIcon } from '@radix-ui/react-icons';
import '../globals.console.css'


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
        <Toaster position="bottom-center" />
        <Theme hasBackground={false}>
          <div className='min-h-full flex flex-col'>
            <div className="flex h-full">
              <main className='flex flex-col flex-1 w-full overflow-y-auto' style={{
                height: '100vh'
              }}>
                <div className='flex max-h-full min-h-full'>
                  <Sidebar />
                  <div className='flex flex-1 flex-col'>
                    <TopBar />
                    <div className='flex-1 flex-grow overflow-auto'>
                      {children}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </Theme>
      </body>
    </html>
  )
}


function Sidebar() {
  return <div className="h-full bg-background hide-scrollbar w-64 overflow-auto border-r border-default">
    <header className="flex h-12 max-h-12 items-center border-b px-6 border-default">
      <Link href='/console'>
        <Image
          src="/logo.svg"
          alt="CORS.SH"
          width={100}
          height={32} />
      </Link>
    </header>
    <div className="flex-1 p-4 flex flex-col gap-2 min-w-[240px]">
      <NavItem href="/console">
        <HomeIcon />
        Dashboard
      </NavItem>
      <NavItem href="/console/applications">
        <LayersIcon />
        Applications
      </NavItem>
      <NavItem href="/console/usage">
        <LightningBoltIcon />
        Usage & Plans
      </NavItem>
      <NavItem href="/docs" target="_blank">
        <FileTextIcon />
        Docs
      </NavItem>
      <NavItem href="/docs/faq" target="_blank">
        <QuestionMarkCircledIcon />
        FAQ
      </NavItem>
      <NavItem href="/console/settings">
        <GearIcon />
        Settings
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
      className="flex flex-row items-center gap-2 px-4 py-2 hover:bg-gray-500/10 rounded-md transition-colors"
      {...props}
    >
      {children}
    </Link>
  )
}


function TopBar() {
  return (
    <header className="flex h-12 max-h-12 items-center justify-between py-2 px-5 border-b border-default">
      <div>CORS</div>
    </header>
  )
}