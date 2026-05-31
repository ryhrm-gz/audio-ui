import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { StepSequencer } from "./index.ts";

describe("StepSequencer", () => {
  test("renders the root, generated tracks, steps, playhead, and hidden input", () => {
    const markup = renderToStaticMarkup(
      <StepSequencer.Root
        defaultValue={[
          [true, false, false, true],
          [false, false, true, false],
        ]}
        name="pattern"
        playhead={2}
      >
        <StepSequencer.Tracks />
        <StepSequencer.Playhead />
        <StepSequencer.HiddenInput />
      </StepSequencer.Root>,
    );

    expect(markup).toContain('data-audio-ui="step-sequencer"');
    expect(markup).toContain('data-part="tracks"');
    expect(markup).toContain('data-part="track"');
    expect(markup).toContain('data-part="steps"');
    expect(markup).toContain('data-part="step"');
    expect(markup).toContain('data-track-index="1"');
    expect(markup).toContain('data-step-index="2"');
    expect(markup).toContain('data-active=""');
    expect(markup).toContain('data-playhead=""');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain("--step-sequencer-track-count:2");
    expect(markup).toContain("--step-sequencer-step-count:4");
    expect(markup).toContain('name="pattern"');
    expect(markup).toContain('value="[[true,false,false,true],[false,false,true,false]]"');
  });

  test("supports custom step rendering", () => {
    const markup = renderToStaticMarkup(
      <StepSequencer.Root defaultValue={[[true, false]]}>
        <StepSequencer.Steps track={0}>
          {(step) => (
            <StepSequencer.Step track={step.trackIndex} step={step.stepIndex}>
              {step.active ? "on" : "off"}
            </StepSequencer.Step>
          )}
        </StepSequencer.Steps>
      </StepSequencer.Root>,
    );

    expect(markup).toContain(">on</button>");
    expect(markup).toContain(">off</button>");
  });

  test("toggles a step with pointer and keyboard events", () => {
    const changes: boolean[][][] = [];
    let handleClick: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
    let handleKeyDown: ((event: KeyboardEvent<HTMLButtonElement>) => void) | undefined;

    renderToStaticMarkup(
      <StepSequencer.Root
        defaultValue={[[false, true]]}
        onValueChange={(value) => changes.push(value)}
      >
        <StepSequencer.Step
          track={0}
          step={0}
          render={(props) => {
            handleClick = props.onClick as typeof handleClick;
            return <button>{props.children as ReactNode}</button>;
          }}
        />
        <StepSequencer.Step
          track={0}
          step={1}
          render={(props) => {
            handleKeyDown = props.onKeyDown as typeof handleKeyDown;
            return <button>{props.children as ReactNode}</button>;
          }}
        />
      </StepSequencer.Root>,
    );

    handleClick?.(createMouseEvent());
    const event = createKeyboardEvent(" ");
    handleKeyDown?.(event);

    expect(changes).toEqual([[[true, true]], [[false, false]]]);
    expect(event.defaultPrevented).toBe(true);
  });

  test("moves focus across the step grid with arrow keys", () => {
    let handleKeyDown: ((event: KeyboardEvent<HTMLButtonElement>) => void) | undefined;
    const focused: string[] = [];

    renderToStaticMarkup(
      <StepSequencer.Root trackCount={2} stepCount={4}>
        <StepSequencer.Step
          track={0}
          step={1}
          render={(props) => {
            handleKeyDown = props.onKeyDown as typeof handleKeyDown;
            return <button>{props.children as ReactNode}</button>;
          }}
        />
      </StepSequencer.Root>,
    );

    const event = createKeyboardEvent("ArrowDown", {
      currentTarget: createStepElement(focused),
    });
    handleKeyDown?.(event);

    expect(event.defaultPrevented).toBe(true);
    expect(focused).toEqual(['[data-part="step"][data-track-index="1"][data-step-index="1"]']);
  });

  test("does not toggle disabled or readonly steps", () => {
    const changes: boolean[][][] = [];
    let disabledClick: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
    let readonlyClick: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;

    renderToStaticMarkup(
      <>
        <StepSequencer.Root
          defaultValue={[[false]]}
          disabledSteps={[[true]]}
          onValueChange={(value) => changes.push(value)}
        >
          <StepSequencer.Step
            track={0}
            step={0}
            render={(props) => {
              disabledClick = props.onClick as typeof disabledClick;
              return <button>{props.children as ReactNode}</button>;
            }}
          />
        </StepSequencer.Root>
        <StepSequencer.Root
          defaultValue={[[false]]}
          readOnly
          onValueChange={(value) => changes.push(value)}
        >
          <StepSequencer.Step
            track={0}
            step={0}
            render={(props) => {
              readonlyClick = props.onClick as typeof readonlyClick;
              return <button>{props.children as ReactNode}</button>;
            }}
          />
        </StepSequencer.Root>
      </>,
    );

    disabledClick?.(createMouseEvent());
    readonlyClick?.(createMouseEvent());

    expect(changes).toEqual([]);
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<StepSequencer.Step track={0} step={0} />)).toThrow(
      "StepSequencer.Step must be used inside StepSequencer.Root.",
    );
  });
});

function createMouseEvent(): MouseEvent<HTMLButtonElement> {
  return {
    defaultPrevented: false,
  } as unknown as MouseEvent<HTMLButtonElement>;
}

function createKeyboardEvent(
  key: string,
  options: { currentTarget?: HTMLButtonElement } = {},
): KeyboardEvent<HTMLButtonElement> {
  let defaultPrevented = false;

  return {
    key,
    currentTarget: options.currentTarget,
    get defaultPrevented() {
      return defaultPrevented;
    },
    preventDefault: () => {
      defaultPrevented = true;
    },
  } as unknown as KeyboardEvent<HTMLButtonElement>;
}

function createStepElement(focused: string[]): HTMLButtonElement {
  return {
    closest: () => ({
      querySelector: (selector: string) => ({
        focus: () => focused.push(selector),
      }),
    }),
  } as unknown as HTMLButtonElement;
}
