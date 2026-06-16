"use client";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  accent?: "primary" | "parent";
}

export function StepIndicator({
  steps,
  currentStep,
  accent = "parent",
}: StepIndicatorProps) {
  const accentColor = accent === "parent" ? "bg-parent" : "bg-primary";
  const accentText = accent === "parent" ? "text-parent" : "text-primary";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;

          return (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isActive || isComplete
                      ? `${accentColor} text-white`
                      : "bg-border text-muted"
                  )}
                >
                  {isComplete ? "✓" : stepNumber}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium font-[family-name:var(--font-inter)]",
                    isActive ? accentText : "text-muted"
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 mb-5 h-0.5 flex-1",
                    stepNumber < currentStep ? accentColor : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
