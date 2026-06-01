import { defineConfig } from "@rspress/core";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: "content",
  title: "Audio UI",
  description: "Headless primitives for building accessible audio interfaces.",
  logoText: "Audio UI",
  globalStyles: fileURLToPath(new URL("./content/_styles/global.css", import.meta.url)),
  builderConfig: {
    resolve: {
      alias: {
        "@ryhrm-gz/audio-ui-core": fileURLToPath(
          new URL("../packages/core/src/index.ts", import.meta.url),
        ),
        "@ryhrm-gz/audio-ui-react": fileURLToPath(
          new URL("../packages/react/src/index.ts", import.meta.url),
        ),
      },
    },
  },
  markdown: {
    showLineNumbers: true,
  },
  themeConfig: {
    nav: [
      {
        text: "Guide",
        link: "/guide/getting-started",
      },
      {
        text: "Components",
        link: "/components/knob",
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            {
              text: "Getting Started",
              link: "/guide/getting-started",
            },
          ],
        },
      ],
      "/components/": [
        {
          text: "Components",
          items: [
            {
              text: "Knob",
              link: "/components/knob",
            },
            {
              text: "Slider",
              link: "/components/slider",
            },
            {
              text: "RangeSlider",
              link: "/components/range-slider",
            },
            {
              text: "XYPad",
              link: "/components/xypad",
            },
            {
              text: "EnvelopeEditor",
              link: "/components/envelope-editor",
            },
            {
              text: "EQCurve",
              link: "/components/eq-curve",
            },
            {
              text: "Fader",
              link: "/components/fader",
            },
            {
              text: "LevelMeter",
              link: "/components/level-meter",
            },
            {
              text: "Piano",
              link: "/components/piano",
            },
            {
              text: "ToggleButton",
              link: "/components/toggle-button",
            },
            {
              text: "ToggleGroup",
              link: "/components/toggle-group",
            },
            {
              text: "StepSequencer",
              link: "/components/step-sequencer",
            },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/author/library",
      },
    ],
  },
});
