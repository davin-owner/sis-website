// SERVER COMPONENT - Dashboard page that renders static content on the server
// Main dashboard for Simple Ink Studios management interface
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-dvh">
      <div className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Pipeline Overview</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your client pipeline and track leads through the sales process.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Calendar</h2>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage appointments, meetings, and important dates.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Communications</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Send emails and SMS messages to clients and prospects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
