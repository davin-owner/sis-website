"use client";
import React, { createContext, useContext, ReactNode } from "react";

// defining what a shop is with a typescript object and interface
interface shopObject {
  shop_id: string;
  role: string;
  permissions: string;
  last_accessed_at: string;
  // nested values for the shop
  shop_name: string;
  shop_address: string;
  amount_of_workers: string;
  created_at: string;
}

export const ShopDataContext = createContext<shopObject | null>(null);
export default function ShopProvider({
  shop,
  children,
}: {
  shop: shopObject;
  children: ReactNode;
}) {
  return (
    <ShopDataContext.Provider value={shop}>{children}</ShopDataContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopDataContext);

  if (!context) {
    throw new Error("useShop must be used with in a ShopProiver");
  }
  return context;
}
