# Audio UI

Headless primitives for audio interfaces.

Audio UI contains framework-agnostic control logic and React bindings for audio controls.
The React package handles interaction, accessibility attributes, data attributes, CSS
variables, and form inputs. Your app keeps control of composition and styling.

Component usage, examples, and API details are documented in `docs/content`.

## Packages

- `@ryhrm-gz/audio-ui-core`: framework-agnostic math and state helpers.
- `@ryhrm-gz/audio-ui-react`: React bindings built on the core package.

## Installation

For React applications:

```sh
pnpm add @ryhrm-gz/audio-ui-react
```

For framework-agnostic utilities:

```sh
pnpm add @ryhrm-gz/audio-ui-core
```

`@ryhrm-gz/audio-ui-react` has a peer dependency on React 18 or React 19.

## Documentation

Start the documentation site:

```sh
vp run docs
```

Build the documentation site:

```sh
vp run docs:build
```

Documentation source lives in `docs/content`.

## Development

This repository uses Vite+ through the `vp` CLI.

```sh
vp install
vp run build
vp check
vp test
```

Useful workspace commands:

- `vp run docs`: start the Rspress documentation site.
- `vp run docs:build`: build the documentation site.
- `vp run dev`: watch package builds.
- `vp run build`: build all packages.
- `vp check`: format, lint, and type-check.
- `vp test`: run tests.

## Repository Layout

- `packages/core`: framework-agnostic primitives.
- `packages/react`: React component bindings.
- `docs/content`: Rspress documentation source.

## License

MIT
