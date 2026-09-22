# Repository Guidelines

## Project Structure & Module Organization

This is a Vue 3 application built with Vue CLI 5. The main entry points are
`src/main.js` and `src/App.vue`. Reusable UI lives in `src/components/`, with
specialized controls under `ControlPanel/`, visual effects under `Effects/`,
and alternate desktop UI under `Win98/`. Put shared reactive state in
`src/stores/` (Pinia), reusable behavior in `src/composables/` or `src/mixins/`,
constants in `src/constants/`, and integration helpers in `src/services/`.
Global styles are in `src/assets/styles/`; static public files belong in
`public/`. Keep large media assets in the existing asset directories and avoid
duplicating them.

## Build, Test, and Development Commands

Run `npm install` after checkout, then use:

- `npm run serve` — start the development server at `http://localhost:8080`.
- `npm run build` — create the production bundle in `dist/`.
- `npm run lint` — check JavaScript and Vue files with ESLint.
- `npm run lint:fix` — apply safe ESLint fixes.
- `npm run format` — format source JavaScript, Vue, and CSS with Prettier.
- `npm run deploy` — build and publish to GitHub Pages; use only when release
  deployment is intended.

There is currently no automated test suite or `npm test` script. For every
change, run `npm run lint` and `npm run build`, then manually exercise the
affected UI in the development server.

## Coding Style & Naming Conventions

Use two spaces, semicolons, single quotes, and a 100-column print width; these
are enforced by the repository Prettier configuration. Name Vue components in
PascalCase (`VideoLayer.vue`), composables with a `use` prefix, stores and
utilities in lower camel case, and CSS classes in kebab-case. Follow the
existing Options API or Composition API style in the surrounding file. Keep
Pinia stores as the single source of truth; pass state down and emit updates
up rather than creating duplicate component state.

## Testing Guidelines

No test framework is configured. Validate new behavior with lint, a production
build, and focused browser checks, including both Insert and Win98 modes when
shared state or routing changes.

## Commit & Pull Request Guidelines

Use a short imperative commit subject, such as `Add recording controls` or
`Update deployment workflow`. Keep commits focused. Pull requests should
describe the user-visible change, list validation commands run, link relevant
issues, and include screenshots or a short recording for visual/UI changes.
Call out changes to deployment, media assets, localStorage behavior, or browser
requirements explicitly.
