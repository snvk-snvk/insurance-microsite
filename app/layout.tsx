import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Poppins, Lora } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Additional display fonts selectable per-journey in the admin editor.
// Each exposes a CSS var; lib/theme/apply.ts swaps --font-sans between them.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Suraksha Health - Demo Insurance Microsite",
  description:
    "A configurable demo health insurance microsite: quote, proposal, payment, and policy PDF.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

// Runs before hydration so a returning visitor's saved brand colors apply
// immediately instead of flashing the default theme first (same technique
// next-themes uses for dark mode).
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = window.localStorage.getItem('insurance-microsite:theme');
    if (!raw) return;
    var theme = JSON.parse(raw);
    var root = document.documentElement;
    function contrast(hex) {
      var r = parseInt(hex.slice(1, 3), 16) / 255;
      var g = parseInt(hex.slice(3, 5), 16) / 255;
      var b = parseInt(hex.slice(5, 7), 16) / 255;
      function lin(c) { return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
      var l = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      return l > 0.5 ? '#0a0a0a' : '#ffffff';
    }
    if (theme.colors && theme.colors.primary) {
      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-primary-foreground', contrast(theme.colors.primary));
    }
    if (theme.colors && theme.colors.secondary) {
      root.style.setProperty('--color-secondary', theme.colors.secondary);
      root.style.setProperty('--color-secondary-foreground', contrast(theme.colors.secondary));
    }
    var fonts = { geist: 'var(--font-geist-sans)', inter: 'var(--font-inter)', poppins: 'var(--font-poppins)', lora: 'var(--font-lora)' };
    if (theme.font && fonts[theme.font]) {
      root.style.setProperty('--font-sans', fonts[theme.font]);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
