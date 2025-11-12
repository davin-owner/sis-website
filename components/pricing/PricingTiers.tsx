'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Solo Artist',
    price: 0,
    period: 'Forever free',
    description: 'Perfect for individual artists',
    features: [
      '1 artist',
      'Up to 50 clients',
      'Up to 20 appointments/month',
      'Basic calendar',
      'Client list',
    ],
    cta: 'Get Started Free',
    tier: 'free',
  },
  {
    name: 'Studio Basics',
    price: 29,
    period: 'per month',
    description: 'For small tattoo studios',
    features: [
      'Up to 3 artists',
      'Unlimited clients',
      'Unlimited appointments',
      'Full client pipeline',
      'Team calendar',
      'Deposit tracking',
      'Remove branding',
    ],
    cta: 'Start Free Trial',
    tier: 'basics',
    popular: false,
  },
  {
    name: 'Studio Pro',
    price: 79,
    period: 'per month',
    description: 'Automation for growing studios',
    features: [
      'Up to 10 artists',
      'Everything in Basics',
      'SMS notifications',
      'Email notifications',
      'Analytics dashboard',
      'Custom branding',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    tier: 'pro',
    popular: true,
  },
  {
    name: 'Studio Enterprise',
    price: 149,
    period: 'per month',
    description: 'For established shops',
    features: [
      'Unlimited artists',
      'Everything in Pro',
      'Payment processing',
      'Multi-location support',
      'API access',
      'Priority phone/chat support',
      'Dedicated account manager',
    ],
    cta: 'Start Free Trial',
    tier: 'enterprise',
    popular: false,
  },
];

export default function PricingTiers() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (tier: string) => {
    if (tier === 'free') {
      window.location.href = '/auth/sign-up?tier=free';
      return;
    }

    setIsLoading(tier);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (!res.ok) {
        throw new Error('Checkout failed');
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`surface p-8 rounded-lg relative ${
            tier.popular ? 'border-2 border-primary' : ''
          }`}
        >
          {tier.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
          )}

          <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
          <p className="text-muted-foreground mb-4">{tier.description}</p>

          <div className="mb-6">
            <span className="text-5xl font-bold">${tier.price}</span>
            <span className="text-muted-foreground ml-2">{tier.period}</span>
          </div>

          <Button
            className="w-full mb-6"
            onClick={() => handleCheckout(tier.tier)}
            disabled={isLoading === tier.tier}
          >
            {isLoading === tier.tier ? 'Loading...' : tier.cta}
          </Button>

          <ul className="space-y-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
