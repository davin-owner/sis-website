/**
 * LANDING PAGE - Waitlist Lead Generation
 *
 * PURPOSE:
 * This is the FIRST page new visitors see (before they have an account)
 * Goal: Capture leads for Simple Ink Studios
 *
 * FLOW:
 * 1. Visitor sees this landing page
 * 2. Clicks "Join Waitlist" button
 * 3. Modal opens with signup form
 * 4. They submit their info
 * 5. Saved to Supabase waitlist table
 * 6. Modal closes, shows thank you message
 *
 * MIDDLEWARE PROTECTION:
 * - If user IS logged in → middleware auto-redirects to /dashboard
 * - If user NOT logged in → sees this page
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import WaitlistModal from "@/components/waitlist/WaitlistModal.client";
import ContactModal from "@/components/contact/ContactModal.client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import FeatureImage from "@/components/landing/FeatureImage";

export default function LandingPage() {
  // State to control if modal is open or closed
  const [IsWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [IsContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/1 via-primary/10 to-accent/20 relative">
      {/* Theme Toggle - Fixed top right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text-ink">
              Simple Ink Studios
            </h1>
            <p className="text-xl md:text-2xl text-foreground">
              The client tracking system built for tattoo artists
            </p>
          </div>

          {/* Value Proposition */}
          <div className="space-y-3 text-foreground">
            <p className="text-lg md:text-xl">
              Stop losing clients in DMs and text threads
            </p>
            <p className="text-lg md:text-xl">
              Track every consultation, deposit, and appointment in one place
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row gap-5 items-center justify-center">
            <Button
              onClick={() => setIsWaitlistModalOpen(true)}
              variant={"default"}
              className="text-xl px-12 py-6 transition-all duration-300 font-semibold w-full sm:w-auto"
            >
              Join the Waitlist
            </Button>

            <Button
              onClick={() => setIsContactModalOpen(true)}
              variant={"outline"}
              className="text-xl px-12 py-6 transition-all duration-300 font-semibold w-full sm:w-auto"
            >
              Contact Us
            </Button>
          </div>

          {/* Social Proof / Urgency */}
          <p className="text-sm text-muted-foreground pt-4">
            Early access coming soon • Be the first to know
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text-ink">
            Everything you need to manage your clients
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Built by artists, for artists. Simple Ink Studios gives you
            professional tools without the complexity.
          </p>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Feature 1: Visual Pipeline */}
            <div className="space-y-4">
              <div className="surface p-8 rounded-xl border border-border">
                <div className="mb-6">
                  <FeatureImage
                    src="/gifs/drag-drop.gif"
                    alt="Pipeline view showing client stages with drag and drop"
                    placeholderIcon="fi-ts-mobile-notch"
                    placeholderText="Pipeline Demo"
                    placeholderPath="public/gifs/drag-drop.gif"
                    priority
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  Visual Pipeline
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  See all your clients at a glance. Drag and drop cards between
                  stages: Leads, Consultation, Deposit Paid, Scheduled, and
                  Completed. No more guessing where each client is in the
                  process.
                </p>
              </div>
            </div>

            {/* Feature 2: Quick Client Creation */}
            <div className="space-y-4">
              <div className="surface p-8 rounded-xl border border-border">
                <div className="mb-6">
                  <FeatureImage
                    src="/gifs/create-client.gif"
                    alt="Creating new clients with instant updates"
                    placeholderIcon="fi-ts-circle-user"
                    placeholderText="Create Client Demo"
                    placeholderPath="public/gifs/create-client.gif"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  Quick Client Creation
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Add new clients in seconds. Track contact info, preferred
                  artist, session count, deposit status, and custom notes.
                  Everything updates instantly—no page refresh needed.
                </p>
              </div>
            </div>

            {/* Feature 3: Drag & Drop */}
            <div className="space-y-4">
              <div className="surface p-8 rounded-xl border border-border">
                <div className="mb-6">
                  <FeatureImage
                    src="/gifs/edit-client.gif"
                    alt="Editing client information with instant updates"
                    placeholderIcon="fi-ts-grip-lines"
                    placeholderText="Edit Client Demo"
                    placeholderPath="public/gifs/edit-client.gif"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  Instant Client Updates
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Edit client details on the fly. Update contact info, deposit
                  status, session counts, and notes. Changes appear instantly—no
                  waiting, no page refresh needed.
                </p>
              </div>
            </div>

            {/* Feature 4: Dashboard Overview */}
            <div className="space-y-4">
              <div className="surface p-8 rounded-xl border border-border">
                <div className="mb-6">
                  <FeatureImage
                    src="/screenshots/dashboard.png"
                    alt="Dashboard showing business overview and metrics"
                    placeholderIcon="fi-ts-dashboard"
                    placeholderText="Dashboard Screenshot"
                    placeholderPath="public/screenshots/dashboard.png"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  Dashboard Insights
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get a quick overview of your business. See pending deposits,
                  upcoming appointments, and recent activity. Your business
                  metrics at a glance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text-ink">
            Why artists choose Simple Ink Studios
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 mt-12">
            <div className="surface p-6 rounded-xl border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <i className="fi fi-ts-mobile-notch text-2xl text-accent-foreground"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Mobile-First Design
              </h3>
              <p className="text-muted-foreground">
                Update clients from anywhere—your phone, tablet, or desktop.
                Works seamlessly on all devices.
              </p>
            </div>

            <div className="surface p-6 rounded-xl border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <i className="fi fi-ts-settings text-2xl text-accent-foreground"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Simple & Powerful
              </h3>
              <p className="text-muted-foreground">
                No complex setup or training needed. If you can use Instagram,
                you can use Simple Ink Studios.
              </p>
            </div>

            <div className="surface p-6 rounded-xl border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <i className="fi fi-ts-circle-user text-2xl text-accent-foreground"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Client-Focused
              </h3>
              <p className="text-muted-foreground">
                Never lose track of a client again. Every detail, every
                interaction, all in one place.
              </p>
            </div>

            <div className="surface p-6 rounded-xl border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <i className="fi fi-ts-envelopes text-2xl text-accent-foreground"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Built for You
              </h3>
              <p className="text-muted-foreground">
                Designed by artists who understand the tattoo business. We know
                what you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text-ink">
            Ready to simplify your business?
          </h2>
          <p className="text-xl text-foreground">
            Join the waitlist and be among the first to experience Simple Ink
            Studios
          </p>
          <div className="pt-4">
            <Button
              onClick={() => setIsWaitlistModalOpen(true)}
              variant={"default"}
              className="text-xl px-12 py-6 transition-all duration-300 font-semibold"
            >
              Join the Waitlist
            </Button>
          </div>
          <p className="text-sm text-foreground">
            No credit card required • Early access coming soon
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-foreground">
          <p>&copy; 2024 Simple Ink Studios. All rights reserved.</p>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="hover:text-foreground transition-colors"
          >
            Contact Us
          </button>
        </div>
      </footer>

      {/* Modals */}
      <WaitlistModal
        isOpen={IsWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />

      <ContactModal
        isOpen={IsContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
