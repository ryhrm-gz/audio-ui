---
title: Core API
description: Reference for framework-agnostic Audio UI state helpers, value normalization, keyboard behavior, and fader math.
---

# Core API

`@audio-ui/core` exposes framework-agnostic helpers for value math, state construction, keyboard behavior, and pointer mapping. The React package uses these helpers internally, and applications can use them directly for custom renderers.

```ts
import { createKnobState, createSliderState, createFaderState } from "@audio-ui/core";
```

## State helpers

| Helper                              | Purpose                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| `createKnobState(value, options)`   | Clamps and quantizes a value, then derives percent and rotary angle                   |
| `createSliderState(value, options)` | Clamps and quantizes a value, then derives percent for horizontal or vertical sliders |
| `createFaderState(value, options)`  | Applies the fader scale law and derives value, percent, unity, and scale marks        |

## Value utilities

Use component-specific value helpers when building a custom renderer:

```ts
import { getKnobPercent, getSliderPercent, normalizeFaderValue } from "@audio-ui/core";

const knobPercent = getKnobPercent(-6, { min: -60, max: 12, step: 0.5 });
const sliderPercent = getSliderPercent(25, { min: 0, max: 100, step: 1 });
const faderValue = normalizeFaderValue(-6.04, { min: -60, max: 12, step: 0.1 });
```

## Keyboard behavior

Core keyboard helpers convert key presses into next values. React parts use the same helpers for arrow keys, page steps, home, and end behavior.

```ts
import { getNextSliderKeyboardValue } from "@audio-ui/core";

const nextValue = getNextSliderKeyboardValue(0, "ArrowRight", {
  min: -100,
  max: 100,
  step: 1,
});
```

## Fader scale

Fader state uses a scale array to map decibels to a physical throw. This makes the control feel more like a mixing console than a linear slider.

```ts
import { createFaderState } from "@audio-ui/core";

const state = createFaderState(-6, {
  min: -60,
  max: 12,
  unity: 0,
  step: 0.1,
});

console.log(state.percent);
```
