/**
 * DASHBOARD INFO BANNER - Local Data Notification
 *
 * PURPOSE:
 * Shows a persistent notification that dashboard data is in staging/local mode
 * Displays on every page load with a question mark icon for user reference
 *
 * FEATURES:
 * - Auto-shows on page load
 * - Dismissible but reappears on next visit
 * - Click info icon to show again after dismissing
 * - Positioned at top of dashboard
 */

"use client";

import { useState } from "react";
import { HelpCircle, X } from 'lucide-react';

export default function DashboardInfoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      // Floating info icon when banner is dismissed
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full surface border border-border shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Show dashboard info"
      >
        <HelpCircle size={24} className="text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="mb-6 surface border border-border rounded-lg p-4 flex items-start gap-4">
      {/* Info Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
        <HelpCircle size={24} className="text-accent-foreground" />
      </div>

      {/* Message Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-foreground mb-1">
          Dashboard Data is in Local Mode
        </h3>
        <p className="text-sm text-muted-foreground">
          Some sections below show example data while we finish building out the
          database features. You can interact with these sections, and your
          changes will be saved to your account.
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={24} />
      </button>
    </div>
  );
}
