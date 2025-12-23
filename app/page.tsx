/**
 * LANDING PAGE - Problem-Focused Lead Generation
 *
 * PURPOSE:
 * Convert tattoo artists to paid users by showing them EXACTLY
 * how much money they're losing with their current system
 *
 * STRUCTURE:
 * 1. Hero - Stop Losing Clients
 * 2. Problem - Show the pain (buried DMs, forgotten follow-ups, scheduling chaos)
 * 3. Solution - Here's what changes (features with screenshots)
 * 4. Pricing - Clear, simple tiers
 * 5. Trust - Built by someone who gets it
 * 6. Final CTA - Strong conversion focus
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import ContactModal from "@/components/contact/ContactModal.client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Calendar,
  Users,
  Bell,
  Palette,
  Check,
  ArrowRight,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative">
      {/* Theme Toggle - Fixed top right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* =================================================================== */}
      {/* HERO SECTION */}
      {/* =================================================================== */}
      <section className="min-h-screen flex items-center justify-center p-6 pt-20">
        <div className="max-w-5xl w-full text-center space-y-10">
          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black gradient-text-ink leading-tight">
              Stop Losing Clients in Your DMs
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Tattoo artists lose <span className="text-foreground font-bold">3-5 bookings every month</span> because consultations get buried, follow-ups are forgotten, and scheduling is chaos.
              <span className="block mt-4 text-foreground">
                Simple Ink Studios fixes that—so you can spend less time hunting through messages and more time tattooing.
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Link href="/auth/sign-up" className="w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                className="text-xl px-12 py-7 w-full sm:w-auto font-bold shadow-2xl hover:scale-105 transition-transform"
              >
                Try Free for 90 Days - No Credit Card
              </Button>
            </Link>
            <button
              onClick={() => {
                document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-lg text-foreground hover:text-accent transition-colors flex items-center gap-2 group"
            >
              See how it works in 60 seconds
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Social Proof */}
          <p className="text-sm text-muted-foreground pt-6">
            90-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* PROBLEM SECTION */}
      {/* =================================================================== */}
      <section className="py-32 px-6 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-6 gradient-text-ink">
            Your Current System Is Costing You Money
          </h2>
          <p className="text-center text-muted-foreground text-xl mb-16 max-w-3xl mx-auto">
            Every artist I've talked to has these same problems. Ring any bells?
          </p>

          {/* Problem Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Problem 1 */}
            <div className="surface p-8 rounded-2xl border-2 border-destructive/30 hover:border-destructive/60 transition-colors">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
                <X size={32} className="text-destructive" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Buried Consultations
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Client asks about a sleeve in your DMs. You mean to respond.
                Three days later they book with someone else.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="surface p-8 rounded-2xl border-2 border-destructive/30 hover:border-destructive/60 transition-colors">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
                <X size={32} className="text-destructive" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Forgotten Follow-Ups
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                You consulted someone last week. They said they'd get back to you.
                You forgot to check in. They forgot about you.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="surface p-8 rounded-2xl border-2 border-destructive/30 hover:border-destructive/60 transition-colors">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
                <X size={32} className="text-destructive" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Scheduling Chaos
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                You double-booked Tuesday. Your client drove an hour.
                Now you're explaining why you can't take them. Awkward.
              </p>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="text-center text-xl text-foreground font-semibold mt-16">
            Sound familiar? You're not disorganized. <br className="hidden sm:block" />
            <span className="gradient-text-ink">You just don't have the right tools.</span>
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SOLUTION SECTION */}
      {/* =================================================================== */}
      <section id="solution" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-20 gradient-text-ink">
            Here's What Changes
          </h2>

          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Check size={32} className="text-accent" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Every Client, One View
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                See exactly who's at consultation, who's ready to book, who needs a follow-up.
                <span className="block mt-3 text-foreground font-semibold">
                  Nothing slips through the cracks.
                </span>
              </p>
            </div>
            <div className="order-1 lg:order-2 surface p-4 rounded-2xl border border-border">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Pipeline Screenshot</p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="surface p-4 rounded-2xl border border-border">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Calendar Screenshot</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Check size={32} className="text-accent" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Your Schedule, Unfucked
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Color-coded calendar by artist. No more double-bookings.
                <span className="block mt-3 text-foreground font-semibold">
                  No more "wait, who's coming in?"
                </span>
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Check size={32} className="text-accent" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Reminders That Actually Work
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Set follow-up reminders for consultations. Get notified when it's time to check in.
                <span className="block mt-3 text-foreground font-semibold">
                  Close more bookings.
                </span>
              </p>
            </div>
            <div className="order-1 lg:order-2 surface p-4 rounded-2xl border border-border">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Dashboard/Reminders Screenshot</p>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="surface p-4 rounded-2xl border border-border">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Artist Management Screenshot</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Check size={32} className="text-accent" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Multiple Artists, No Drama
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Managing a shop? Track every artist's schedule and clients in one place.
                <span className="block mt-3 text-foreground font-semibold">
                  Switch between locations instantly.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* PRICING SECTION */}
      {/* =================================================================== */}
      <section className="py-32 px-6 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-6 gradient-text-ink">
            Pricing That Makes Sense
          </h2>
          <p className="text-center text-muted-foreground text-xl mb-16 max-w-3xl mx-auto">
            No hidden fees. No surprises. Just honest pricing for working artists.
          </p>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Solo Artist - FREE */}
            <div className="surface p-8 rounded-2xl border-2 border-accent hover:border-accent/80 transition-all hover:scale-105">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Solo Artist</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black gradient-text-ink">FREE</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Forever</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Up to 50 clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">1 artist (you)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Calendar & appointments</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Client pipeline</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Perfect for independent artists</span>
                </li>
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button variant="outline" className="w-full py-6 text-lg font-semibold">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Small Shop - $29 */}
            <div className="surface p-8 rounded-2xl border-2 border-primary hover:border-primary/80 transition-all hover:scale-105">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Small Shop</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black gradient-text-ink">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Up to 200 clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Up to 3 artists</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Everything in Solo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Multi-artist scheduling</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Shop dashboard</span>
                </li>
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button variant="default" className="w-full py-6 text-lg font-semibold">
                  Start 90-Day Trial
                </Button>
              </Link>
            </div>

            {/* Growing Shop - $59 */}
            <div className="surface p-8 rounded-2xl border-2 border-primary hover:border-primary/80 transition-all hover:scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent px-4 py-1 rounded-full">
                <span className="text-xs font-bold text-accent-foreground">POPULAR</span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Growing Shop</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black gradient-text-ink">$59</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Unlimited clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Up to 10 artists</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Everything in Small Shop</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Multiple locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Priority support</span>
                </li>
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button variant="default" className="w-full py-6 text-lg font-semibold">
                  Start 90-Day Trial
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="surface p-8 rounded-2xl border-2 border-border hover:border-border/80 transition-all hover:scale-105">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black gradient-text-ink">Custom</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Let's talk</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Unlimited everything</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Custom integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Training & onboarding</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Custom features</span>
                </li>
              </ul>
              <Button
                variant="outline"
                onClick={() => setIsContactModalOpen(true)}
                className="w-full py-6 text-lg font-semibold"
              >
                Contact Sales
              </Button>
            </div>
          </div>

          {/* Pricing Footer */}
          <p className="text-center text-muted-foreground text-lg">
            <span className="font-semibold text-foreground">90-day free trial on all paid plans.</span> No credit card required.
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* ABOUT/TRUST SECTION */}
      {/* =================================================================== */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 gradient-text-ink">
            Built By Someone Who Gets It
          </h2>
          <div className="surface p-10 rounded-2xl border border-border">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              I'm <span className="text-foreground font-bold">Davin</span>, an active-duty Marine who saw tattoo artists grinding their asses off but
              <span className="text-foreground font-bold"> losing money</span> because their "system" was a mix of Instagram DMs,
              Google Calendar, and memory.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              I built Simple Ink Studios because <span className="text-foreground font-bold">every artist I talked to had the same problems</span>—and
              nobody was solving them. This isn't some generic CRM. This is built specifically for how you actually work.
            </p>
          </div>
          {/* Placeholder for testimonial */}
          <p className="text-sm text-muted-foreground mt-8">
            Beta testimonials coming soon...
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* FINAL CTA SECTION */}
      {/* =================================================================== */}
      <section className="py-32 px-6 bg-gradient-to-br from-primary/10 via-accent/10 to-background border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text-ink leading-tight">
            Stop Losing Money on Forgotten Follow-Ups
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Try Simple Ink Studios free for 90 days.
            <span className="block mt-3 text-foreground font-semibold">
              If it doesn't save you at least 5 hours a week, don't pay.
            </span>
          </p>
          <div className="pt-6">
            <Link href="/auth/sign-up">
              <Button
                variant="default"
                size="lg"
                className="text-2xl px-16 py-8 font-black shadow-2xl hover:scale-105 transition-transform"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-lg">
            No credit card required • Cancel anytime • <span className="text-foreground font-semibold">Solo artists stay free forever</span>
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* FOOTER */}
      {/* =================================================================== */}
      <footer className="py-12 px-6 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold gradient-text-ink mb-2">Simple Ink Studios</p>
              <p className="text-sm text-muted-foreground">
                Built by artists, for artists
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-center text-sm">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </button>
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Simple Ink Studios. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
