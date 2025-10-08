"use client";
import { useState } from "react";
import { Button } from "../ui/Button";

export default function DebugButtonClient(props: { label: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/shops");
      const data = await response.json();
      console.log("Shop Data:", data);
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
        {loading ? "Loading..." : props.label}
      </Button>
    </div>
  );
}
