import type { ToggleButtonState } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext } from "react";

export interface ToggleButtonContextValue {
  state: ToggleButtonState;
  disabled: boolean;
  name: string | undefined;
  value: string;
  required: boolean | undefined;
}

export const ToggleButtonContext = createContext<ToggleButtonContextValue | undefined>(undefined);

export function useToggleButtonContext(partName: string) {
  const context = useContext(ToggleButtonContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside ToggleButton.Root.`);
  }

  return context;
}
