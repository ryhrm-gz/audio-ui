---
title: React API
description: Reference for Audio UI React exports, compound component namespaces, render props, and styling hooks.
---

# React API

Import compound component namespaces from `@ryhrm-gz/audio-ui-react`:

```tsx
import {
  Fader,
  Knob,
  LevelMeter,
  Piano,
  Slider,
  ToggleButton,
  ToggleGroup,
  XYPad,
} from "@ryhrm-gz/audio-ui-react";
```

Named part exports are also available for tree-shaking or local naming:

```tsx
import { KnobRoot, ToggleGroupItem, ToggleGroupRoot } from "@ryhrm-gz/audio-ui-react";
```

## Common root behavior

Knob, Fader, and Slider roots support controlled and uncontrolled numeric value modes. XYPad uses the same pattern with `{ x, y }` object values:

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

## Piano root behavior

`Piano` renders a pressable keyboard without producing audio. `Piano.Root` accepts
`startKey` and `keyCount` to define the generated range, `pressedKeys` or
`defaultPressedKeys` for controlled or uncontrolled pressed state, and
`onPressedKeysChange` to receive the currently pressed key objects.

```tsx
<Piano.Root startKey="C4" keyCount={24} onPressedKeysChange={(keys) => console.log(keys)}>
  <Piano.Keys />
</Piano.Root>
```

Use `onPressKey` and `onReleaseKey` when individual press and release events are more
convenient than the full pressed-key list.

## Toggle behavior

`ToggleButton` renders a single `button` with `aria-pressed` for mute, solo, bypass, and momentary preview controls. `ToggleGroup` groups `ToggleGroup.Item` buttons for single-select mode choices or multiple selected states.

```tsx
<ToggleGroup.Root type="multiple" defaultValue={["mute"]} name="track-state">
  <ToggleGroup.Item value="mute">Mute</ToggleGroup.Item>
  <ToggleGroup.Item value="solo">Solo</ToggleGroup.Item>
  <ToggleGroup.HiddenInput />
</ToggleGroup.Root>
```

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
| `--xypad-x`                           | `XYPad.Root`, `XYPad.Area`, `XYPad.Thumb`                     | Current X-axis value                   |
| `--xypad-y`                           | `XYPad.Root`, `XYPad.Area`, `XYPad.Thumb`                     | Current Y-axis value                   |
| `--xypad-x-percent`                   | `XYPad.Root`, `XYPad.Area`, `XYPad.Thumb`                     | Normalized X position from `0` to `1`  |
| `--xypad-y-percent`                   | `XYPad.Root`, `XYPad.Area`, `XYPad.Thumb`                     | Normalized Y position from `0` to `1`  |
| `--fader-percent`                     | `Fader.Track`, `Fader.Range`, `Fader.Thumb`                   | Fader-law position from `0` to `1`     |
| `--fader-unity-percent`               | `Fader.Track`                                                 | Position of the unity mark             |
| `--fader-mark-percent`                | `Fader.Scale` marks                                           | Position for each scale mark           |
| `--level-meter-percent`               | `LevelMeter.Bar`                                              | Channel level from `0` to `1`          |
| `--level-meter-peak-percent`          | `LevelMeter.Peak`                                             | Channel peak from `0` to `1`           |
| `--level-meter-mark-percent`          | `LevelMeter.Scale` marks                                      | Position for each scale mark           |
| `--level-meter-segment-start-percent` | `LevelMeter.Segments` segments                                | Lower edge of a level band             |
| `--level-meter-segment-size-percent`  | `LevelMeter.Segments` segments                                | Height of a level band                 |
| `--piano-key-count`                   | `Piano.Root`, `Piano.Keys`                                    | Number of rendered piano keys          |
| `--piano-white-key-count`             | `Piano.Root`, `Piano.Keys`                                    | Number of white keys in the range      |
| `--piano-key-start-percent`           | `Piano.Key`                                                   | Key start position from `0` to `1`     |
| `--piano-key-size-percent`            | `Piano.Key`                                                   | Key size from `0` to `1`               |
