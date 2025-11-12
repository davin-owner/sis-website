import { SubscriptionTier } from '@/lib/database';

// Tier limits configuration
export const TIER_LIMITS = {
  free: {
    artists: 1,
    clients: 50,
    appointmentsPerMonth: 20,
    sms: false,
    email: false,
    analytics: false,
    customBranding: false,
    paymentProcessing: false,
    multiLocation: false,
    apiAccess: false,
  },
  basics: {
    artists: 3,
    clients: Infinity,
    appointmentsPerMonth: Infinity,
    sms: false,
    email: false,
    analytics: false,
    customBranding: true,
    paymentProcessing: false,
    multiLocation: false,
    apiAccess: false,
  },
  pro: {
    artists: 10,
    clients: Infinity,
    appointmentsPerMonth: Infinity,
    sms: true,
    email: true,
    analytics: true,
    customBranding: true,
    paymentProcessing: false,
    multiLocation: false,
    apiAccess: false,
  },
  enterprise: {
    artists: Infinity,
    clients: Infinity,
    appointmentsPerMonth: Infinity,
    sms: true,
    email: true,
    analytics: true,
    customBranding: true,
    paymentProcessing: true,
    multiLocation: true,
    apiAccess: true,
  },
} as const;

// Check if feature is available for tier
export function canUseFeature(
  tier: SubscriptionTier,
  feature: keyof typeof TIER_LIMITS.free
): boolean {
  return TIER_LIMITS[tier][feature] === true;
}

// Get limit value for tier
export function getTierLimit(
  tier: SubscriptionTier,
  limit: keyof typeof TIER_LIMITS.free
): number | boolean {
  return TIER_LIMITS[tier][limit];
}

// Check if shop is at limit
export function isAtLimit(
  tier: SubscriptionTier,
  limitType: 'artists' | 'clients' | 'appointmentsPerMonth',
  currentCount: number
): boolean {
  const limit = getTierLimit(tier, limitType);
  if (typeof limit === 'number') {
    return currentCount >= limit;
  }
  return false;
}

// Get upgrade message based on tier
export function getUpgradeMessage(tier: SubscriptionTier): string {
  switch (tier) {
    case 'free':
      return 'Upgrade to Studio Basics ($29/mo) to add more artists and remove limits';
    case 'basics':
      return 'Upgrade to Studio Pro ($79/mo) to unlock SMS/Email automation';
    case 'pro':
      return 'Upgrade to Studio Enterprise ($149/mo) for unlimited artists and payment processing';
    default:
      return '';
  }
}

// Get next tier in upgrade path
export function getNextTier(tier: SubscriptionTier): SubscriptionTier | null {
  const tiers: SubscriptionTier[] = ['free', 'basics', 'pro', 'enterprise'];
  const currentIndex = tiers.indexOf(tier);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}

// Get tier display name
export function getTierDisplayName(tier: SubscriptionTier): string {
  const names = {
    free: 'Solo Artist',
    basics: 'Studio Basics',
    pro: 'Studio Pro',
    enterprise: 'Studio Enterprise',
  };
  return names[tier];
}

// Get tier price
export function getTierPrice(tier: SubscriptionTier): number {
  const prices = {
    free: 0,
    basics: 29,
    pro: 79,
    enterprise: 149,
  };
  return prices[tier];
}
