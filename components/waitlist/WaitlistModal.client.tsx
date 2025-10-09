/**
 * WAITLIST MODAL - Lead Capture Form
 *
 * PURPOSE:
 * Modal popup form that collects lead information from potential customers
 *
 * FIELDS COLLECTED:
 * - name (REQUIRED)
 * - email OR phone (at least one REQUIRED)
 * - shop_name (optional)
 * - city_state (optional)
 * - message (optional) - What intrigues them? Current tracking? What they want?
 *
 * FLOW:
 * 1. User clicks "Join Waitlist" on landing page
 * 2. Modal opens with this form
 * 3. User fills out info
 * 4. Clicks submit → saves to Supabase
 * 5. Shows success message
 * 6. Modal closes after 2 seconds
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { saveWaitlistSignup } from "@/lib/supabase/waitlist-data";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  // Form state - stores user input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [cityState, setCityState] = useState("");
  const [message, setMessage] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    setError("");

    // Validation: Name is required
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    // Validation: At least email OR phone is required
    if (!email.trim() && !phone.trim()) {
      setError("Please provide at least an email or phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database (function we'll create next)
      await saveWaitlistSignup({
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        shop_name: shopName.trim() || null,
        city_state: cityState.trim() || null,
        message: message.trim() || null,
      });

      // Success! Show thank you message
      setShowSuccess(true);

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        onClose();
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setShopName("");
        setCityState("");
        setMessage("");
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error saving waitlist signup:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    // Modal Backdrop (dark overlay)
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close on backdrop click
    >
      {/* Modal Content */}
      <div
        className="bg-card p-8 rounded-lg shadow-2xl max-w-md w-full border-2 border-border"
        onClick={(e) => e.stopPropagation()} // Don't close when clicking inside modal
      >
        {/* Success Message */}
        {showSuccess ? (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-card-foreground">
              Thank You! 🎉
            </h2>
            <p className="text-card-foreground text-lg">
              You&apos;re on the list!
            </p>
            <p className="text-muted-foreground">
              Stand by for email updates about early access.
            </p>
          </div>
        ) : (
          // Signup Form
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-card-foreground text-center">
              Join the Waitlist
            </h2>

            {/* Name Field (Required) */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <p className="text-xs text-muted-foreground">* Email or phone required</p>

            {/* Shop Name (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="shopName">
                Shop Name (optional)
              </Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Ink Masters Studio"
              />
            </div>

            {/* City/State (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="cityState">
                City, State (optional)
              </Label>
              <Input
                id="cityState"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                placeholder="Los Angeles, CA"
              />
            </div>

            {/* Message Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Tell us about your tracking needs (optional)
              </Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What interests you? How do you track clients now? What are you looking for?"
                rows={4}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold"
            >
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </Button>

            {/* Cancel Button */}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
