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
import Card from "@/components/shared/Card.server";
import { PipelineStats } from "@/components/features/pipeline/PipelineStats.client";
import DashboardInfoBanner from "@/components/features/dashboard/DashboardInfoBanner.client";
import DailyTasksList from "@/components/features/dashboard/DailyTasksList.client";
import AccomplishmentsList from "@/components/features/dashboard/AccomplishmentsList.client";
import RemindersList from "@/components/features/dashboard/RemindersList.client";

import { createClient } from "@/lib/supabase/server";
import { getActiveShop } from "@lib/supabase/data/user-shops";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { getShopWorkerData } from "@/lib/supabase/data/workers-data";
import { fetchShopLeadData } from "@/lib/supabase/data/shop-leads-data";
import { getShopDailyTasks } from "@/lib/supabase/data/dashboard-tasks-data";
import { getShopAccomplishments } from "@/lib/supabase/data/dashboard-accomplishments-data";
import { getShopReminders } from "@/lib/supabase/data/dashboard-reminders-data";
import { redirect } from "next/navigation";
import ShopProvider from "@/lib/contexts/shop-context";
import { getUserSafe } from "@/lib/auth/get-user-safe";

export default async function DashboardPage() {
  // 1. Make sure we are getting the authentacted user
  const supabase = await createClient();
  const user = await getUserSafe(supabase);

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

  // 4. Fetch real data from database in parallel for faster loading
  const [workers, leads, dailyTasks, accomplishments, reminders] =
    await Promise.all([
      getShopWorkerData(shopId, user.id, supabase),
      fetchShopLeadData(shopId, user.id, supabase),
      getShopDailyTasks(shopId, user.id, supabase),
      getShopAccomplishments(shopId, user.id, supabase),
      getShopReminders(shopId, user.id, supabase, false),
    ]);

  // Calculate pipeline stats from real data
  const completedLeads = leads.filter(
    (lead) => lead.pipeline_stage === "completed"
  ).length;
  const lostLeads = leads.filter(
    (lead) => lead.pipeline_stage === "lost"
  ).length;
  const statsData = { flakers: lostLeads, finished: completedLeads };

  return (
    // We have this shop provieder so we can load the shop they are in and it passes the variable active shop
    <ShopProvider shop={activeShop}>
      <div className="min-h-dvh app-canvas">
        <div className="page-container--wide">
          <h1 className="gradient-text-ink text-4xl font-bold mb-8">
            Dashboard for: {activeShop?.shop_name}
          </h1>

          {/* Info Banner about local/staged data */}
          <DashboardInfoBanner />

          <Container size="page-container--wide">
            {/* Left column - Task trackers and artist info */}
            <Section className="lg:col-span-3 space-y-6">
              <DailyTasksList
                initialTasks={dailyTasks}
                titleName="Daily Tasks"
              />
              <Card title="Active Artists" subtitle="Artists in house">
                {workers.length > 0 ? (
                  <ul className="space-y-2">
                    {workers
                      .filter((worker) => worker.status === "active")
                      .map((worker) => (
                        <li key={worker.id} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: worker.color }}
                          ></div>
                          <span>
                            {worker.first_name} {worker.last_name}
                          </span>
                          {worker.specialties &&
                            worker.specialties.length > 0 && (
                              <span className="text-xs text-muted-foreground">
                                - {worker.specialties[0]}
                              </span>
                            )}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No artists added yet.{" "}
                    <a
                      href="/content/artists"
                      className="text-accent hover:underline"
                    >
                      Add your first artist
                    </a>
                  </p>
                )}
              </Card>
            </Section>

            {/* Middle column - Main content and summary */}
            <Section className="lg:col-span-6 space-y-6">
              <AccomplishmentsList initialAccomplishments={accomplishments} />

              <Card title="Calendar Summary">
                <div className="">
                  <p className="mb-2">Coming soon: Calendar integration</p>
                  <p className="text-sm text-muted-foreground">
                    Today&apos;s appointments, week overview, and more
                  </p>
                </div>
              </Card>
            </Section>

            {/* Right column - Reminders and stats */}
            <Section className="lg:col-span-3 space-y-6">
              <RemindersList initialReminders={reminders} />
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
