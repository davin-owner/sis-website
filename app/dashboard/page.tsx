/**
 * DASHBOARD PAGE - Simple Ink Studios Management Platform
 *
 * This is the main dashboard that users see after successful authentication.
 * Features interactive checkbox trackers, reminders, pipeline stats, and business overview.
 *
 * Authentication:
 * - Protected route: Users must be logged in to access
 * - Automatic redirect to /auth/login if not authenticated
 * - Uses Supabase auth.getUser() for server-side verification
 *
 * Features:
 * - Interactive checkbox task trackers
 * - Reminders and notifications
 * - Pipeline statistics
 * - Artist assignments and calendar summary
 * - Responsive 3-column grid layout
 *
 * Components Used:
 * - CheckList.client.tsx: Interactive checkbox lists
 * - Reminders.client.tsx: Notification counters
 * - PipelineStats.client.tsx: Business metrics
 * - Container.server.tsx: Layout wrapper
 * - Card.server.tsx: Content cards
 */
import Container from "@/components/layout/Container.server";
import Section from "@/components/layout/Section.server";
import Card from "@/components/studio/Card.server";
import { ClientCheckList } from "@/components/studio/CheckList.client";
import { Reminders } from "@/components/studio/Reminders.client";
import { PipelineStats } from "@/components/studio/PipelineStats.client";

import { createClient } from "@/lib/supabase/server";
import { getActiveShop } from "@lib/supabase/data/user-shops";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { redirect } from "next/navigation";
import ShopProvider from "@/lib/contexts/shop-context";

export default async function DashboardPage() {
  // 1. Make sure we are getting the authentacted user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Check what shops this user can access and if they dont have a shop redirect them to the onboarding page to help create a shop
  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) {
    redirect("/onboarding");
  }

  // 3. If they have shops get the most recent one and load that to the dashboard and load their data

  //const activeShop = shops[0];

  const activeShop = await getActiveShop(user.id, shopId, supabase);

  if (!activeShop) redirect("/onboarding");

  // Temp data that will be removed after full database setup and intergration
  // Mock data for dashboard widgets (later: fetch from Supabase)
  const workingTasks = [
    { label: "Book appointments", done: false },
    { label: "Follow up with leads", done: true },
    { label: "Update inventory", done: false },
    { label: "Cold calling session", done: false },
    { label: "Social media posts", done: true },
  ];

  const todayTasks = [
    { label: "Review new inquiries", done: false },
    { label: "Prepare consultation materials", done: false },
  ];

  const reminderData = { emails: 3, sms: 2, urgent: 1 };
  const statsData = { flakers: 2, finished: 5 };

  return (
    // We have this shop provieder so we can load the shop they are in and it passes the variable active shop
    <ShopProvider shop={activeShop}>
      <div className="min-h-dvh app-canvas">
        <div className="page-container--wide">
          <h1 className="gradient-text-ink text-4xl font-bold mb-8">
            Dashboard for: {activeShop?.shop_name}
          </h1>

          <Container size="page-container--wide">
            {/* Left column - Task trackers and artist info */}
            <Section className="lg:col-span-3 space-y-6">
              <ClientCheckList titleName="Daily Tasks" items={workingTasks} />
              <Card title="Artists" subtitle="Who's working today">
                <ul className="space-y-2">
                  <li>Jules - 3 sessions scheduled</li>
                  <li>Mako - 2 sessions scheduled</li>
                  <li>Nova - 1 session scheduled</li>
                  <li>Available for walk-ins</li>
                </ul>
              </Card>
            </Section>

            {/* Middle column - Main content and summary */}
            <Section className="lg:col-span-6 space-y-6">
              <Card
                title="Today's Accomplishments"
                subtitle="What you've completed"
              >
                <ul className="space-y-2">
                  <li>• 4 appointments booked</li>
                  <li>• 2 consultations completed</li>
                  <li>• 6 follow-ups sent</li>
                  <li>• 1 new client onboarded</li>
                </ul>
              </Card>

              <Card title="Calendar Summary">
                <div className="">
                  <p className="mb-2">Today: 8 appointments</p>
                  <p className="mb-2">Tomorrow: 5 appointments</p>
                  <p>This week: 32 total sessions</p>
                </div>
              </Card>

              <ClientCheckList titleName="Priority Items" items={todayTasks} />
            </Section>

            {/* Right column - Reminders and stats */}
            <Section className="lg:col-span-3 space-y-6">
              <Reminders data={reminderData} />
              <PipelineStats
                flakers={statsData.flakers}
                finished={statsData.finished}
              />
            </Section>
          </Container>
        </div>
      </div>
    </ShopProvider>
  );
}
