import { HomeHoverCard1 } from '@/components/home-hover-card'

export default function Home() {
  return (
    <main className="max-w-screen-xl m-auto flex min-h-screen flex-col justify-center p-4">
      <div className='flex flex-row gap-20 justify-between'>
        <div className='flex flex-col gap-16 justify-center max-w-lg'>
          <div className='flex flex-col gap-5 max-w-lg'>
            <h1 className='text-7xl font-black'>
              <span className='bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent'
                style={{
                  display: 'inline-block'
                }}
              >
                CORS.SH -<br />
                CORS PROXY
              </span>
            </h1>
            <p className='text-xl font-regular opacity-70' style={{
              lineHeight: '137%'
            }}>
              Sick of cors errors? CORS.SH, A fast & reliable cors proxy for your websites here for the rescue.
            </p>
          </div>
          <form className='flex flex-row gap-3'>
            <input
              className='p-5 text-neutral-100 bg-neutral-900 rounded-sm outline-none focus:outline-neutral-900 flex-1'
              placeholder='alice@acme.com' />
            <button
              className='p-2 pl-6 pr-6 border-neutral-900 border-2 rounded-sm text-md'
            >Send me an<br />API Key</button>
          </form>

        </div>
        <div>
          <HomeHoverCard1 />

        </div>
      </div>
    </main>
  )
}
