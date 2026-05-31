---
title: Core API
description: Reference for framework-agnostic Audio UI state helpers, value normalization, keyboard behavior, fader math, and meter conversion.
---

# Core API

`@ryhrm-gz/audio-ui-core` exposes framework-agnostic helpers for value math, state construction, keyboard behavior, pointer mapping, and meter conversion. The React package uses these helpers internally, and applications can use them directly for custom renderers.

```ts
import {
  createFaderState,
  createEnvelopeEditorState,
  createKnobState,
  createLevelMeterState,
  createPianoState,
  createRangeSliderState,
  createSliderState,
  createStepSequencerState,
  createToggleButtonState,
  createToggleGroupState,
  createXYPadState,
} from "@ryhrm-gz/audio-ui-core";
```

## State helpers

| Helper                                      | Purpose                                                                           |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| `createEnvelopeEditorState(value, options)` | Clamps and quantizes ADSR values, then derives editable points and segments       |
| `createFaderState(value, options)`          | Applies the fader scale law and derives value, percent, unity, and scale marks    |
| `createKnobState(value, options)`           | Clamps and quantizes a value, then derives percent and rotary angle               |
| `createLevelMeterState(value, options)`     | Clamps meter dB values, then derives per-channel fill, peak, and clipping state   |
| `createPianoState(keys, options)`           | Resolves a piano key range and marks the currently pressed keys                   |
| `createRangeSliderState(value, options)`    | Normalizes `[lower, upper]`, enforces thumb distance, and derives range percents  |
| `createSliderState(value, options)`         | Clamps and quantizes a value, then derives value, origin, and range-fill percents |
| `createStepSequencerState(value, options)`  | Normalizes a boolean step grid and derives tracks, steps, playhead, and positions |
| `createToggleButtonState(value, options)`   | Creates serializable pressed state for toggle or momentary buttons                |
| `createToggleGroupState(value, options)`    | Normalizes single or multiple group values and derives selected values            |
| `createXYPadState(value, options)`          | Clamps and quantizes X/Y values, then derives independent axis percents           |

## Value utilities

Use component-specific value helpers when building a custom renderer:

```ts
import {
  getKnobPercent,
  getRangeSliderPercent,
  getSliderPercent,
  getXYPadPercent,
  normalizeEnvelopeEditorValue,
  normalizeFaderValue,
} from "@ryhrm-gz/audio-ui-core";

const knobPercent = getKnobPercent(-6, { min: -60, max: 12, step: 0.5 });
const rangePercent = getRangeSliderPercent([20, 80], { min: 0, max: 100, step: 1 });
const sliderPercent = getSliderPercent(25, { min: 0, max: 100, step: 1 });
const xyPercent = getXYPadPercent({ x: 25, y: 75 });
const envelopeValue = normalizeEnvelopeEditorValue({
  attack: 0.02,
  decay: 0.18,
  sustain: 0.65,
  release: 0.4,
});
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
import {
  getNextRangeSliderKeyboardValue,
  getNextSliderKeyboardValue,
  getNextXYPadKeyboardValue,
} from "@ryhrm-gz/audio-ui-core";

const nextValue = getNextSliderKeyboardValue(0, "ArrowRight", {
  min: -100,
  max: 100,
  step: 1,
});
const nextRange = getNextRangeSliderKeyboardValue([20, 80], 0, "ArrowRight", {
  min: 0,
  max: 100,
  step: 1,
  minStepsBetweenThumbs: 2,
});
const nextPadValue = getNextXYPadKeyboardValue({ x: 50, y: 50 }, "ArrowUp");
```

Toggle group keyboard helpers calculate focus movement while skipping disabled items.

```ts
import { getNextToggleGroupFocusedIndex } from "@ryhrm-gz/audio-ui-core";

const nextIndex = getNextToggleGroupFocusedIndex(0, "ArrowRight", [{}, { disabled: true }, {}]);
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
