import { Polar } from '@polar-sh/sdk';

if (!process.env.POLAR_ACCESS_TOKEN) {
  throw new Error('POLAR_ACCESS_TOKEN is not set');
}

if (!process.env.POLAR_ORG_ID) {
  throw new Error('POLAR_ORG_ID is not set');
}

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

export const POLAR_ORG_ID = process.env.POLAR_ORG_ID;

export const POLAR_PRODUCT_IDS = {
  free: process.env.SOLO_FREE_ID!,
  basics: process.env.STUDIO_BASICS_ID!,
  pro: process.env.STUDIO_PRO_ID!,
  enterprise: process.env.STUDIO_ENTERPRISE_ID!,
} as const;

// Helper to get product ID by tier
export function getProductIdForTier(tier: 'free' | 'basics' | 'pro' | 'enterprise'): string {
  return POLAR_PRODUCT_IDS[tier];
}
