import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { authMiddleware } from './lib/auth/middleware'

export async function middleware(request: NextRequest) {

  if (request.nextUrl.pathname.startsWith('/applications')) {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    await supabase_session_middleware(request, response)
    return await authMiddleware(request, response)
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  await supabase_session_middleware(request, response)

  return response
}


async function supabase_session_middleware(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
        },
      },
    }
  )

  await supabase.auth.getSession()
}