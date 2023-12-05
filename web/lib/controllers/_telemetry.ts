import type { OnboardingApplications, Application } from "@prisma/client";
import { prisma } from "../clients";
import { slack, blocks } from "../clients/slack";

export async function logNewOnboardingProc(data: OnboardingApplications) {
  const total = await prisma.onboardingApplications.count();
  const { id, name, email } = data;
  const title = `New Onboarding Application`;
  const dataToLog = {
    name,
    email,
    total,
  };
  const message = blocks({ title, data: dataToLog });
  await slack({ blocks: message });
}

export async function logNewApplication(data: Application) {
  const total = await prisma.application.count();
  const { name } = data;
  const title = `New Application`;
  const dataToLog = {
    name,
    total,
  };
  const message = blocks({ title, data: dataToLog });
  await slack({ blocks: message });
}
