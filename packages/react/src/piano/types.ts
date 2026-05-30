import type {
  PianoKeyInput,
  PianoKeyState,
  PianoOptions,
  PianoState,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export interface PianoRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "children" | "defaultValue" | "onChange">,
    PianoOptions {
  pressedKeys?: readonly PianoKeyInput[];
  defaultPressedKeys?: readonly PianoKeyInput[];
  disabled?: boolean;
  readOnly?: boolean;
  allowMultiple?: boolean;
  children?: ReactNode | ((state: RenderState<PianoState>) => ReactNode);
  onPressedKeysChange?: (keys: PianoKeyState[]) => void;
  onPressKey?: (key: PianoKeyState) => void;
  onReleaseKey?: (key: PianoKeyState) => void;
  render?: RenderProp<ElementProps, PianoState>;
}

export interface PianoKeysProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children?:
    | ReactNode
    | ((key: RenderState<PianoKeyState>, state: RenderState<PianoState>) => ReactNode);
  render?: RenderProp<ElementProps, PianoState>;
}

export interface PianoKeyProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "value"
> {
  pianoKey: PianoKeyInput;
  children?: ReactNode | ((state: RenderState<PianoKeyState>) => ReactNode);
  render?: RenderProp<ElementProps, PianoKeyState>;
}
