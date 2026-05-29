# audio-ui

Headless primitives for audio interfaces.

## Packages

- `@audio-ui/core`: framework-agnostic math and state helpers.
- `@audio-ui/react`: React components built on the core package.

## Knob

```tsx
import { Knob } from "@audio-ui/react";

export function GainKnob() {
  return (
    <Knob.Root defaultValue={0} min={-60} max={12} step={0.5} name="gain">
      <Knob.Control>
        <Knob.Thumb />
      </Knob.Control>
      <Knob.Value format={(value) => `${value} dB`} />
      <Knob.HiddenInput />
    </Knob.Root>
  );
}
```

The React package is headless: it ships behavior, accessibility attributes, data attributes,
and CSS variables such as `--knob-angle`, but no visual styling.
