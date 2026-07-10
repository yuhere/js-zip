# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@yuhere/js-zip` — a JavaScript library for creating and reading `.zip` files, forked from [zip.js](https://github.com/gildas-lormeau/zip.js) (v2025). Used in the "Chrome extension source viewer" extension for CRX file compression/decompression. Targets browser, Node.js, Deno, and Bun.

## Commands

```bash
npm run build          # Rollup bundle (src/ → lib/, preserveModules)
npm run lint           # ESLint on src/
npm test               # Build, then run tests with c8 coverage
npm run test-node      # Same as above (build + c8 + node:test)
npm run test-deno      # Run tests with Deno
npm run test-bun       # Run tests with Bun
npm run test-firefox   # Run browser tests in Firefox
npm run test-chrome    # Run browser tests in Chrome
```

- `npm test` builds with Rollup then runs all 85 tests via `node:test` with c8 coverage collection. Coverage is collected from `src/**/*` (tests import source directly, not the built lib/).
- Coverage thresholds (c8): 60% lines/functions/branches/statements. Reports in `coverage/` (text, HTML, lcov).
- The test runner (`tests/node-runner.js`) runs from the repo root. It mocks `fetch` using `node:fs` to serve files from `tests/data/`.
- Test files: `tests/all/test-*.js`. Test registry: `tests/tests-data.js`. Add new tests by adding an entry there and creating the script.
- Rollup config uses `preserveModules: true` — each source module becomes a separate file in `lib/`.

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

Rollup (`rollup.config.js`) bundles `src/index.js` → `lib/` with `preserveModules: true`, keeping each module as a separate file. The `rollup-plugin-esbuild` plugin handles JS/TS transpilation targeting ES2022.

### Public API

**Core classes** (from `zip-core.js`):
- `ZipReader` — read zip files. Constructor takes a `Reader` instance. Methods: `getEntries()`, `close()`.
- `ZipWriter` — write zip files. Constructor takes a `Writer` instance. Methods: `add(name, reader, options?)`, `close()`.
- `configure(config)` — global configuration (e.g., `workerScripts`, `useWebWorkers`).

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

- `tests/tests-data.js` — registry of all test scripts with titles and optional env filters.
- `tests/node-runner.js` — Node.js runner using `node:test` with `fetch` mocked via `node:fs`.
- `tests/web-runner.js` — browser runner using iframes.
- `tests/deno-runner.js`, `tests/bun-runner.js` — Deno and Bun runners.
- `tests/data/` — test fixture files (sample zips, lorem text).
- `tests/all/loader.html` — HTML loader for browser test iframes.

### Configuration notes

- **ESM only**: `"type": "module"` in package.json. All source uses ES import/export.
- **TypeScript**: Dev dependencies include TypeScript and types for tooling, but the source is plain `.js`. `tsconfig.types.json` exists for declaration emit only.
- **Coverage**: `.c8rc.json` covers `src/**/*`, excludes `node_modules/**`.
- **CI**: `.github/workflows/npm-publish.yml` handles npm publishing.
