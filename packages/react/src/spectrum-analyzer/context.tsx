import type { SpectrumAnalyzerState } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext } from "react";

export interface SpectrumAnalyzerContextValue {
  state: SpectrumAnalyzerState;
  disabled: boolean;
  valueId: string;
  name?: string;
  required?: boolean;
}

export const SpectrumAnalyzerContext = createContext<SpectrumAnalyzerContextValue | undefined>(
  undefined,
);

export function useSpectrumAnalyzerContext(partName: string) {
  const context = useContext(SpectrumAnalyzerContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside SpectrumAnalyzer.Root.`);
  }

  return context;
}
