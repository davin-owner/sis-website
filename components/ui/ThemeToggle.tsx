"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, [theme, resolvedTheme]);

  if (!mounted) {
    return (
      <button className="w-14 h-7 rounded-full bg-gray-300 relative">
        <div className="w-5 h-5 rounded-full bg-white absolute top-1 left-1" />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
      }}
      className="w-14 h-7 rounded-full relative transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
      style={{
        backgroundImage:
          theme === "dark"
            ? "linear-gradient(135deg, #06a9cc, #f600f7)" // Light gradient when in dark mode
            : "linear-gradient(135deg, #032633, #2A0534)", // Dark gradient when in light mode
      }}
      aria-label="Toggle theme"
    >
      <div
        className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-lg flex items-center justify-center"
        style={{
          left: theme === "dark" ? "calc(100% - 1.5rem)" : "0.25rem",
        }}
      >
        {theme === "dark" ? (
          <Moon size={12} color="#4b5563" />
        ) : (
          <Sun size={12} color="#f600f7" />
        )}
      </div>
    </button>
  );
}
