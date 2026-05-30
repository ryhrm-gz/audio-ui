---
title: Getting Started
description: Install Audio UI packages and render accessible knob, slider, and fader controls in React.
---

# Getting Started

Audio UI provides two packages:

- `@ryhrm-gz/audio-ui-core` contains framework-agnostic math and state helpers.
- `@ryhrm-gz/audio-ui-react` contains headless React components built on top of the core package.

Install the React package in your app:

```sh
pnpm add @ryhrm-gz/audio-ui-react
```

Use the compound component API to assemble the DOM structure you want. Audio UI owns behavior, ARIA attributes, data attributes, CSS variables, and hidden form inputs; your app owns the visual styling.

```tsx
import { Knob } from "@ryhrm-gz/audio-ui-react";

export function GainKnob() {
  return (
    <Knob.Root defaultValue={0} min={-60} max={12} step={0.5} name="gain">
      <Knob.Control aria-label="Gain">
        <Knob.Thumb />
      </Knob.Control>
      <Knob.Value format={(value) => `${value} dB`} />
      <Knob.HiddenInput />
    </Knob.Root>
  );
}
```

## Styling

The React components are headless. Parts expose stable attributes and CSS variables that you can target from your own styles:

```css
[data-audio-ui="knob"] [data-part="control"] {
  touch-action: none;
}

[data-audio-ui="knob"] [data-part="thumb"] {
  transform: rotate(var(--knob-angle));
}

[data-audio-ui="slider"] [data-part="range"] {
  left: calc(var(--slider-range-start-percent) * 100%);
  width: calc(var(--slider-range-size-percent) * 100%);
}
```

## Controlled and uncontrolled values

All controls support uncontrolled state with `defaultValue` and controlled state with `value` plus `onValueChange`.

```tsx
import { useState } from "react";
import { Slider } from "@ryhrm-gz/audio-ui-react";

export function PanSlider() {
  const [pan, setPan] = useState(0);

  return (
    <Slider.Root value={pan} onValueChange={setPan} min={-100} max={100} step={1} origin="center">
      <Slider.Track>
        <Slider.Range />
        <Slider.Thumb aria-label="Pan" />
      </Slider.Track>
      <Slider.Value format={(value) => `${value}%`} />
    </Slider.Root>
  );
}
```

Use `onValueCommit` for expensive updates that should run after pointer, touch, or keyboard interaction commits the current value.
