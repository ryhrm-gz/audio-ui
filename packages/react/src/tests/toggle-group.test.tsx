import type { KeyboardEvent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { ToggleGroup, ToggleGroupItem, ToggleGroupRoot } from "../index.ts";

describe("ToggleGroup", () => {
  test("renders single group state, items, and hidden input", () => {
    const markup = renderToStaticMarkup(
      <ToggleGroup.Root type="single" defaultValue="bandpass" name="filter-mode" required>
        <ToggleGroup.Item value="lowpass">LP</ToggleGroup.Item>
        <ToggleGroup.Item value="bandpass">BP</ToggleGroup.Item>
        <ToggleGroup.Item value="highpass">HP</ToggleGroup.Item>
        <ToggleGroup.HiddenInput />
      </ToggleGroup.Root>,
    );

    expect(markup).toContain('data-audio-ui="toggle-group"');
    expect(markup).toContain('data-part="root"');
    expect(markup).toContain('data-orientation="horizontal"');
    expect(markup).toContain('data-part="item"');
    expect(markup).toContain('data-value="bandpass"');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('data-state="on"');
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="filter-mode"');
    expect(markup).toContain('value="bandpass"');
    expect(markup).toContain("required");
  });

  test("renders repeated hidden inputs for multiple values", () => {
    const markup = renderToStaticMarkup(
      <ToggleGroup.Root type="multiple" defaultValue={["mute", "solo"]} name="track-state">
        <ToggleGroup.Item value="mute">Mute</ToggleGroup.Item>
        <ToggleGroup.Item value="solo">Solo</ToggleGroup.Item>
        <ToggleGroup.Item value="arm">Arm</ToggleGroup.Item>
        <ToggleGroup.HiddenInput />
      </ToggleGroup.Root>,
    );

    expect(markup.match(/type="hidden"/g)).toHaveLength(2);
    expect(markup).toContain('value="mute"');
    expect(markup).toContain('value="solo"');
  });

  test("fires controlled value changes from item click", () => {
    const changes: Array<string | string[]> = [];
    let handleClick: (() => void) | undefined;

    renderToStaticMarkup(
      <ToggleGroup.Root
        type="single"
        value="lowpass"
        onValueChange={(nextValue) => changes.push(nextValue)}
      >
        <ToggleGroup.Item
          value="highpass"
          render={(props) => {
            handleClick = props.onClick as typeof handleClick;
            return <button>{props.children as ReactNode}</button>;
          }}
        >
          HP
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    handleClick?.();

    expect(changes).toEqual(["highpass"]);
  });

  test("does not change disabled items", () => {
    const changes: Array<string | string[]> = [];
    let handleClick: (() => void) | undefined;

    renderToStaticMarkup(
      <ToggleGroup.Root
        type="multiple"
        value={["mute"]}
        onValueChange={(nextValue) => changes.push(nextValue)}
      >
        <ToggleGroup.Item
          disabled
          value="solo"
          render={(props) => {
            handleClick = props.onClick as typeof handleClick;
            return <button>{props.children as ReactNode}</button>;
          }}
        >
          Solo
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    handleClick?.();

    expect(changes).toEqual([]);
  });

  test("handles keyboard navigation events", () => {
    let handleKeyDown: ((event: KeyboardEvent<HTMLButtonElement>) => void) | undefined;

    renderToStaticMarkup(
      <ToggleGroup.Root type="single" defaultValue="lowpass">
        <ToggleGroup.Item
          value="lowpass"
          render={(props) => {
            handleKeyDown = props.onKeyDown as typeof handleKeyDown;
            return <button>{props.children as ReactNode}</button>;
          }}
        >
          LP
        </ToggleGroup.Item>
        <ToggleGroup.Item value="highpass">HP</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    expect(handleKeyDown).toBeDefined();
    handleKeyDown?.({
      key: "ArrowRight",
      preventDefault: () => {},
    } as KeyboardEvent<HTMLButtonElement>);
  });

  test("exports direct compound aliases", () => {
    const markup = renderToStaticMarkup(
      <ToggleGroupRoot defaultValue="mute">
        <ToggleGroupItem value="mute">Mute</ToggleGroupItem>
      </ToggleGroupRoot>,
    );

    expect(markup).toContain('data-audio-ui="toggle-group"');
    expect(markup).toContain('aria-pressed="true"');
  });
});
