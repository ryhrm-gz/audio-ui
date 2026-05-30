# audio-ui

Headless primitives for audio interfaces.

## Packages

- `@ryhrm-gz/audio-ui-core`: framework-agnostic math and state helpers.
- `@ryhrm-gz/audio-ui-react`: React components built on the core package.

## Documentation

Run `vp run docs` to start the Rspress documentation site. The docs import package
source directly, so changes in `packages/*/src` are reflected without building the
packages first.

## Knob

```tsx
import { Knob } from "@ryhrm-gz/audio-ui-react";

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

Pointer interaction uses vertical up/down dragging.

## Fader

```tsx
import { Fader } from "@ryhrm-gz/audio-ui-react";

export function ChannelFader() {
  return (
    <Fader.Root defaultValue={-6} name="channel-gain">
      <Fader.Scale />
      <Fader.Track>
        <Fader.Range />
        <Fader.Thumb aria-label="Channel gain" />
      </Fader.Track>
      <Fader.Value format={(value) => `${value} dB`} />
      <Fader.HiddenInput />
    </Fader.Root>
  );
}
```

Fader is a vertical dB control for console-style channel strips. It defaults to
`-60..+12 dB`, `0.1 dB` steps, a `0 dB` unity point, and a non-linear scale so the
throw has more usable resolution around common mix positions. Use `Fader.Scale`
to render the dB markings, or pass a custom `scale` array to define a different
fader law.

The React package is headless: it ships behavior, accessibility attributes, data attributes,
and CSS variables such as `--knob-angle` and `--fader-percent`, but no visual styling.

## Piano

```tsx
import { Piano } from "@ryhrm-gz/audio-ui-react";

export function MidiKeyboard() {
  return (
    <Piano.Root
      startKey="C4"
      keyCount={24}
      onPressedKeysChange={(keys) => {
        console.log(keys.map((key) => key.midi));
      }}
    >
      <Piano.Keys />
    </Piano.Root>
  );
}
```

Piano renders key press behavior without producing audio. Use `pressedKeys` for controlled
state, `defaultPressedKeys` for uncontrolled state, and `onPressedKeysChange` to receive
the currently pressed key objects.
