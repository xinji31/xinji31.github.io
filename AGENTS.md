# AGENTS.md

## Purpose

This file gives coding agents the operational rules for working in this repo.
It is based on the current codebase state in `/Users/jack/xinji31/ui`.
The app is a small Vite-powered browser UI written in plain ES modules.
There is no TypeScript, no ESLint config, and no real automated test setup yet.

## Repository Snapshot

- Entry HTML: `index.html`
- App entry: `src/main.js`
- Build tool: Vite via `vite.config.js`
- Package manager lockfile: `package-lock.json`
- Source language: JavaScript with JSDoc typing hints
- UI style: direct DOM construction through helper utilities, not React/Vue
- Deployment workflow: `.github/workflows/vite-deploy.yml`
- Deploy branch in GitHub Actions: `production`

## Agent Rules Files Present

Checked for common editor/agent instruction files:

- `.cursor/rules/`: not present
- `.cursorrules`: not present
- `.github/copilot-instructions.md`: not present

There are no repo-local Cursor or Copilot instruction files to merge in.

## Environment Notes

- This repo already contains `node_modules/`
- The current shell environment used during analysis did not have `npm` or `node`
- Treat command guidance below as repo commands, even if they were not runnable here
- If your runtime lacks Node.js, install a Node environment before trying builds

## Commands

### Install

Use the lockfile-backed install command:

```bash
npm install
```

If dependencies are already present and you only need reproducible CI-style install:

```bash
npm ci
```

### Build

Primary production build command from `package.json`:

```bash
npm run build
```

Equivalent direct command:

```bash
npx vite build
```

### Dev Server

There is no `dev` script in `package.json`, but this is a Vite app, so use:

```bash
npx vite
```

or:

```bash
npx vite dev
```

### Preview Built App

After building, preview the output with:

```bash
npx vite preview
```

### Lint

There is currently no lint script and no ESLint or Prettier config in the repo.
Do not invent a lint command and claim it is established project tooling.

Current state:

```bash
# No repo-supported lint command exists yet
```

If you add linting infrastructure, update this file in the same change.

### Tests

There is currently no real automated test suite.
`package.json` contains this placeholder script:

```bash
npm test
```

That script intentionally fails with `Error: no test specified`.

Current state:

- No test framework config found (`vitest`, `jest`, `playwright`, etc.)
- No repo test files found under `src/`
- No single-test command exists because no test runner is configured

### Single Test

There is no supported single-test command today.

Do not write docs like these unless you also add the matching tooling:

```bash
# Not currently valid in this repo
npm test -- some-test-name
npx vitest run path/to/test
```

If you introduce a test runner, document all of these immediately:

- full test command
- watch mode command
- single-file test command
- single-test-name command

## Deployment Notes

- GitHub Actions deploy is defined in `.github/workflows/vite-deploy.yml`
- Workflow triggers on pushes to the `production` branch
- The action uses `xinji31/vite-github-pages-deployer@v2`
- `public_base_path` is `/`

## Architecture Overview

- `src/main.js` wires the app together and mounts into `#app`
- Navigation is hash-based and implemented in `src/lib/router.js`
- Reactive state is provided by `Box`, `BoxValue`, and `BoxComputed` in `src/lib/box.js`
- DOM nodes are created through `element()` plus prototype helpers in `src/lib/element.js`
- Styling is often inline via `flatCss()` from `src/lib/util.js`
- Data access and local config live in `src/db.js`
- UI screens live in `src/components/`

## Coding Conventions

### Language and Modules

- Use plain JavaScript ES modules, not TypeScript
- Use `import`/`export`, not CommonJS
- Keep browser-oriented code compatible with the current Vite setup
- Prefer small functions and direct data flow over framework-style abstraction

### Imports

- Use top-level `import` statements only
- Use relative paths for local modules, e.g. `../lib/router`
- Side-effect CSS imports are common and should remain explicit
- Follow the surrounding file's import ordering instead of reordering everything
- Keep new imports extensionless for local JS modules to match the repo style

### Formatting

- There is no formatter config; preserve the style already used in the file you edit
- Semicolon usage is mixed across the repo, so prefer consistency within each file
- Indentation is two spaces
- Keep lines reasonably short, but readability matters more than strict width
- Use double quotes more often than single quotes unless the file strongly differs

### Types and Documentation

- This repo uses JSDoc instead of TypeScript types
- Add JSDoc to exported functions, classes, and non-obvious helpers
- Reuse existing tags such as `@param`, `@returns`, `@template`, and `@typedef`
- Keep types lightweight and practical; do not over-model the code
- If a function is obvious and local, avoid noisy documentation

### Naming

- Classes use `PascalCase` (`Database`, `BoxValue`, `BoxComputed`)
- Functions and variables use `camelCase` (`publishArticle`, `flatCss`, `titleText`)
- Component factories are plain functions, usually lower camel case
- Use descriptive names tied to UI behavior and routing intent
- Avoid generic names like `data`, `tmp`, or `handler` when a more specific name fits

### DOM and UI Patterns

- Prefer `element()` from `src/lib/element.js` over manual DOM boilerplate
- Chain `.attr(...)` and `.sub(...)` the way existing components do
- Use `flatCss()` when existing code is already generating inline style strings
- Use `BoxValue` and `BoxComputed` for reactive values instead of ad hoc observers
- Use `boxPromise()` for async loading states that swap from loader to result
- Use `linkTo()` for internal navigation instead of manually writing hashes

### Async and Data Access

- Centralize remote data access through `Database` when possible
- Follow the existing `cacheGetter()` pattern for memoized async fetches
- Use async IIFEs when passing promises into `boxPromise()` if that is the local pattern
- Keep API request payloads simple and explicit
- When interacting with GitHub APIs, surface actionable failure details

### Error Handling

- Fail fast for unsupported states with `throw new Error(...)`
- Catch errors at user interaction boundaries and show a clear user-facing message
- It is acceptable to return a fallback UI string for unsupported content types
- Swallow errors only for optional parsing paths where failure is expected and harmless
- Preserve existing behavior where URL prop parsing failures fall back to `undefined`

### Security and Content Handling

- Treat remote or user-provided HTML as unsafe by default
- Sanitize rendered markdown HTML with `dompurify` before assigning `innerHTML`
- Do not introduce new raw `innerHTML` writes unless sanitized first
- Be careful with tokens and secrets stored in local storage
- Never log secrets such as `gaToken`

### Styling

- Existing UI uses Semantic UI CSS plus inline style objects
- Reuse Semantic UI classes where they already fit the page
- Keep styling changes local and incremental unless doing a deliberate redesign
- Match existing accent colors and layout patterns unless the task says otherwise

### Comments

- Keep comments sparse
- Add comments only for non-obvious logic or caveats
- Prefer clear code and JSDoc over explanatory inline comments

## File-Specific Guidance

- `src/main.js`: preserve the router-driven composition pattern
- `src/lib/box.js`: be careful with dependency tracking and dirty-state propagation
- `src/lib/element.js`: preserve the custom `HTMLElement` prototype extensions
- `src/lib/router.js`: keep hash parsing tolerant of malformed optional props
- `src/db.js`: preserve local-storage-backed config behavior and fetch caching
- `src/components/article.js`: sanitize markdown and preserve PDF handling branches
- `src/components/publishArticle.js`: keep GitHub upload flow and user error alerts clear

## When Making Changes

- Prefer focused edits over broad refactors
- Avoid introducing new build tools, frameworks, or test runners unless requested
- If you add tooling, wire it into `package.json` scripts and update this file
- Before claiming lint or test coverage, verify that the repo actually supports it
- Respect existing mixed style in untouched files

## Verification Checklist

Before finishing a change, use the commands that actually exist:

```bash
npm run build
```

If you add tests or linting, also run those new commands and update this document.
