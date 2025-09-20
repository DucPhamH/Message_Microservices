"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

// Button variant - simple toggle between light/dark
export function ThemeToggleButton() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

// Dropdown variant - allows system/light/dark selection
export function ThemeToggleDropdown() {
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = React.useState(false);

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-32 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setOpen(false);
                  }}
                  className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
                    theme === themeOption.value
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{themeOption.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Switch variant - toggle with labels
export function ThemeToggleSwitch() {
  const { setTheme, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
          isDark ? "bg-primary" : "bg-input"
        }`}
        role="switch"
        aria-checked={isDark}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-lg transition-transform ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <Moon className="h-4 w-4" />
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}

// More advanced menu component
export function ThemeToggleMenu() {
  const { setTheme, theme, themes } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9">
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg bg-background">
      <span className="text-sm font-medium">Theme:</span>
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-3 py-1 text-xs rounded transition-colors capitalize ${
            theme === t
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
