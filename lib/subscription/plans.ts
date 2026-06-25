export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  tagline: string;
  maxChildren: number;
  features: string[];
  recommended?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 3000,
    period: "month",
    tagline: "One-way daily transport for a single child.",
    maxChildren: 1,
    features: [
      "Morning pickup or afternoon drop",
      "Live trip tracking",
      "SMS & in-app alerts",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 5000,
    period: "month",
    tagline: "Round-trip transport with priority support.",
    maxChildren: 2,
    features: [
      "Morning pickup and afternoon drop",
      "Live trip tracking",
      "Priority support",
      "Up to 2 children",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 7500,
    period: "month",
    tagline: "Full coverage for families with multiple children.",
    maxChildren: 3,
    features: [
      "Round-trip transport for up to 3 children",
      "Live trip tracking",
      "24/7 priority support",
      "Unlimited guardians",
    ],
  },
];

export function getPlanById(id: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === id);
}

export function formatPkr(amount: number): string {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}
