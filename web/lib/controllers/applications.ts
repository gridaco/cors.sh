import { prisma, stripe, emailWithTemplate } from "../clients";
import { sign_live_key, sign_temporary_key, sign_test_key } from "../keygen";
import { nanoid } from "nanoid";
import type { Application, OnboardingApplications } from "@prisma/client";
import sync from "../sync";
import { logNewOnboardingProc, logNewApplication } from "./_telemetry";

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

  const { key: tmpkey, expires_at } = sign_temporary_key();

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
        expiresAt: expires_at.toDate(),
        priceId,
      },
    });
  }

  if (email_available && send_onboarding_email_if_possible) {
    // send an email to the user
    const res = await sendOnboardingEmail(email, data);
    console.log("email sent", res);
  }

  // log event to slack
  try {
    !duplicated && (await logNewOnboardingProc(data));
  } catch (e) {
    console.error("failed to log new onboarding application", e); // not critical
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

export async function getOnboardingApplication(id: string) {
  return await prisma.onboardingApplications.findUnique({
    where: { id: id },
    select: {
      // omit private data
      id: true,
      name: true,
      email: true,
      allowedOrigins: true,
      priceId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
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

export async function signApplication(application: Application) {
  //
  const { key: apikey_test } = sign_test_key(application.signature_test);
  const { key: apikey_live } = sign_live_key(application.signature_live);

  const payload = {
    ...application,
    apikey_test,
    apikey_live,
  };

  return payload;
}

export async function createApplication({
  id,
  name,
  allowedOrigins,
  owner,
}: {
  id?: string;
  name: string;
  allowedOrigins?: string[];
  owner: { id: string };
}) {
  const placeholder_test = nanoid(10);
  const placeholder_live = nanoid(10);

  const application = await prisma.application.create({
    data: {
      id: id,
      name: name,
      signature_test: placeholder_test,
      signature_live: placeholder_live,
      allowedOrigins: allowedOrigins ?? [],
      owner: {
        connect: {
          id: owner.id,
        },
      },
    },
  });

  const salt_test = nanoid(10);
  const salt_live = nanoid(10);
  const signature_test = application.id + salt_test;
  const signature_live = application.id + salt_live;

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: {
      signature_test,
      signature_live,
    },
  });

  // once application is created and initially signed, sync to the keys table
  await sync(updated);

  return updated;
}

export async function convertApplication({
  onboarding_id,
  checkout_session_id,
}: {
  onboarding_id: string;
  checkout_session_id: string;
}) {
  const checkout_session = await stripe.checkout.sessions.retrieve(
    checkout_session_id as string
  );

  const { customer: stripe_customer } = checkout_session;
  const stripe_customer_id =
    typeof stripe_customer === "string" ? stripe_customer : stripe_customer.id;

  const customer = await prisma.customer.findUnique({
    where: { stripeId: stripe_customer_id },
  });

  // place this right before application create since its a delete and cannot be undone. (reduce chance of error when it fails)
  const tmp = await prisma.onboardingApplications.delete({
    where: { id: onboarding_id as string },
  });

  const application = await createApplication({
    id: tmp.id,
    name: tmp.name || "Untitled",
    allowedOrigins: tmp.allowedOrigins,
    owner: { id: customer.id },
  });

  const signed = await signApplication(application);

  // once application is created and initially signed, sync to the keys table
  await sync(application);

  // send email to the user
  try {
    await emailWithTemplate(
      customer.email,
      `mail_cors_sh_onboarding_with_payment_success_${process.env.STAGE}`,
      {
        APPLICATIONNAME: tmp.name,
        CODE_LIVE: signed.apikey_live,
        CODE_TEST: signed.apikey_test,
      }
    );
    console.log("email sent", true);
    //   // set email verified to true?
  } catch (e) {
    console.error("email failed", e);
  }

  // log event to slack
  try {
    await logNewApplication(signed);
  } catch (e) {
    console.error("failed to log new application", e); // not critical
  }

  return application;
}
