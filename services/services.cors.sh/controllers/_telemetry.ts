import type { OnboardingApplications } from "@prisma/client";
import { slack, blocks } from "../clients/slack";

export async function logNewOnboardingProc(data: OnboardingApplications) {
  const { id, name, email } = data;
  const title = `New Onboarding Application`;
  const dataToLog = {
    id,
    name,
    email,
  };
  const message = blocks({ title, data: dataToLog });
  await slack({ blocks: message });
}
