import PricingTiers from '@/components/pricing/PricingTiers';

export default function PricingPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-16">
          Choose the plan that fits your studio
        </p>
        <PricingTiers />
      </div>
    </div>
  );
}
