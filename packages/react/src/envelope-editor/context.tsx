import type {
  EnvelopeEditorPointId,
  EnvelopeEditorState,
  EnvelopeEditorValue,
} from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext, type RefObject } from "react";
import type { FineControlAxesProp } from "../shared/fine-control.ts";

export interface EnvelopeEditorContextValue {
  state: EnvelopeEditorState;
  disabled: boolean;
  readOnly: boolean;
  fineControl: FineControlAxesProp<"time" | "level">;
  getFineFactor: (axis: "time" | "level") => number;
  draggingPoint: EnvelopeEditorPointId | null;
  valueId: string;
  name?: string;
  required?: boolean;
  graphRef: RefObject<HTMLDivElement | null>;
  setDraggingPoint: (point: EnvelopeEditorPointId | null) => void;
  setValue: (value: EnvelopeEditorValue, options?: EnvelopeEditorValueChangeOptions) => void;
  commitValue: (value: EnvelopeEditorValue, options?: EnvelopeEditorValueChangeOptions) => void;
}

export interface EnvelopeEditorValueChangeOptions {
  fine?: boolean;
  activePoint?: EnvelopeEditorPointId | null;
}

export const EnvelopeEditorContext = createContext<EnvelopeEditorContextValue | undefined>(
  undefined,
);

export function useEnvelopeEditorContext(partName: string) {
  const context = useContext(EnvelopeEditorContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside EnvelopeEditor.Root.`);
  }

  return context;
}
