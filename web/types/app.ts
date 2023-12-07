import { Database } from "./supabase";

export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type OnboardingApplication =
  Database["public"]["Tables"]["applications_onboarding"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
