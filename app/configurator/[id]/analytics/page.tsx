import { MicrositeAnalytics } from "@/components/admin/MicrositeAnalytics";

export default async function JourneyAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MicrositeAnalytics micrositeId={id} />;
}
