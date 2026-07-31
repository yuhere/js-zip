# CHANGES.md

## 2026-07-31 v2.8.26 — Build & test modernization

### Build tooling

- **Rollup → Vite**: Replaced `rollup` + `rollup-plugin-esbuild` with Vite library mode. Config uses `preserveModules: true` + `preserveEntrySignatures: "allow-extension"` to keep the `src/` directory structure in `lib/`. Output is unminified ES2022 ESM.

### Testing

- **node:test → Vitest**: Replaced `node:test` runner and `c8` coverage with Vitest + `@vitest/coverage-v8`. Tests import source directly from `src/`.
- **Browser testing**: Added `@vitest/browser` + `@vitest/browser-playwright` to run tests in headless Chromium. Config includes custom Vite middleware for HTTP Range request support on test data files.
- **Centralized runner → individual files**: Test logic inlined into self-contained `test/all/*.spec.js` files. Each file uses `it()` directly (`globals: true`). env-restricted tests use `it.skipIf()` for Node/browser filtering.
- **Coverage merge**: `scripts/coverage-merge.js` merges separate `coverage/node/` and `coverage/browser/` reports into `coverage/merged/` (text + HTML + lcov).

### Configuration

- `vite.config.js` — build only (library mode)
- `vitest.node.config.js` — Node tests (`globals: true`, v8 coverage, pool forks)
- `vitest.browser.config.js` — Browser tests (Playwright provider, Range middleware, headless Chromium)
- `test/setup.js` — Node fetch mock via `vi.fn()`

### Removed dependencies

- Build: `rollup`, `rollup-plugin-esbuild`, `npm-run-all`
- Test: `c8`, `mocha`, `chai`, `@types/mocha`, `@types/chai`
- TypeScript: `typescript`, `tsx`, `@types/node`, `@typescript-eslint/*`, `eslint`
- Legacy runners: `test/node-runner.js`, `test/web-runner.js`, `test/deno-runner.js`, `test/bun-runner.js`
- Old configs: `rollup.config.js`, `.c8rc.json`, `.mocharc.cjs`, `.nycrc.json`, `mocha.config.js`
- `test/tests-data.js`, `scripts/generate-vitest-wrappers.js`

### Directory structure

- `tests/` → `test/`
- `test/all/test-*.spec.js` → `test/all/*.spec.js`

### Docs & examples

- `docs/index.html` — interactive demo (create/read zip) using importmap to unpkg CDN, with collapsible source code display
- `docs/style.css` — responsive two-column layout
- README badges: npm version, downloads, coverage, license, ESM-only

### Scripts

| Script | Description |
|--------|-------------|
| `build` | Build library to `lib/` |
| `test` | Run Node tests |
| `test:node` | Same as `test` |
| `test:browser` | Run browser tests (watch mode, browser window visible) |
| `test:coverage` | Node + browser coverage + merge + badge update |
| `test:watch` | Node tests in watch mode |
| `dev:docs` | Serve docs/ locally |
| `prepublishOnly` | Build + coverage + badge update |

---

## v1.0.0 — Upgrade to zip.js v2025

### Replaced the ZIP engine

The old hand-rolled zip engine (`src/zip.ts`, `src/deflate.ts`, `src/inflate.ts`) was replaced with the modern [zip.js](https://github.com/gildas-lormeau/zip.js) library (v2025), integrated as `src/zip-js/` (~25 modules).

The new engine provides:

- **`ZipReader` / `ZipWriter`** — core read/write classes with full Zip64, encryption (AES, ZipCrypto), split zips, and streaming support.
- **`ZipFS`** — high-level filesystem-like API for import/export, add/remove/replace entries, and directory traversal.
- **I/O abstraction** — `BlobReader`, `HttpReader`, `HttpRangeReader`, `SplitDataReader`, `Uint8ArrayReader` (and matching Writers) for reading/writing from various sources.
- **Streaming** — transform streams for codec, CRC32, encryption, and zlib, enabling memory-efficient processing of large files.
- **Encryption** — AES-256/128 and ZipCrypto password protection.
- **Multi-runtime** — works in browsers, Node.js, Deno, and Bun.

### Entry point changes

- Added root `index.js` → re-exports `src/index.js`
- `src/index.js` → re-exports `src/zip-js/index.js` (the full zip.js API surface)
- Rollup input changed from `src/index.ts` → `src/index.js`
- Build now uses `preserveModules: true` (each module output as a separate file in `lib/`)

### Test suite replaced

- Added `tests/` directory with ~80 test files from upstream zip.js test suite
- Test runners: `node:test` (Node), Deno test, Bun test, browser iframe runner
- Test data files in `tests/data/` (sample zips, lorem text fixtures)

### Package updates

- Version: `0.0.1` → `1.0.0`
- Test command: `npm run build && npx c8 mocha` → `npm run test-node`
- New test scripts: `test-node`, `test-deno`, `test-bun`, `test-firefox`, `test-chrome`

### Coverage thresholds lowered

- Lines: 80% → 70%
- Functions: 80% → 70%
- Branches: 70% → 65%
- Statements: 80% → 70%

The lower thresholds reflect that most of the codebase is now the upstream zip.js library (not written by us), and the test suite focuses on integration/functional tests.

### Files added

- `src/index.js`
- `src/zip-js/` (entire tree, ~25 modules)
- `index.js`
- `tests/` (entire tree, ~80 test files + runners + data)
