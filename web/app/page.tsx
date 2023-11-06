import { HomeHoverCard } from '@/components/home-hover-card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='flex flex-row gap-4'>

        <div className='flex flex-col gap-4 justify-center'>
          <div className='flex flex-col gap-4 max-w-lg'>
            <h1 className='text-7xl font-black'>
              <span className='bg-gradient-to-b from-white to-black bg-clip-text text-transparent'>
                CORS.SH -<br />
                CORS PROXY
              </span>
            </h1>
            <p className='text-xl font-regular opacity-70'>
              Sick of cors errors? CORS.SH, A fast & reliable cors proxy for your websites here for the rescue.
            </p>
          </div>
          <form className='flex flex-row gap-3'>
            <input
              className='p-4 text-neutral-100 bg-neutral-900 rounded-sm outline-none focus:outline-neutral-900'
              placeholder='alice@acme.com' />
            <button
              className='p-2 border-neutral-900 border-2 rounded-sm'
            >Send me an<br />API Key</button>
          </form>

        </div>
        <div>
          <HomeHoverCard />

        </div>
      </div>
    </main>
  )
}
