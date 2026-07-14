import { cn } from "@/lib/utils/cn";

const STEPS = [
  { key: "quote", label: "Quote" },
  { key: "proposal", label: "Proposal" },
  { key: "payment", label: "Payment" },
  { key: "done", label: "Done" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export function ProgressSteps({ current }: { current: StepKey }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2">
        {STEPS.map((step, i) => (
          <div
            key={step.key}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i <= currentIndex ? "bg-brand" : "bg-black/10"
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-xs font-medium text-black/50">
        Step {currentIndex + 1} of {STEPS.length}: {STEPS[currentIndex].label}
      </p>
    </div>
  );
}
