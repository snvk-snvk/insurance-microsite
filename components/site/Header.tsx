"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-black/5 bg-white/90 px-4 backdrop-blur">
      {theme.logoDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={theme.logoDataUrl}
          alt={theme.brandName}
          className="h-8 w-auto object-contain"
        />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
          {theme.brandName.slice(0, 1).toUpperCase()}
        </span>
      )}
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-base font-bold">{theme.brandName}</span>
        {theme.tagline && (
          <span className="truncate text-xs text-black/50">{theme.tagline}</span>
        )}
      </div>
    </header>
  );
}
