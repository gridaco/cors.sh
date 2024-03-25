import { supabase } from "./supabase";

export async function getCustomerWithEmail(email: string) {
  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("email", email)
    .single();

  return data;
}

export async function createCustomer({
  stripe_customer_id,
  email,
}: {
  stripe_customer_id: string;
  email: string;
}) {
  const { data: customer } = await supabase
    .from("customers")
    .insert({
      stripe_id: stripe_customer_id as string,
      email: email,
      email_verified: false,
    })
    .select()
    .single();

  return customer;
}
