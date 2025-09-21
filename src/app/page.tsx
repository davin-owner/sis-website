// SERVER COMPONENT - Main dashboard page that fetches data on the server
// Uses async function to prepare data before rendering, then passes to client components
import ServerContainer from "@/app/components/Server/ServerContainer";
import Section from "@/app/components/Server/ServerSection";
import Card from "@/app/components/CardComponent";
import { ClientCheckList } from "@/app/components/Client/ClientCheckList";
import { Reminders } from "@/app/components/Client/Reminders";
import { PipelineStats } from "@/app/components/Client/PipelineStats";
import ClientCard from "./components/Client/ClientModalCard";

export default async function Page() {
  // Later: fetch from Supabase; mock for now
  const working = [
    { label: "Apts" },
    { label: "Meetings" },
    { label: "Inventory" },
    { label: "Cold Calling" },
    { label: "Test", done: true },
  ];
  const testList = [{ label: "test" }];

  const reminders = { emails: 3, sms: 2, urgent: 3 };
  const stats = { flakers: 1, finished: 1 };

  return (
    <main className="min-h-dvh">
      <div className="page-container ml-10">
        <h1 className="text-white/90 text-2xl font-semibold mb-4">Dashboard</h1>

        <ServerContainer>
          {/* Left column (sidebar area in your sketch) */}
          <Section className="lg:col-span-3 space-y-6">
            <ClientCheckList
              titleName="Development Completed Things"
              items={working}
            />
            <Card title="Artists" subtitle="Who's on the page today">
              <ul className="space-y-2 text-gray-800">
                <li>Jules - 3 sessions</li>
                <li>Mako - 2 sessions</li>
                <li>Nova - 1 session</li>
                <li>Test</li>
              </ul>
            </Card>
          </Section>

          {/* Middle column (main content) */}
          <Section className="lg:col-span-6 space-y-6">
            <Card title="What You've Done" subtitle="Today">
              <ul className="space-y-2 text-gray-800">
                <li>• 2 appointments booked</li>
                <li>• 1 consult scheduled</li>
                <li>• 3 follow-ups sent</li>
              </ul>
            </Card>

            <Card title="Calendar Summary">
              <div className="text-gray-700">
                Mini calendar or list preview goes here.
              </div>
            </Card>

            <ClientCheckList titleName="" items={testList} />
          </Section>

          {/* Right column (reminders + stats) */}
          <Section className="lg:col-span-3 space-y-6">
            <Reminders data={reminders} />
            <PipelineStats flakers={stats.flakers} finished={stats.finished} />
          </Section>
        </ServerContainer>
      </div>
    </main>
  );
}
