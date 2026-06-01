import type { CompressorCurveState } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext } from "react";

export interface CompressorCurveContextValue {
  state: CompressorCurveState;
  disabled: boolean;
  valueId: string;
  name?: string;
  required?: boolean;
}

export const CompressorCurveContext = createContext<CompressorCurveContextValue | undefined>(
  undefined,
);

export function useCompressorCurveContext(partName: string) {
  const context = useContext(CompressorCurveContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside CompressorCurve.Root.`);
  }

  return context;
}
