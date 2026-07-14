import { ConfiguratorForm } from "@/components/configurator/ConfiguratorForm";
import { LivePreviewPanel } from "@/components/configurator/LivePreviewPanel";
import { ShareLinkPanel } from "@/components/configurator/ShareLinkPanel";

export default function ConfiguratorPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:items-start">
      <div className="flex-1 lg:max-w-md">
        <h1 className="text-2xl font-bold">Microsite configurator</h1>
        <p className="mt-1 text-sm text-black/60">
          Customize the branding of the public insurance microsite. Changes
          save automatically to this browser.
        </p>
        <div className="mt-8 flex flex-col gap-8">
          <ConfiguratorForm />
          <ShareLinkPanel />
        </div>
      </div>
      <div className="flex-1 lg:sticky lg:top-10">
        <LivePreviewPanel />
      </div>
    </main>
  );
}
