import { forwardRef } from "react";
import { useEQCurveContext } from "./context.tsx";
import type { EQCurveHiddenInputProps } from "./types.ts";

export const HiddenInput = forwardRef<HTMLInputElement, EQCurveHiddenInputProps>(
  function HiddenInput(props, ref) {
    const { name, required, disabled, ...elementProps } = props;
    const context = useEQCurveContext("EQCurve.HiddenInput");

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
