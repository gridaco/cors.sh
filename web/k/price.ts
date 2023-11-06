const _PRICE_PERSONAL_PRO_MONTHLY = {
  test: "price_1Lda7UAvR3geCh5rVaajCSw6",
  live: "price_1LbnTwAvR3geCh5rZm9v8CAy",
} as const;

const _PRICE_PERSONAL_PRO_YEARLY = {
  test: "price_1MMpznAvR3geCh5ro9O4Gdlt",
  live: "price_1LbnV4AvR3geCh5rMEwJ5Zf1",
};

const _PRICE_ENTERPRISE_PRO_YEARLY = {
  test: "price_1MNTfvAvR3geCh5rV0KueWOk",
  live: "price_1MNTlpAvR3geCh5r3gqzq2s7",
};

const _PRICE_FREE = "price_1KeF2VAvR3geCh5rq6s4V2P1";

export const PRICE_PERSONAL_PRO_MONTHLY =
  process.env.NODE_ENV === "production"
    ? _PRICE_PERSONAL_PRO_MONTHLY.live
    : _PRICE_PERSONAL_PRO_MONTHLY.test;

export const PRICE_PERSONAL_PRO_YEARLY =
  process.env.NODE_ENV === "production"
    ? _PRICE_PERSONAL_PRO_YEARLY.live
    : _PRICE_PERSONAL_PRO_YEARLY.test;

export const PRICE_ENTERPRISE_PRO_YEARLY =
  process.env.NODE_ENV === "production"
    ? _PRICE_ENTERPRISE_PRO_YEARLY.live
    : _PRICE_ENTERPRISE_PRO_YEARLY.test;

export const PRICE_PAY_AS_YOU_GO = "price_1LegsaAvR3geCh5rBCiuVmDt";

export const PRICE_FREE_MONTHLY = _PRICE_FREE;

interface Price {
  id: string;
  name: string;
  description?: string;
  price: string;
  unit?: string;
  features: string[];
}

const price_free: Price = {
  id: PRICE_FREE_MONTHLY,
  name: "For Testing",
  price: "Free",
  features: [
    "10,000 requests per month",
    "5GB traffic per month",
    "100 requests per hour",
    "2 Projects",
    "3mb per request",
  ],
};

const price_pro_monthly: Price = {
  id: PRICE_PERSONAL_PRO_MONTHLY,
  name: "Pro - Monthly",
  price: "$4",
  unit: "Month",
  features: [
    "Up to 500,000 requests per month",
    "500GB Bandwidth",
    "Unlimited Projects",
    "No hourly request limit",
    "Max 6mb per request",
  ],
};

const price_pro_yearly: Price = {
  id: PRICE_PERSONAL_PRO_YEARLY,
  name: "Pro - Save 25% with Annual billing",
  price: "$36",
  unit: "Year",
  features: [
    "Up to 500,000 requests per month",
    "500GB Bandwidth",
    "Unlimited Projects",
    "No hourly request limit",
    "Max 6mb per request",
  ],
};

const enterprise_yearly: Price = {
  id: PRICE_ENTERPRISE_PRO_YEARLY,
  name: "Enterprise",
  price: "$499",
  unit: "Year",
  features: [
    "Up to 10,000,000 requests per month",
    "1TB Bandwidth",
    "Unlimited Projects",
    "No hourly request limit",
    "Max 6mb per request",
  ],
};

const price_pay_as_you_go: Price = {
  id: PRICE_PAY_AS_YOU_GO,
  name: "For Production projects",
  description: "From $10 / month",
  price: "Pay as you go",
  features: [
    "5,000,000 requests / month included",
    "Unlimited Bandwidth",
    "$1 per every next 100,000 requests",
    "Unlimited Projects",
    "No hourly request limit",
    "Max 6mb per request",
  ],
};

export const prices: Price[] = [
  // price_free,
  price_pro_monthly,
  price_pro_yearly,
  // enterprise_yearly,
  // price_pay_as_you_go,
];
