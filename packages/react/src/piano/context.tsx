import type { PianoKeyInput, PianoKeyState, PianoState } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext } from "react";

export interface PianoContextValue {
  state: PianoState;
  disabled: boolean;
  readOnly: boolean;
  allowMultiple: boolean;
  pressKey: (key: PianoKeyInput) => void;
  releaseKey: (key: PianoKeyInput) => void;
  getKey: (key: PianoKeyInput) => PianoKeyState | undefined;
}

export const PianoContext = createContext<PianoContextValue | undefined>(undefined);

export function usePianoContext(partName: string) {
  const context = useContext(PianoContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside Piano.Root.`);
  }

  return context;
}
