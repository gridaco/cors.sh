export async function getCustomerWithEmail(email: string) {
  return await prisma.customer.findUnique({
    where: { email },
  });
}

export async function createCustomer({
  stripe_customer_id,
  email,
}: {
  stripe_customer_id: string;
  email: string;
}) {
  // const { data } = await supabase
  //   .from("customers")
  //   .insert({
  //     stripe_id: stripe_customer_id as string,
  //     email: email,
  //     email_verified: false,
  //   })
  //   .select();
  // const customer = data![0];

  const customer = await prisma.customer.create({
    data: {
      stripeId: stripe_customer_id as string,
      email: email,
      emailVerified: false,
    },
  });

  return customer;
}
