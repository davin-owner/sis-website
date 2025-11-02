"use client";

import { Button } from "@/components/ui/Button";
import { Mail, Send } from 'lucide-react';

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
        className="surface p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <Mail size={60} className="mx-auto text-accent drop-shadow-[0_0_20px_rgba(13,232,205,0.5)]" />
            <h2 className="text-3xl font-bold gradient-text-ink">
              Get in Touch
            </h2>
          </div>

          <p className="text-foreground text-lg">
            Have questions about Simple Ink Studios? We&apos;d love to hear from
            you!
          </p>

          <div className="surface-muted p-5 rounded-xl">
            <p className="text-muted-foreground text-sm mb-2">Email us at:</p>
            <p className="font-mono text-lg break-all font-semibold" style={{ color: 'var(--color-accent-foreground)' }}>
              {businessEmail}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleEmailClick}
              className="w-full btn-primary"
            >
              <Send size={18} className="mr-2" />
              Send Email
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full btn-ghost"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
