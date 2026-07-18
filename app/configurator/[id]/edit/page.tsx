import { MicrositeEditor } from "@/components/admin/MicrositeEditor";

export default async function EditJourneyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MicrositeEditor micrositeId={id} />;
}
