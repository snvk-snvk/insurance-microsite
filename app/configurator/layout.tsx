import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default function ConfiguratorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ThemeProvider mode="editor">{children}</ThemeProvider>;
}
