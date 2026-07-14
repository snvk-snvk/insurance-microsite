import { ConfiguratorTabs } from "@/components/configurator/ConfiguratorTabs";

export default function ConfiguratorPage() {
  return (
    <main className="mx-auto w-full min-h-screen max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Microsite configurator</h1>
      <p className="mt-1 text-sm text-black/60">
        Customize the branding of the public insurance microsite, and review
        analytics across the versions you&apos;ve configured.
      </p>
      <div className="mt-8">
        <ConfiguratorTabs />
      </div>
    </main>
  );
}
