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

export default function LandingPage() {
  // State to control if modal is open or closed
  const [IsWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [IsContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-6">
      {/* Main Content Container */}
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          {/* Main Headline - White with glow effect */}
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            Simple Ink Studios
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            The client tracking system built for tattoo artists
          </p>
        </div>

        {/* Value Proposition */}
        <div className="space-y-3 text-white/80">
          <p className="text-lg md:text-xl">
            Stop losing clients in DMs and text threads
          </p>
          <p className="text-lg md:text-xl">
            Track every consultation, deposit, and appointment in one place
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-8 flex flex-col space-y-5 ">
          <Button
            onClick={() => setIsWaitlistModalOpen(true)}
            size="lg"
            className="text-xl px-12 py-6 bg-white text-purple-900 hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] transition-all duration-300 font-semibold w-1/2 self-center "
          >
            Join the Waitlist
          </Button>

          <Button
            onClick={() => setIsContactModalOpen(true)}
            size="lg"
            className="text-xl px-12 py-6 bg-white text-purple-900 hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] transition-all duration-300 font-semibold w-1/2 self-center "
          >
            Contact Us!
          </Button>
        </div>

        {/* Social Proof / Urgency (optional) */}
        <p className="text-sm text-white/60 pt-4">
          Early access coming soon • Be the first to know
        </p>
      </div>

      {/* Waitlist Modal */}

      <WaitlistModal
        isOpen={IsWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={IsContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
