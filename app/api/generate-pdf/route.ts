import { z } from "zod";
import {
  QuoteInputSchema,
  PlanSelectionSchema,
  ProposalSchema,
  PolicySchema,
} from "@/lib/journey/schema";
import { ThemeSchema } from "@/lib/theme/schema";
import { generatePolicyPdf } from "@/lib/pdf/generatePolicyPdf";

// fontkit (used internally by @react-pdf/renderer) needs Node APIs, so this
// route can't run on the edge runtime.
export const runtime = "nodejs";

const RequestSchema = z.object({
  theme: ThemeSchema,
  quote: QuoteInputSchema,
  plan: PlanSelectionSchema,
  proposal: ProposalSchema,
  policy: PolicySchema,
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const pdfBuffer = await generatePolicyPdf(parsed.data);
  const filename = `policy-${parsed.data.policy.policyNumber.replace(/\//g, "-")}.pdf`;

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
