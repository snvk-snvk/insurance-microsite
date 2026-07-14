import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { JourneyProvider } from "@/lib/journey/JourneyProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider mode="site">
      <JourneyProvider>
        <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col">
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </div>
      </JourneyProvider>
    </ThemeProvider>
  );
}
