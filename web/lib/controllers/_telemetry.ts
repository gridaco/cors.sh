import { Application, OnboardingApplication } from "@/types/app";
import { slack, blocks } from "../clients/slack";
import { supabase } from "../supabase";

export async function logNewOnboardingProc(data: OnboardingApplication) {
  const { count } = await supabase.from("applications_onboarding").select("*", {
    count: "exact",
    head: true,
  });

  const { id, name, email } = data;
  const title = `New Onboarding Application`;
  const dataToLog = {
    name,
    email,
    total: count,
  };
  const message = blocks({ title, data: dataToLog });
  await slack({ blocks: message });
}

export async function logNewApplication(data: Application) {
  const { count } = await supabase.from("applications").select("*", {
    count: "exact",
    head: true,
  });

  const { name } = data;
  const title = `New Application`;
  const dataToLog = {
    name,
    total: count,
  };
  const message = blocks({ title, data: dataToLog });
  await slack({ blocks: message });
}
