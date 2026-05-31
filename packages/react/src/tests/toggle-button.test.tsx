import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { ToggleButton, ToggleButtonRoot } from "../index.ts";

describe("ToggleButton", () => {
  test("renders pressed state, styling hooks, and hidden input", () => {
    const markup = renderToStaticMarkup(
      <ToggleButton.Root defaultPressed name="mute" value="on" required>
        Mute
        <ToggleButton.HiddenInput />
      </ToggleButton.Root>,
    );

    expect(markup).toContain('data-audio-ui="toggle-button"');
    expect(markup).toContain('data-part="root"');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('data-state="on"');
    expect(markup).toContain('data-pressed=""');
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('data-part="hidden-input"');
    expect(markup).toContain('name="mute"');
    expect(markup).toContain('value="on"');
    expect(markup).toContain("required");
  });

  test("does not render a hidden input when off", () => {
    const markup = renderToStaticMarkup(
      <ToggleButton.Root name="bypass">
        Bypass
        <ToggleButton.HiddenInput />
      </ToggleButton.Root>,
    );

    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain('data-state="off"');
    expect(markup).not.toContain('type="hidden"');
  });

  test("fires controlled toggle changes from click", () => {
    const changes: boolean[] = [];
    let handleClick: (() => void) | undefined;

    renderToStaticMarkup(
      <ToggleButton.Root
        pressed={false}
        onPressedChange={(nextPressed) => changes.push(nextPressed)}
        render={(props) => {
          handleClick = props.onClick as typeof handleClick;
          return <button>{props.children as ReactNode}</button>;
        }}
      >
        Mute
      </ToggleButton.Root>,
    );

    handleClick?.();

    expect(changes).toEqual([true]);
  });

  test("supports momentary pointer and keyboard changes", () => {
    const changes: boolean[] = [];
    let handlePointerDown: ((event: PointerEvent<HTMLButtonElement>) => void) | undefined;
    let handlePointerUp: (() => void) | undefined;
    let handleKeyDown: ((event: KeyboardEvent<HTMLButtonElement>) => void) | undefined;

    renderToStaticMarkup(
      <ToggleButton.Root
        mode="momentary"
        pressed={false}
        onPressedChange={(nextPressed) => changes.push(nextPressed)}
        render={(props) => {
          handlePointerDown = props.onPointerDown as typeof handlePointerDown;
          handlePointerUp = props.onPointerUp as typeof handlePointerUp;
          handleKeyDown = props.onKeyDown as typeof handleKeyDown;
          return <button>{props.children as ReactNode}</button>;
        }}
      >
        Preview
      </ToggleButton.Root>,
    );

    handlePointerDown?.({ button: 0 } as PointerEvent<HTMLButtonElement>);
    handlePointerUp?.();
    handleKeyDown?.({ key: " ", repeat: false } as KeyboardEvent<HTMLButtonElement>);

    expect(changes).toEqual([true, true]);
  });

  test("exports direct root alias", () => {
    const markup = renderToStaticMarkup(<ToggleButtonRoot defaultPressed>Arm</ToggleButtonRoot>);

    expect(markup).toContain('data-audio-ui="toggle-button"');
  });
});
