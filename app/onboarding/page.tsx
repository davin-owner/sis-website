"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { createShop } from "./actions";

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createShop(formData);

      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else if (result?.success) {
        // Success! Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container--narrow">
      <div className="surface">
        <form className="surface-elevate" onSubmit={handleSubmit}>
          <div className="text-center">
            <Label className="text-3xl">Create Your Shop</Label>
          </div>

          {error && (
            <div className="p-5">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          )}

          <div className="p-5">
            <Label className="text-1xl">Name Of Shop</Label>
            <Input
              name="shop_name"
              type="text"
              placeholder="Master Tattoo Shop"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="p-5">
            <Label className="text-1xl">Address Of Shop</Label>
            <Input
              name="shop_address"
              type="text"
              autoComplete="address"
              placeholder="123 Main Street"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="p-5">
            <Label className="text-1xl">Amount Of Workers</Label>
            <Input
              name="amount_of_workers"
              type="number"
              min="1"
              defaultValue="1"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="">
            <Button
              name="submit_button"
              type="submit"
              variant={"outline"}
              size={"lg"}
              className="bg-accent hover:bg-accent-hover"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Shop...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
