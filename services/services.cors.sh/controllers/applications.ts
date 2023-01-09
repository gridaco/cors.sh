import { prisma, emailWithTemplate } from "../clients";
import { sign_temporary_key } from "../keygen";
import { nanoid } from "nanoid";
import type { OnboardingApplications } from "@prisma/client";

type CreateOnboardingApplicationBody =
  | {
      type: "with-form";
      name: string;
      allowedOrigins: string[];
      priceId: string;
    }
  | {
      type: "with-email";
      email: string;
    };

export async function createOnboardingApplication(
  body: CreateOnboardingApplicationBody,
  send_onboarding_email_if_possible: boolean = true
) {
  let email_available = false;
  let email: string;
  let name: string;
  let allowedOrigins: string[];
  let priceId: string;

  switch (body.type) {
    case "with-email": {
      email = body.email;
      name = "My first cors.sh app";
      email_available = true;
      break;
    }
    case "with-form": {
      email = `${nanoid(10)}@unknown-users.cors.sh`;
      name = body.name;
      allowedOrigins = body.allowedOrigins;
      priceId = body.priceId;
      break;
    }
  }

  const tmpkey = sign_temporary_key(email);

  let data: OnboardingApplications;

  // check if email exists
  let duplicated: OnboardingApplications | null = null;
  if (email_available) {
    duplicated = await prisma.onboardingApplications.findUnique({
      where: { email: email },
    });
  }

  // if duplicated, update the existing one with the new key.
  if (duplicated) {
    // if the last interaction is within 5 minutes, ignore the request
    if (duplicated.updatedAt) {
    }
    data = await prisma.onboardingApplications.update({
      where: { id: duplicated.id },
      data: {
        // this will be renewed since the signature contains the expiration time
        key: tmpkey,
      },
    });
  } else {
    data = await prisma.onboardingApplications.create({
      data: {
        key: tmpkey,
        email: email,
        name: name,
        allowedOrigins: allowedOrigins ?? [],
        priceId,
      },
    });
  }

  if (email_available && send_onboarding_email_if_possible) {
    // send an email to the user
    await sendOnboardingEmail(email, data);
  }

  return {
    id: data.id,
    // omit the key since it also works as a verification code for faster signup
    // key: "omitted"
    email: data.email,
    name: data.name,
    allowedOrigins: data.allowedOrigins,
    priceId: data.priceId,
  };
}

async function sendOnboardingEmail(
  email: string,
  application?: OnboardingApplications
) {
  if (!application) {
    application = await prisma.onboardingApplications.findUnique({
      where: { email: email },
    });
  }

  if (!application) {
    return false;
  }

  const { key, emailSentAt } = application;

  // if the last interaction is within 1 minutes, ignore the request
  if (emailSentAt && emailSentAt.length > 0) {
    const lastSentAt = emailSentAt[emailSentAt.length - 1];
    if (lastSentAt) {
      const diff = new Date().getTime() - lastSentAt.getTime();
      if (diff < 60000) {
        return false;
      }
    }
  }

  // sls stage

  await emailWithTemplate(
    email,
    `mail_cors_sh_onboarding_${process.env.STAGE}`,
    {
      CODE: key,
      ONBOARDINGLINK: `https://cors.sh/onboarding/${application.id}`,
    }
  );

  // update the tmp app
  await prisma.onboardingApplications.update({
    where: { id: application.id },
    data: {
      emailSentAt: {
        push: new Date(),
      },
    },
  });

  return true;
}

function convertToVerifiedApplication() {
  // onboarding: OnboardingApplication,
  // checkout_session_id: string
}