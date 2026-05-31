---
title: Core API
description: Reference for framework-agnostic Audio UI state helpers, value normalization, keyboard behavior, fader math, and meter conversion.
---

# Core API

`@ryhrm-gz/audio-ui-core` exposes framework-agnostic helpers for value math, state construction, keyboard behavior, pointer mapping, and meter conversion. The React package uses these helpers internally, and applications can use them directly for custom renderers.

```ts
import {
  createFaderState,
  createKnobState,
  createLevelMeterState,
  createPianoState,
  createSliderState,
  createStepSequencerState,
  createXYPadState,
} from "@ryhrm-gz/audio-ui-core";
```

## State helpers

| Helper                                     | Purpose                                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| `createKnobState(value, options)`          | Clamps and quantizes a value, then derives percent and rotary angle               |
| `createSliderState(value, options)`        | Clamps and quantizes a value, then derives value, origin, and range-fill percents |
| `createXYPadState(value, options)`         | Clamps and quantizes X/Y values, then derives independent axis percents           |
| `createFaderState(value, options)`         | Applies the fader scale law and derives value, percent, unity, and scale marks    |
| `createLevelMeterState(value, options)`    | Clamps meter dB values, then derives per-channel fill, peak, and clipping state   |
| `createPianoState(keys, options)`          | Resolves a piano key range and marks the currently pressed keys                   |
| `createStepSequencerState(value, options)` | Normalizes a boolean step grid and derives tracks, steps, playhead, and positions |

## Value utilities

Use component-specific value helpers when building a custom renderer:

```ts
import {
  getKnobPercent,
  getSliderPercent,
  getXYPadPercent,
  normalizeFaderValue,
} from "@ryhrm-gz/audio-ui-core";

const knobPercent = getKnobPercent(-6, { min: -60, max: 12, step: 0.5 });
const sliderPercent = getSliderPercent(25, { min: 0, max: 100, step: 1 });
const xyPercent = getXYPadPercent({ x: 25, y: 75 });
const faderValue = normalizeFaderValue(-6.04, { min: -60, max: 12, step: 0.1 });
```

## Level meter conversion

Use level meter helpers to convert Web Audio analyzer amplitudes into dB values.

```ts
import { getLevelMeterDbFromAmplitude } from "@ryhrm-gz/audio-ui-core";

const meterValue = getLevelMeterDbFromAmplitude(0.5);
const state = createLevelMeterState([meterValue, -12], { channels: 2 });
```

## Keyboard behavior

Core keyboard helpers convert key presses into next values. React parts use the same helpers for arrow keys, page steps, home, and end behavior.

```ts
import { getNextSliderKeyboardValue, getNextXYPadKeyboardValue } from "@ryhrm-gz/audio-ui-core";

const nextValue = getNextSliderKeyboardValue(0, "ArrowRight", {
  min: -100,
  max: 100,
  step: 1,
});
const nextPadValue = getNextXYPadKeyboardValue({ x: 50, y: 50 }, "ArrowUp");
```

Step sequencers use a focus-target helper because each step is a button in a grid:

```ts
import { resolveStepSequencerKeyboardTarget } from "@ryhrm-gz/audio-ui-core";

const target = resolveStepSequencerKeyboardTarget({ trackIndex: 0, stepIndex: 3 }, "ArrowDown", {
  trackCount: 4,
  stepCount: 16,
});
```

## Fader scale

Fader state uses a scale array to map decibels to a physical throw. This makes the control feel more like a mixing console than a linear slider.

```ts
import { createFaderState } from "@ryhrm-gz/audio-ui-core";

const state = createFaderState(-6, {
  min: -60,
  max: 12,
  unity: 0,
  step: 0.1,
});

console.log(state.percent);
```
