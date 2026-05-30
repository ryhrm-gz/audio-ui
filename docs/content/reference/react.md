---
title: React API
description: Reference for Audio UI React exports, compound component namespaces, render props, and styling hooks.
---

# React API

Import compound component namespaces from `@ryhrm-gz/audio-ui-react`:

```tsx
import { Fader, Knob, LevelMeter, Slider } from "@ryhrm-gz/audio-ui-react";
```

Named part exports are also available for tree-shaking or local naming:

```tsx
import { KnobRoot, KnobControl, KnobThumb, KnobValue } from "@ryhrm-gz/audio-ui-react";
```

## Common root behavior

Every root component supports controlled and uncontrolled value modes:

| Prop                   | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `value`                | Controlled numeric value                                     |
| `defaultValue`         | Initial uncontrolled numeric value                           |
| `min` / `max` / `step` | Value range and quantization                                 |
| `disabled`             | Prevents interaction and marks the root with `data-disabled` |
| `readOnly`             | Keeps the control focusable while preventing value changes   |
| `name` / `required`    | Passed to the hidden input part for native forms             |
| `onValueChange`        | Fires when the value changes                                 |
| `onValueCommit`        | Fires when an interaction commits                            |

## Render props

Roots accept function children. The render state includes the normalized state from `@ryhrm-gz/audio-ui-core` plus interaction flags.

```tsx
<Knob.Root defaultValue={0}>
  {(state) => (
    <>
      <Knob.Control aria-label="Gain">
        <Knob.Thumb />
      </Knob.Control>
      <output>{state.value}</output>
    </>
  )}
</Knob.Root>
```

## Custom elements

Parts accept a `render` prop for replacing the default element while preserving generated behavior props.

```tsx
<Slider.Thumb aria-label="Pan" render={(props) => <span {...props} className="thumb" />} />
```

## CSS variables

| Variable                              | Component                                                     | Description                            |
| ------------------------------------- | ------------------------------------------------------------- | -------------------------------------- |
| `--knob-angle`                        | `Knob.Thumb`                                                  | Current rotary angle                   |
| `--slider-percent`                    | `Slider.Root`, `Slider.Track`, `Slider.Range`, `Slider.Thumb` | Normalized value from `0` to `1`       |
| `--slider-origin-percent`             | `Slider.Root`, `Slider.Track`, `Slider.Range`, `Slider.Thumb` | Range origin position from `0` to `1`  |
| `--slider-range-start-percent`        | `Slider.Root`, `Slider.Track`, `Slider.Range`, `Slider.Thumb` | Lower visual fill edge from `0` to `1` |
| `--slider-range-end-percent`          | `Slider.Root`, `Slider.Track`, `Slider.Range`, `Slider.Thumb` | Upper visual fill edge from `0` to `1` |
| `--slider-range-size-percent`         | `Slider.Root`, `Slider.Track`, `Slider.Range`, `Slider.Thumb` | Visual fill size from the origin       |
| `--fader-percent`                     | `Fader.Track`, `Fader.Range`, `Fader.Thumb`                   | Fader-law position from `0` to `1`     |
| `--fader-unity-percent`               | `Fader.Track`                                                 | Position of the unity mark             |
| `--fader-mark-percent`                | `Fader.Scale` marks                                           | Position for each scale mark           |
| `--level-meter-percent`               | `LevelMeter.Bar`                                              | Channel level from `0` to `1`          |
| `--level-meter-peak-percent`          | `LevelMeter.Peak`                                             | Channel peak from `0` to `1`           |
| `--level-meter-mark-percent`          | `LevelMeter.Scale` marks                                      | Position for each scale mark           |
| `--level-meter-segment-start-percent` | `LevelMeter.Segments` segments                                | Lower edge of a level band             |
| `--level-meter-segment-size-percent`  | `LevelMeter.Segments` segments                                | Height of a level band                 |
