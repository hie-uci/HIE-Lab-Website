"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, DraftingCompass } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const modes = [
    { id: "light", icon: Sun, label: "Cleanroom" },
    { id: "dark", icon: Moon, label: "Dark Space" },
  ];

  return (
    <div className="flex items-center p-1 rounded-full glass-ios shadow-sm">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = theme === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => setTheme(mode.id)}
            className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
              isActive ? "text-uci-blue dark:text-blue-400" : "text-gray-500 hover:text-foreground"
            }`}
            title={mode.label}
          >
            {isActive && (
              <motion.div
                layoutId="theme-active"
                className="absolute inset-0 rounded-full bg-white/80 dark:bg-white/10 shadow-sm"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
          </button>
        );
      })}
    </div>
  );
}
