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
    <header className="p-4 hover:bg-gray-500/10">
      <div className='h-10'>
        <Link href='/console'>
          <Image
            src="/logo.svg"
            alt="CORS.SH"
            width={100}
            height={32} />
        </Link>
      </div>
    </header>
    <div className="flex-1 p-4 flex flex-col gap-2 min-w-[240px]">
      <NavItem href="/console">
        <HomeIcon />
        Dashboard
      </NavItem>
      <NavItem href="/console/apps">
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


function ContentArea({ children }: React.PropsWithChildren<{}>) {
  return <div className="flex-1 flex flex-col">
    {children}
  </div>

}