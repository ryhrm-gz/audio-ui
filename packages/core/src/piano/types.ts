export type PianoKeyColor = "white" | "black";

export type PianoNoteName =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

export type PianoKeyInput =
  | number
  | string
  | {
      note: string;
      octave: number;
    };

export interface PianoOptions {
  startKey?: PianoKeyInput;
  keyCount?: number;
}

export interface PianoKey {
  id: string;
  note: PianoNoteName;
  octave: number;
  midi: number;
  color: PianoKeyColor;
  index: number;
  semitone: number;
  whiteIndex: number;
  blackIndex?: number;
  startPercent: number;
  sizePercent: number;
}

export interface PianoKeyState extends PianoKey {
  pressed: boolean;
}

export interface PianoState {
  keys: PianoKeyState[];
  pressedKeyIds: string[];
  pressedKeys: PianoKeyState[];
  keyCount: number;
  whiteKeyCount: number;
  startKey: PianoKeyState;
  endKey: PianoKeyState;
}
