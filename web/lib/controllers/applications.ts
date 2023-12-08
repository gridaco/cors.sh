import { stripe, emailWithTemplate } from "../clients";
import { sign_live_key, sign_temporary_key, sign_test_key } from "../keygen";
import { nanoid } from "nanoid";
import sync from "../sync";
import { logNewOnboardingProc, logNewApplication } from "./_telemetry";
import { Application, OnboardingApplication } from "@/types/app";
import { supabase } from "../supabase";

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
  let allowedOrigins: string[] = [];
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

  let data: OnboardingApplication;

  // check if email exists
  let duplicated: OnboardingApplication | null = null;
  if (email_available) {
    const { data } = await supabase
      .from("applications_onboarding")
      .select("*")
      .eq("email", email)
      .single();

    duplicated = data;
  }

  // if duplicated, update the existing one with the new key.
  if (duplicated) {
    // if the last interaction is within 5 minutes, ignore the request
    if (duplicated.updated_at) {
    }

    const { data: _data } = await supabase
      .from("applications_onboarding")
      .update({ key: tmpkey })
      .eq("id", duplicated.id)
      .select()
      .single();

    data = _data;
  } else {
    const { data: _data } = await supabase
      .from("applications_onboarding")
      .insert({
        key: tmpkey,
        email: email,
        name: name,
        allowed_origins: allowedOrigins ?? [],
        expires_at: expires_at.toDate(),
        price_id: priceId,
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
    allowedOrigins: data.allowed_origins,
    priceId: data.price_id,
  };
}

export async function getOnboardingApplication(id: string) {
  const { data } = await supabase
    .from("applications_onboarding")
    .select(
      `
        id,
        name,
        email,
        allowed_origins,
        price_id,
        created_at,
        updated_at
      `
    )
    .eq("id", id)
    .single();

  return data;
}

async function sendOnboardingEmail(
  email: string,
  application?: OnboardingApplication
) {
  if (!application) {
    const { data } = await supabase
      .from("applications_onboarding")
      .select("*")
      .eq("email", email)
      .single();

    application = data;
  }

  if (!application) {
    return false;
  }

  const { key, email_sent_at } = application;

  // if the last interaction is within 1 minutes, ignore the request
  if (email_sent_at && email_sent_at.length > 0) {
    const lastSentAt = email_sent_at[email_sent_at.length - 1];
    if (lastSentAt) {
      const diff = new Date().getTime() - new Date(lastSentAt).getTime();
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
  await supabase
    .from("applications_onboarding")
    .update({
      email_sent_at: [
        ...(application.email_sent_at ?? []),
        new Date().toISOString(),
      ],
    })
    .eq("id", application.id);

  return true;
}

export async function getApplication(id: string) {
  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function getMyApplications(customerId: string) {
  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("owner_id", customerId);

  const applications = data;

  return applications;
}

export async function updateApplication(id: string, data: Application) {
  const { data: _data } = await supabase
    .from("applications")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  return data;
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
  id?: number;
  name: string;
  allowedOrigins?: string[];
  owner: { id: number };
}) {
  const placeholder_test = nanoid(10);
  const placeholder_live = nanoid(10);

  const { data: application } = await supabase
    .from("applications")
    .insert({
      id: id,
      name: name,
      signature_test: placeholder_test,
      signature_live: placeholder_live,
      allowed_origins: allowedOrigins ?? [],
      owner_id: owner.id,
    })
    .select()
    .single();

  const salt_test = nanoid(10);
  const salt_live = nanoid(10);
  const signature_test = application.id + salt_test;
  const signature_live = application.id + salt_live;

  const { data: updated } = await supabase
    .from("applications")
    .update({
      signature_test,
      signature_live,
    })
    .eq("id", application.id)
    .select()
    .single();

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

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("stripe_id", stripe_customer_id)
    .single();

  // place this right before application create since its a delete and cannot be undone. (reduce chance of error when it fails)
  const { data: tmp } = await supabase
    .from("applications_onboarding")
    .delete()
    .eq("id", onboarding_id as string)
    .select()
    .single();

  const application = await createApplication({
    id: tmp.id,
    name: tmp.name || "Untitled",
    allowedOrigins: tmp.allowed_origins,
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
