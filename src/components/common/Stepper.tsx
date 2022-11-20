import React, { MouseEventHandler, ReactNode } from "react";
import iconNames from "./icons";

interface Step {
  icon: string;
  title: string;
}

export default function Stepper({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  const getCircleColors = (step: Step, index: number) => {
    const completedStep = index < currentStep;
    if (completedStep) {
      return "bg-slate-900 text-white border-slate-900";
    } else if (currentStep === index) {
      return "border-fuchsia-500 bg-fuchsia-500 text-white";
    } else {
      return "border-gray-400";
    }
  };

  const getLineColor = (step: Step, index: number) => {
    const completedStep = index < currentStep;
    if (completedStep) {
      return "border-slate-900";
    } else {
      return "border-gray-400";
    }
  };

  return (
    <div className="mx-4 mb-16 p-4">
      <div className="flex items-center">
        {steps.map((step, index) => {
          return (
            <React.Fragment key={`step-${index}`}>
              <div className="relative flex  items-center text-gray-400">
                <div
                  className={`flex h-12 w-12  items-center justify-center rounded-full border-2 ${getCircleColors(
                    step,
                    index
                  )} py-3 transition duration-500 ease-in-out`}
                >
                  {iconNames[step.icon]}
                </div>
                <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium text-fuchsia-500">
                  {step.title}
                </div>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={`flex-auto border-t-2 ${getLineColor(
                    step,
                    index
                  )} transition duration-500 ease-in-out`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
