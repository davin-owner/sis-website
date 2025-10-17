"use client";
import { useState } from "react";
import { Button } from "../ui/Button";

interface DebugButtonProps {
  label: string;
  endpoint: string;
  dataLabel?: string;
}

export default function DebugButtonClient({
  label,
  endpoint,
  dataLabel = "Data",
}: DebugButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(`${dataLabel}:`, data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        size="default"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Loading..." : label}
      </Button>
    </div>
  );
}
