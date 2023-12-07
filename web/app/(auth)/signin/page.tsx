"use client";
import React from "react";
import { createBrowserClient } from '@supabase/ssr'
import { Dela_Gothic_One } from "next/font/google";
// import { ContinueWithGoogleButton } from "@/components/continue-with-google-button";
import { useSearchParams } from "next/navigation";
import { redirect_uri } from "@/lib/q";
import useHost from "@/hooks/useHost";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

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

  const onsigninclick = () => {
    // Note: thr url must be white-listed on supabase config, like, e.g.
    // - http://localhost:8823/*
    // - https://cors.sh/*
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirect?.toString(),
      },
    });
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen gap-4 text-white">
      <h1 className="text-6xl">
        <span className={delta_gothic_one.className}>CORS.SH</span>
      </h1>
      <p className="opacity-50">Make your next big Idea real</p>
      <button onClick={onsigninclick}>
        Continue with Google
      </button>
      {/* <ContinueWithGoogleButton  /> */}
    </main>
  );
}
