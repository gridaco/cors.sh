import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
// import { isProUser } from "@/s/q-user";
import { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
  }, [supabase]);

  if (!user) return null;

  return {
    ...user,
    // isPro: user && isProUser(user),
  };
}
