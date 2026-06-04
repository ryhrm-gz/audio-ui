import type {
  SpectrumAnalyzerBin,
  SpectrumAnalyzerBinState,
  SpectrumAnalyzerOptions,
  SpectrumAnalyzerState,
  SpectrumAnalyzerValue as CoreSpectrumAnalyzerValue,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";
export type { SpectrumAnalyzerBin, SpectrumAnalyzerBinState };

export type SpectrumAnalyzerValue = CoreSpectrumAnalyzerValue;

export interface SpectrumAnalyzerRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    SpectrumAnalyzerOptions {
  value?: SpectrumAnalyzerValue;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<SpectrumAnalyzerState>) => ReactNode);
  render?: RenderProp<ElementProps, SpectrumAnalyzerState>;
}

export interface SpectrumAnalyzerGraphProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, SpectrumAnalyzerState>;
}

export interface SpectrumAnalyzerBarsProps extends Omit<
  ComponentPropsWithoutRef<"svg">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, SpectrumAnalyzerState>;
}

export interface SpectrumAnalyzerCurveProps extends Omit<
  ComponentPropsWithoutRef<"svg">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, SpectrumAnalyzerState>;
}

export interface SpectrumAnalyzerValueProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> {
  children?: ReactNode | ((state: RenderState<SpectrumAnalyzerState>) => ReactNode);
  format?: (peak: SpectrumAnalyzerBinState | null, state: SpectrumAnalyzerState) => ReactNode;
  render?: RenderProp<ElementProps, SpectrumAnalyzerState>;
}

export interface SpectrumAnalyzerHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
