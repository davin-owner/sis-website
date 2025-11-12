import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Polar webhook data types
interface PolarMetadata {
  shopId?: string;
  tier?: string;
  [key: string]: unknown;
}

interface PolarCheckoutData {
  id: string;
  customer_id?: string;
  metadata?: PolarMetadata;
  [key: string]: unknown;
}

interface PolarOrderData {
  id: string;
  customer_id: string;
  metadata?: PolarMetadata;
  [key: string]: unknown;
}

interface PolarSubscriptionData {
  id: string;
  customer_id: string;
  status: string;
  metadata?: PolarMetadata;
  [key: string]: unknown;
}

// Admin client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    console.log('Polar webhook received:', payload);

    // Polar webhook events
    const eventType = payload.type;

    switch (eventType) {
      case 'checkout.created':
        await handleCheckoutCreated(payload.data);
        break;

      case 'order.created':
        await handleOrderCreated(payload.data);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(payload.data);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(payload.data);
        break;

      case 'subscription.canceled':
        await handleSubscriptionCanceled(payload.data);
        break;

      default:
        console.log('Unhandled webhook event:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function handleCheckoutCreated(data: PolarCheckoutData) {
  console.log('Checkout created:', data);
  // Just logging for now
}

async function handleOrderCreated(data: PolarOrderData) {
  console.log('Order created:', data);

  const metadata = data.metadata || {};
  const { shopId, tier } = metadata;

  if (!shopId || !tier) {
    console.error('Missing metadata in order:', metadata);
    return;
  }

  // Update shop subscription
  await supabaseAdmin
    .from('shops_tables')
    .update({
      subscription_tier: tier,
      polar_customer_id: data.customer_id,
      subscription_status: 'active',
      subscription_created_at: new Date().toISOString(),
    })
    .eq('shop_id', shopId);

  console.log(`Shop ${shopId} upgraded to ${tier}`);
}

async function handleSubscriptionCreated(data: PolarSubscriptionData) {
  console.log('Subscription created:', data);

  const metadata = data.metadata || {};
  const { shopId, tier } = metadata;

  if (!shopId || !tier) {
    console.error('Missing metadata in subscription:', metadata);
    return;
  }

  await supabaseAdmin
    .from('shops_tables')
    .update({
      subscription_tier: tier,
      polar_customer_id: data.customer_id,
      polar_subscription_id: data.id,
      subscription_status: data.status,
      subscription_created_at: new Date().toISOString(),
    })
    .eq('shop_id', shopId);

  console.log(`Subscription created for shop ${shopId}: ${tier}`);
}

async function handleSubscriptionUpdated(data: PolarSubscriptionData) {
  console.log('Subscription updated:', data);

  const metadata = data.metadata || {};
  const { shopId } = metadata;

  if (!shopId) {
    console.error('Missing shopId in subscription metadata');
    return;
  }

  await supabaseAdmin
    .from('shops_tables')
    .update({
      subscription_status: data.status,
    })
    .eq('shop_id', shopId);

  console.log(`Subscription updated for shop ${shopId}: ${data.status}`);
}

async function handleSubscriptionCanceled(data: PolarSubscriptionData) {
  console.log('Subscription canceled:', data);

  const metadata = data.metadata || {};
  const { shopId } = metadata;

  if (!shopId) {
    console.error('Missing shopId in subscription metadata');
    return;
  }

  await supabaseAdmin
    .from('shops_tables')
    .update({
      subscription_status: 'cancelled',
    })
    .eq('shop_id', shopId);

  console.log(`Subscription canceled for shop ${shopId}`);
}
