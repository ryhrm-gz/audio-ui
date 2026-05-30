import type { LevelMeterState } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext } from "react";

export interface LevelMeterContextValue {
  state: LevelMeterState;
  disabled: boolean;
}

export const LevelMeterContext = createContext<LevelMeterContextValue | undefined>(undefined);

export function useLevelMeterContext(partName: string) {
  const context = useContext(LevelMeterContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside LevelMeter.Root.`);
  }

  return context;
}
