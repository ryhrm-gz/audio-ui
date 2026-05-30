import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { Piano } from "./index.ts";

describe("Piano", () => {
  test("renders the root and generated key parts", () => {
    const markup = renderToStaticMarkup(
      <Piano.Root defaultPressedKeys={["C4", "D4"]} keyCount={4} startKey="C4">
        <Piano.Keys />
      </Piano.Root>,
    );

    expect(markup).toContain('data-audio-ui="piano"');
    expect(markup).toContain('data-part="keys"');
    expect(markup).toContain('data-part="key"');
    expect(markup).toContain('data-key-id="C4"');
    expect(markup).toContain('data-key-id="C#4"');
    expect(markup).toContain('data-midi="60"');
    expect(markup).toContain('data-color="white"');
    expect(markup).toContain('data-color="black"');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain("--piano-key-count:4");
  });

  test("passes pressed key details when pressing a key", () => {
    const changes: string[][] = [];
    const presses: string[] = [];
    let handlePointerDown: ((event: PointerEvent<HTMLButtonElement>) => void) | undefined;

    renderToStaticMarkup(
      <Piano.Root
        keyCount={3}
        startKey="C4"
        onPressedKeysChange={(keys) => changes.push(keys.map((key) => key.id))}
        onPressKey={(key) => presses.push(key.id)}
      >
        <Piano.Key
          pianoKey="D4"
          render={(props) => {
            handlePointerDown = props.onPointerDown as typeof handlePointerDown;
            return <button>{props.children as ReactNode}</button>;
          }}
        />
      </Piano.Root>,
    );

    handlePointerDown?.(createPointerEvent());

    expect(changes).toEqual([["D4"]]);
    expect(presses).toEqual(["D4"]);
  });

  test("passes pressed key details when releasing a controlled key", () => {
    const changes: string[][] = [];
    const releases: string[] = [];
    let handleKeyUp: ((event: KeyboardEvent<HTMLButtonElement>) => void) | undefined;

    renderToStaticMarkup(
      <Piano.Root
        pressedKeys={["D4"]}
        keyCount={3}
        startKey="C4"
        onPressedKeysChange={(keys) => changes.push(keys.map((key) => key.id))}
        onReleaseKey={(key) => releases.push(key.id)}
      >
        <Piano.Key
          pianoKey="D4"
          render={(props) => {
            handleKeyUp = props.onKeyUp as typeof handleKeyUp;
            return <button>{props.children as ReactNode}</button>;
          }}
        />
      </Piano.Root>,
    );

    const event = createKeyboardEvent(" ");
    handleKeyUp?.(event);

    expect(changes).toEqual([[]]);
    expect(releases).toEqual(["D4"]);
    expect(event.defaultPrevented).toBe(true);
  });

  test("supports custom key rendering", () => {
    const markup = renderToStaticMarkup(
      <Piano.Root keyCount={2} startKey="C4">
        <Piano.Keys>
          {(key) => <Piano.Key pianoKey={key.id}>{`${key.note}:${key.octave}`}</Piano.Key>}
        </Piano.Keys>
      </Piano.Root>,
    );

    expect(markup).toContain(">C:4</button>");
    expect(markup).toContain(">C#:4</button>");
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<Piano.Key pianoKey="C4" />)).toThrow(
      "Piano.Key must be used inside Piano.Root.",
    );
  });
});

function createPointerEvent(): PointerEvent<HTMLButtonElement> {
  return {
    button: 0,
  } as unknown as PointerEvent<HTMLButtonElement>;
}

function createKeyboardEvent(key: string): KeyboardEvent<HTMLButtonElement> {
  let defaultPrevented = false;

  return {
    key,
    repeat: false,
    get defaultPrevented() {
      return defaultPrevented;
    },
    preventDefault: () => {
      defaultPrevented = true;
    },
  } as unknown as KeyboardEvent<HTMLButtonElement>;
}
