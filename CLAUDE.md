# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@yuhere/js-zip` — a JavaScript library for creating and reading `.zip` files, forked from [zip.js](https://github.com/gildas-lormeau/zip.js) (v2025). Used in the "Chrome extension source viewer" extension for CRX file compression/decompression. Targets browser and Node.js.

## Commands

```bash
npm run build          # Vite library build (src/ → lib/, preserveModules)
npm test               # Node tests (85 pass, 3 skip)
npm run test:node      # Same as above
npm run test:browser   # Browser tests in headless Chromium (87 pass)
npm run test:coverage  # Node + Browser tests with coverage (coverage/node/, coverage/browser/)
npm run test:watch     # Watch mode for Node tests
```

- `npm test` runs 88 tests via **Vitest** (85 pass, 3 env-skipped in Node). `globals: true` — `it`/`describe`/`expect`/`vi` are available without imports.
- Coverage: `@vitest/coverage-v8`, thresholds 70/68/48/68. Separate reports in `coverage/node/` and `coverage/browser/`.
- Config files: `vite.config.js` (build), `vitest.node.config.js` (Node tests), `vitest.browser.config.js` (Browser tests).
- Node test setup (`tests/setup.js`) mocks `fetch` using `node:fs` to serve files from `tests/data/`.
- Browser tests run in headless Chromium via `@vitest/browser-playwright`, with no fetch mock — Vite dev server serves test data with Range support.
- Test files: `test/all/*.spec.js` — self-contained Vitest test files, each contains one `it()` block.
- Vite build uses `preserveModules: true` + `preserveEntrySignatures: "allow-extension"` — each source module becomes a separate file in `lib/`.

## Architecture

```
src/
  index.js              → Entry point, re-exports everything from src/zip-js/
  zip-js/
    index.js            → Public API surface (re-exports from zip-core + zip-fs)
    zip-core.js         → Re-exports reader, writer, I/O classes, configure
    zip-core-reader.js  → ZipReader export
    zip-core-writer.js  → ZipWriter export
    core/
      configuration.js  → configure() for global settings
      constants.js      → Constants (error messages, signatures, etc.)
      io.js             → Reader/Writer I/O classes (BlobReader, HttpReader, etc.)
      options.js        → Option handling utilities
      codec.js          → Compression codec registry
      zip-reader.js     → ZipReader implementation (~890 lines)
      zip-writer.js     → ZipWriter implementation (~1570 lines)
      zip-entry.js      → ZipEntry class
      zip-fs.js         → ZipFS filesystem abstraction (~880 lines)
      streams/          → Stream implementations (AES crypto, zip crypto, CRC32, zlib, codec)
      util/             → Text encoding (UTF-8, CP437)
```

Root `index.js` is a convenience re-export of `src/index.js`.

### Build pipeline

Vite (`vite.config.js`) bundles `src/index.js` → `lib/` with `preserveModules: true` + `preserveEntrySignatures: "allow-extension"`, keeping each module as a separate file. Targeting ES2022, no minification.

### Public API

**Core classes** (from `zip-core.js`):
- `ZipReader` — read zip files. Constructor takes a `Reader` instance. Methods: `getEntries()`, `close()`.
- `ZipWriter` — write zip files. Constructor takes a `Writer` instance. Methods: `add(name, reader, options?)`, `close()`.
- `configure(config)` — global configuration (e.g., `workerScripts`).

**I/O classes** (from `io.js`):
- **Readers**: `Reader`, `TextReader`, `BlobReader`, `Data64URIReader`, `Uint8ArrayReader`, `HttpReader`, `HttpRangeReader`, `SplitDataReader`
- **Writers**: `Writer`, `TextWriter`, `BlobWriter`, `Data64URIWriter`, `Uint8ArrayWriter`, `SplitDataWriter`

**Filesystem API** (from `zip-fs.js`):
- `ZipFS` / `FS` — high-level filesystem-like interface for reading/writing zip files. Supports import/export, add/remove/replace entries, directory traversal.
- `ZipDirectoryEntry` / `ZipFileEntry` — entry types with metadata (date, comment, Unix/MS-DOS attributes).

### Stream architecture

The `core/streams/` directory contains transform stream implementations:
- `codec-stream.js` — compression/decompression stream using registered codecs
- `zip-entry-stream.js` — stream for individual zip entries
- `zlib-js/zlib-streams.js` — zlib deflate/inflate streams (~2700 lines)
- `crc32-stream.js` — CRC32 checksum stream
- `aes-crypto-stream.js`, `zip-crypto-stream.js`, `common-crypto.js` — encryption streams
- `codecs/crc32.js`, `codecs/sjcl.js` — low-level crypto/codec implementations

### Test setup

- `tests/setup.js` — Node test setup (fetch mock via `vi.fn()`).
- `test/all/*.spec.js` — self-contained Vitest test files, each with one `it()` block.
- `vitest.node.config.js` — Node test config (`globals: true`, v8 coverage, thresholds)
- `vitest.browser.config.js` — Browser test config with Playwright provider and Range-request middleware
- `tests/data/` — test fixture files (sample zips, lorem text).

### Configuration notes

- **ESM only**: `"type": "module"` in package.json. All source uses ES import/export.
- **Plain JavaScript**: Source is `.js` only, no TypeScript dependency.
- **Coverage**: `vitest.node.config.js` + `vitest.browser.config.js` use `@vitest/coverage-v8`, cover `src/**/*.js`, output to `coverage/node/` and `coverage/browser/`.
- **CI**: `.github/workflows/npm-publish.yml` handles npm publishing.
