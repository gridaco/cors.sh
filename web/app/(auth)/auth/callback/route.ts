import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect_uri } from "@/lib/q";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.nextUrl.origin;
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else {
    return NextResponse.redirect(host + "/signin");
  }

  const { data } = await supabase.auth.getUser();

  const _redirect_uri = redirect_uri.parse(request.nextUrl.searchParams);

  if (_redirect_uri) {
    return NextResponse.redirect(
      redirect_uri.abs({
        host,
        redirect_uri: _redirect_uri,
      })
    );
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(host + "/");
}
