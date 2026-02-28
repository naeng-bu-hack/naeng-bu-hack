import { useMemo, useState } from 'react';

import { FLOW_STEPS } from '../mock/fixtures';

export function useFlowState() {
  const [stepIndex, setStepIndex] = useState(0);

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < FLOW_STEPS.length - 1;

  const currentStep = useMemo(() => FLOW_STEPS[stepIndex], [stepIndex]);

  function next() {
    if (canGoNext) {
      setStepIndex((prev) => prev + 1);
    }
  }

  function prev() {
    if (canGoBack) {
      setStepIndex((prev) => prev - 1);
    }
  }

  return {
    currentStep,
    stepIndex,
    totalSteps: FLOW_STEPS.length,
    canGoBack,
    canGoNext,
    next,
    prev,
  };
}
