"use client";

import React from "react";
import { createBrowserClient } from '@supabase/ssr'
import { useSearchParams } from "next/navigation";
import { redirect_uri } from "@/lib/q";
import useHost from "@/hooks/useHost";
import Link from "next/link";

export default function SigninPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const host = useHost();
  const searchParams = useSearchParams();

  const _redirect_uri = redirect_uri.parse(searchParams!);

  const redirect = redirect_uri.make(`${host}/auth/callback`, {
    redirect_uri: _redirect_uri,
  });

  const onsigninwith_google = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirect?.toString(),
      },
    });
  };

  const onsigninwith_github = () => {

    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirect?.toString(),
      },
    });
  };

  return (
    <div className="h-screen">
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col flex-1 bg-alternative h-full">
          <div className="flex flex-1 h-full">
            <main className="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r shadow-lg bg-background border-default">
              <div className="flex-1 flex flex-col justify-center w-full max-w-sm">
                <div className="mb-10">
                  <h1 className="mt-8 mb-2 text-2xl lg:text-3xl font-bold">Welcome back</h1>
                  <p className="text-sm text-foreground-light">
                    Sign in to your account
                  </p>
                </div>
                <form className="flex flex-col gap-4 my-4">
                  <button className="rounded border py-2 px-4" onClick={onsigninwith_google}>
                    Continue with Google
                  </button>
                  <button className="rounded border py-2 px-4" onClick={onsigninwith_github}>
                    Continue with Github
                  </button>
                </form>
              </div>
              <div className="sm:text-center">
                <p className="text-xs text-foreground-lighter sm:mx-auto sm:max-w-sm">By continuing, you agree to CORS.SH&apos;s <Link className="underline hover:text-foreground-light" href="https://grida.co/terms">Terms of Service</Link> and <Link className="underline hover:text-foreground-light" href="https://grida.co/privacy">Privacy Policy</Link>, and to receive periodic emails with updates.</p>
              </div>
            </main>
            <aside className="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex">
              {/*  */}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
