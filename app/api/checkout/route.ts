import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { polar, POLAR_PRODUCT_IDS } from '@/lib/polar/client';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get shop
    const { data: shopUser } = await supabase
      .from('shop_users')
      .select('shop_id, shops_tables(*)')
      .eq('user_id', user.id)
      .single();

    if (!shopUser) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Get requested tier
    const { tier } = await req.json();
    if (!tier || !['free', 'basics', 'pro', 'enterprise'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Free tier doesn't need checkout
    if (tier === 'free') {
      return NextResponse.json({ error: 'Free tier does not require checkout' }, { status: 400 });
    }

    const productId = POLAR_PRODUCT_IDS[tier as keyof typeof POLAR_PRODUCT_IDS];

    if (!productId) {
      return NextResponse.json({ error: 'Product not found for tier' }, { status: 400 });
    }

    // Create Polar checkout
    const checkout = await polar.checkouts.custom.create({
      productId,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?checkout=success`,
      customerEmail: user.email,
      metadata: {
        userId: user.id,
        shopId: shopUser.shop_id,
        tier,
      },
    });

    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
