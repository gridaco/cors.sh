// TODO: this is test price - replace me.
const _PRICE_PERSONAL_PRO_MONTHLY = {
  test: "price_1Lda7UAvR3geCh5rVaajCSw6",
  live: "",
} as const;

export const PRICE_PERSONAL_PRO_MONTHLY =
  process.env.NODE_ENV === "production"
    ? _PRICE_PERSONAL_PRO_MONTHLY.live
    : _PRICE_PERSONAL_PRO_MONTHLY.test;

interface Price {
  id: string;
  name: string;
  description?: string;
  price: string;
  unit?: string;
  features: string[];
}

export const prices: Price[] = [
  {
    id: "free",
    name: "For Testing",
    price: "Free",
    features: [
      "10,000 requests per month",
      "5GB traffic per month",
      "100 requests per hour",
      "2 Projects",
      "3mb per request",
    ],
  },
  {
    id: PRICE_PERSONAL_PRO_MONTHLY,
    name: "For Personal projects",
    price: "$4",
    unit: "Month",
    features: [
      "Up to 500,000 requests per month",
      "500GB Bandwidth",
      "Unlimited Projects",
      "No hourly request limit",
      "Max 6mb per request",
    ],
  },
  {
    id: "payg",
    name: "For Production projects",
    description: "From $39 / month",
    price: "Pay as you go",
    features: [
      "5,000,000 requests / month included",
      "Unlimited Bandwidth",
      "$1 per every next 100,000 requests",
      "Unlimited Projects",
      "No hourly request limit",
      "Max 6mb per request",
    ],
  },
];
