import Image from 'next/image'
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { HomeHoverCard } from '@/components/home-hover-card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          CORS.SH
        </p>
        <div className='flex gap-4'>
          <a>
            Example
          </a>
          <a>
            Usage
          </a>
        </div>

        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className='flex gap-4'>
            <a>
              Playground
            </a>
            <a>
              Pricing
            </a>
            <a>
              Get Started
            </a>

          </div>
          <div style={{ width: 40 }} />
          <GitHubLogoIcon />
        </div>
      </div>

      <div className='flex flex-row gap-4'>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 max-w-lg'>
            <h1 className='text-4xl font-bold'>
              CORS.SH -<br />
              CORS PROXY
            </h1>

            <p className='text-lg font-regular'>
              Sick of cors errors? CORS.SH, A fast & reliable cors proxy for your websites here for the rescue.
            </p>
          </div>
          <div className='flex flex-row gap-5'>
            <input
              className='p-4'
              placeholder='alice@acme.com' />
            <button>Send me an<br />API Key</button>
          </div>

        </div>
        <div>
          <HomeHoverCard />

        </div>
      </div>
    </main>
  )
}
