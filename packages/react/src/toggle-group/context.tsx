import type { ToggleGroupState } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext, type RefObject } from "react";

export interface ToggleGroupRegisteredItem {
  value: string;
  disabled: boolean;
  ref: RefObject<HTMLButtonElement | null>;
}

export interface ToggleGroupContextValue {
  state: ToggleGroupState;
  disabled: boolean;
  name: string | undefined;
  required: boolean | undefined;
  setItemValue: (value: string, disabled?: boolean) => void;
  isItemPressed: (value: string) => boolean;
  registerItem: (item: ToggleGroupRegisteredItem) => () => void;
  moveFocus: (value: string, key: string) => boolean;
}

export const ToggleGroupContext = createContext<ToggleGroupContextValue | undefined>(undefined);

export function useToggleGroupContext(partName: string) {
  const context = useContext(ToggleGroupContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside ToggleGroup.Root.`);
  }

  return context;
}
