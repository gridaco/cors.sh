import plans_live from "@/k/plans.json";
import plans_test from "@/k/plans.test.json";

export const plans =
  process.env.NODE_ENV === "production" ? plans_live : plans_test;

const price_pro_monthly = {
  ...plans.pro2,
  desc2: "Pro - Monthly",
} as const;

const price_pro_yearly = {
  ...plans.pro2,
  desc2: "Pro - Save 25% with Annual billing",
} as const;

// const enterprise_yearly: Price = {
//   id: plans.enterprise.id,
//   name: "Enterprise",
//   price: "$499",
//   unit: "Year",
//   features: [
//     "Up to 10,000,000 requests per month",
//     "1TB Bandwidth",
//     "Unlimited Projects",
//     "No hourly request limit",
//     "Max 6mb per request",
//   ],
// };
