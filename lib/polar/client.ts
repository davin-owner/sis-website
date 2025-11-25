import { Polar } from '@polar-sh/sdk';

// Lazy initialization to avoid build-time errors
let polarInstance: Polar | null = null;

export function getPolarClient(): Polar {
  if (!polarInstance) {
    if (!process.env.POLAR_ACCESS_TOKEN) {
      throw new Error('POLAR_ACCESS_TOKEN is not set');
    }

    const isSandbox = process.env.POLAR_SANDBOX === 'true';

    polarInstance = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      ...(isSandbox && { server: 'sandbox' }),
    });
  }
  return polarInstance;
}

// For backwards compatibility
export const polar = new Proxy({} as Polar, {
  get(target, prop) {
    return getPolarClient()[prop as keyof Polar];
  }
});

export function getPolarOrgId(): string {
  if (!process.env.POLAR_ORG_ID) {
    throw new Error('POLAR_ORG_ID is not set');
  }
  return process.env.POLAR_ORG_ID;
}

// For backwards compatibility - only throws at runtime when accessed
export const POLAR_ORG_ID = process.env.POLAR_ORG_ID || '';

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
