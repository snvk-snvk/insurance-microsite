"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { ColorField } from "@/components/theme/ColorField";
import { LogoUploader } from "@/components/theme/LogoUploader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ConfiguratorForm() {
  const { theme, updateTheme, resetTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="Brand name"
        value={theme.brandName}
        maxLength={40}
        onChange={(e) => updateTheme({ brandName: e.target.value })}
      />
      <Input
        label="Tagline (optional)"
        value={theme.tagline ?? ""}
        maxLength={80}
        onChange={(e) =>
          updateTheme({ tagline: e.target.value || undefined })
        }
      />
      <Input
        label="IM-ID (optional)"
        placeholder="e.g. IMF12345678"
        value={theme.imId ?? ""}
        maxLength={40}
        onChange={(e) => updateTheme({ imId: e.target.value || undefined })}
      />
      <LogoUploader />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ColorField
          label="Primary color"
          value={theme.colors.primary}
          onChange={(hex) =>
            updateTheme({ colors: { ...theme.colors, primary: hex } })
          }
        />
        <ColorField
          label="Secondary color"
          value={theme.colors.secondary}
          onChange={(hex) =>
            updateTheme({ colors: { ...theme.colors, secondary: hex } })
          }
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        onClick={resetTheme}
        className="self-start"
      >
        Reset to default
      </Button>
    </div>
  );
}
