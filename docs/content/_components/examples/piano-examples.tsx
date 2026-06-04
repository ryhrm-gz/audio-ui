import { useRef, useState, type MutableRefObject } from "react";
import type { PianoKeyState } from "@ryhrm-gz/audio-ui-core";
import { Piano } from "@ryhrm-gz/audio-ui-react";

interface ActiveNote {
  oscillator: OscillatorNode;
  gain: GainNode;
}

function PianoExample({
  defaultPressedKeys,
  disabled = false,
  keyCount,
  label,
  pressedKeys,
  startKey,
}: {
  defaultPressedKeys?: string[];
  disabled?: boolean;
  keyCount: number;
  label: string;
  pressedKeys?: string[];
  startKey: string;
}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNotesRef = useRef(new Map<string, ActiveNote>());
  const [localPressedKeys, setLocalPressedKeys] = useState<PianoKeyState[]>([]);

  const handlePressKey = (key: PianoKeyState) => {
    if (disabled) {
      return;
    }

    const context = getAudioContext(audioContextRef);

    if (activeNotesRef.current.has(key.id)) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = "triangle";
    oscillator.frequency.value = getFrequencyFromMidi(key.midi);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);

    activeNotesRef.current.set(key.id, { oscillator, gain });
  };

  const handleReleaseKey = (key: PianoKeyState) => {
    const note = activeNotesRef.current.get(key.id);

    if (note === undefined) {
      return;
    }

    const context = audioContextRef.current;
    const now = context?.currentTime ?? 0;

    note.gain.gain.cancelScheduledValues(now);
    note.gain.gain.setTargetAtTime(0, now, 0.03);
    note.oscillator.stop(now + 0.14);
    activeNotesRef.current.delete(key.id);
  };

  return (
    <div className="audio-demo" data-variant="piano">
      <span className="demo-label">{label}</span>
      <Piano.Root
        className="demo-piano"
        defaultPressedKeys={defaultPressedKeys}
        disabled={disabled}
        keyCount={keyCount}
        onPressKey={handlePressKey}
        onPressedKeysChange={setLocalPressedKeys}
        onReleaseKey={handleReleaseKey}
        pressedKeys={pressedKeys}
        startKey={startKey}
      >
        <Piano.Keys className="demo-piano-keys">
          {(key) => (
            <Piano.Key
              aria-label={`${key.note}${key.octave}`}
              className="demo-piano-key"
              pianoKey={key.id}
            >
              {key.color === "white" ? key.note : ""}
            </Piano.Key>
          )}
        </Piano.Keys>
        <output className="demo-readout">
          {localPressedKeys.length === 0
            ? "No key"
            : localPressedKeys.map((key) => key.id).join(" ")}
        </output>
      </Piano.Root>
    </div>
  );
}

export function PianoDefaultChordExample() {
  return (
    <PianoExample
      defaultPressedKeys={["C4", "E4", "G4"]}
      keyCount={12}
      label="Default chord"
      startKey="C4"
    />
  );
}

export function PianoSingleNoteExample() {
  return <PianoExample keyCount={13} label="Single note" pressedKeys={["A4"]} startKey="C4" />;
}

export function PianoDisabledExample() {
  return <PianoExample disabled keyCount={12} label="Disabled" startKey="C4" />;
}

function getAudioContext(audioContextRef: MutableRefObject<AudioContext | null>) {
  audioContextRef.current ??= new AudioContext();

  if (audioContextRef.current.state === "suspended") {
    void audioContextRef.current.resume();
  }

  return audioContextRef.current;
}

function getFrequencyFromMidi(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}
