"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const businessEmail = "davin@simpleinkstudios.com"; // Replace with your actual business email

  const handleEmailClick = () => {
    window.location.href = `mailto:${businessEmail}?subject=Question about Simple Ink Studios`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-lg shadow-2xl max-w-md w-full border-2 border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <i className="fi fi-ts-envelopes text-6xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"></i>
            <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              Get in Touch
            </h2>
          </div>

          <p className="text-white/90 text-lg">
            Have questions about Simple Ink Studios? We&apos;d love to hear from
            you!
          </p>

          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-white/70 text-sm mb-2">Email us at:</p>
            <p className="text-white font-mono text-lg break-all">
              {businessEmail}
            </p>
          </div>

          <div className="flex flex-col gap-3 text-neon-purple">
            <Button
              onClick={handleEmailClick}
              className="w-full bg-black dark:glowing-text hover:bg-black/90 shadow-[0_0_20px_rgba(246,0,247,0.4)] hover:shadow-[0_0_30px_rgba(246,0,247,0.8)] transition-all duration-300 font-semibold"
            >
              <i className="fi fi-ts-paper-plane mr-2 dark:glowing-text"></i>
              Send Email
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-white/30 text-purple-900 hover:bg-white/10"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
