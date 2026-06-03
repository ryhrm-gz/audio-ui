import { forwardRef } from "react";
import { useSpectrumAnalyzerContext } from "./context.tsx";
import type { SpectrumAnalyzerHiddenInputProps } from "./types.ts";

export const HiddenInput = forwardRef<HTMLInputElement, SpectrumAnalyzerHiddenInputProps>(
  function HiddenInput(props, ref) {
    const { name, required, disabled, ...elementProps } = props;
    const context = useSpectrumAnalyzerContext("SpectrumAnalyzer.HiddenInput");

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
