import {
  getPianoKeyId,
  getPianoKeyMidi,
  type PianoKeyInput,
  type PianoKeyState,
} from "@ryhrm-gz/audio-ui-core";

export function resolvePianoKey(
  keys: readonly PianoKeyState[],
  keyInput: PianoKeyInput,
): PianoKeyState | undefined {
  const keyId = getPianoKeyId(keyInput);
  const midi = getPianoKeyMidi(keyInput);

  return keys.find((key) => key.id === keyId || key.midi === midi);
}
