import { forwardRef } from "react";
import { useCompressorCurveContext } from "./context.tsx";
import type { CompressorCurveHiddenInputProps } from "./types.ts";

export const HiddenInput = forwardRef<HTMLInputElement, CompressorCurveHiddenInputProps>(
  function HiddenInput(props, ref) {
    const { name, required, disabled, ...elementProps } = props;
    const context = useCompressorCurveContext("CompressorCurve.HiddenInput");

    return (
      <input
        {...elementProps}
        ref={ref}
        type="hidden"
        name={name ?? context.name}
        required={required ?? context.required}
        disabled={disabled ?? context.disabled}
        value={JSON.stringify(context.state.value)}
      />
    );
  },
);
