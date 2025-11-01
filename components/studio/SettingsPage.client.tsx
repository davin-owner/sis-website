"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Card from "@/components/studio/Card.server";
import {
  updateUserProfileAction,
  updateShopSettingsAction,
} from "@/app/settings/actions";
import { User } from "@supabase/supabase-js";
import { Shop } from "@/lib/database";
import { Save } from "lucide-react";

interface SettingsPageClientProps {
  user: User;
  shop: Shop | null;
  userRole: string | null;
}

export default function SettingsPageClient({
  user,
  shop,
  userRole,
}: SettingsPageClientProps) {
  const [isPending, startTransition] = useTransition();

  // User profile state
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Shop settings state
  const [shopName, setShopName] = useState(shop?.shop_name || "");
  const [shopError, setShopError] = useState("");
  const [shopSuccess, setShopSuccess] = useState("");

  // Check if user can edit shop settings
  const canEditShop = userRole === "owner" || userRole === "admin";

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!email.trim()) {
      setProfileError("Email is required");
      return;
    }

    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await updateUserProfileAction(formData);

      if (result?.error) {
        setProfileError(result.error);
      } else {
        setProfileSuccess("Profile updated successfully!");
        setTimeout(() => setProfileSuccess(""), 3000);
      }
    });
  };

  const handleShopSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShopError("");
    setShopSuccess("");

    if (!shopName.trim()) {
      setShopError("Shop name is required");
      return;
    }

    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await updateShopSettingsAction(formData);

      if (result?.error) {
        setShopError(result.error);
      } else {
        setShopSuccess("Shop settings updated successfully!");
        setTimeout(() => setShopSuccess(""), 3000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* User Profile Settings */}
      <Card title="Profile Settings" subtitle="Manage your account information">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              Changing your email will require verification
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          {profileError && (
            <p className="text-destructive text-sm">{profileError}</p>
          )}
          {profileSuccess && (
            <p className="text-accent text-sm">{profileSuccess}</p>
          )}

          <Button type="submit" disabled={isPending}>
            <Save size={18} className="mr-2" />
            {isPending ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </Card>

      {/* Shop Settings */}
      {shop && (
        <Card
          title="Shop Settings"
          subtitle={
            canEditShop
              ? "Manage your shop information"
              : "You don't have permission to edit shop settings"
          }
        >
          <form onSubmit={handleShopSubmit} className="space-y-4">
            <input type="hidden" name="shop_id" value={shop.id} />

            <div className="space-y-2">
              <Label htmlFor="shop_name">Shop Name *</Label>
              <Input
                id="shop_name"
                name="shop_name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="My Awesome Shop"
                required
                disabled={!canEditShop}
              />
              {!canEditShop && (
                <p className="text-xs text-muted-foreground">
                  Only owners and admins can change shop settings
                </p>
              )}
            </div>

            {shopError && <p className="text-destructive text-sm">{shopError}</p>}
            {shopSuccess && <p className="text-accent text-sm">{shopSuccess}</p>}

            {canEditShop && (
              <Button type="submit" disabled={isPending}>
                <Save size={18} className="mr-2" />
                {isPending ? "Saving..." : "Save Shop Settings"}
              </Button>
            )}
          </form>
        </Card>
      )}

      {/* User Role Info */}
      <Card title="Your Role" subtitle="Your permissions in this shop">
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Role:</span>{" "}
            <span className="capitalize">{userRole || "None"}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {userRole === "owner" && "You have full control over this shop"}
            {userRole === "admin" &&
              "You can manage settings and workers for this shop"}
            {userRole === "worker" &&
              "You can view and manage your own appointments"}
            {!userRole && "You don't have a role in this shop"}
          </p>
        </div>
      </Card>
    </div>
  );
}
