# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@yuhere/js-zip` — a browser-only JavaScript library for creating and reading `.zip` files. Forked from an early version of [zip.js](https://github.com/gildas-lormeau/zip.js) and substantially modified: Web Worker support was removed, and streaming/chunked read/write was added for large files. Used in the "Chrome extension source viewer" extension for CRX file compression/decompression.

## Commands

```bash
npm run build          # Rollup bundle (src/ → lib/index.js)
npm run lint           # ESLint on src/
npm test               # Build then run Mocha tests with c8 coverage
```

- Tests are written in TypeScript with Mocha + Chai, run via `tsx` (no compilation needed).
- Test files: `test/*.spec.ts` (the test directory currently has no files).
- Coverage thresholds (c8): 80% lines/functions/statements, 70% branches.

## Architecture

```
src/
  index.ts      → Public API (both callback-style and Promise wrappers)
  zip.ts        → Core ZIP engine: Reader/Writer abstractions, entry parsing, central directory
  deflate.ts    → Deflate compression (JZlib/zlib port, ~2000 lines)
  inflate.ts    → Inflate decompression (JZlib/zlib port, ~2150 lines)
```

### Build pipeline

Rollup (`rollup.config.js`) bundles `src/index.ts` into `lib/index.js` (ESM format). The `rollup-plugin-esbuild` plugin handles TypeScript stripping — Rollup itself does no type checking. Type declarations are generated separately via `tsc -p tsconfig.types.json` (the `build-pending:types` script, currently not in the default build pipeline).

### Public API layers (index.ts)

**Callback-based** — the original API, for single-shot zip operations:
- `zipBlob(fset, callback, onerror, progress)` — write a zip from `[{fn, blob}, ...]`
- `unzipBlob(fn, blob, callback, onerror)` — read a specific named entry from a zip Blob

**Promise-based** (`*5` suffix) — thin wrappers around the callback versions:
- `zipBlob5(fset, progress)` → `Promise<Blob>`
- `unzipBlob5(fn, blob)` → `Promise<Blob>`

**Streaming/batch API** — for large files, avoid loading everything into memory:
- `createWriter()` → `addToZip(writer, {fn, blob})` per file → `closeWriter(writer)` → zipped Blob
- `createReader(blob)` → `getFileEntries(reader, filter?)` → `getEntryData(reader, entry)` per entry → `closeReader(reader)`

### Core ZIP engine (zip.ts)

A self-contained IIFE (~830 lines) that exports a single `zip` object with:

- **Reader hierarchy**: `Reader` → `BlobReader`, `TextReader`, `Data64URIReader` — all implement `init(callback)` + `readUint8Array(index, length, callback, onerror)`.
- **Writer hierarchy**: `Writer` → `BlobWriter`, `TextWriter`, `Data64URIWriter` — all implement `init(callback)`, `writeUint8Array(array, callback)`, `getData(callback)`.
- **ZipReader** (`createZipReader`): seeks the End of Central Directory Record (EOCDR) backwards from the end of the blob, parses central directory entries, and exposes `Entry.getData(writer, onend)` to decompress individual entries.
- **ZipWriter** (`createZipWriter`): accumulates entries, writes local file headers + data, then writes the central directory and EOCDR on `close()`.
- **Compression plumbing**: `inflate()` and `deflate()` call into `Inflater`/`Deflater` classes (imported from deflate.ts/inflate.ts). The `zip.useWebWorkers` flag (default `false`) would use Web Workers, but this path is effectively dead code since the flag is never set true.
- **Chunked I/O**: `copy()`, `launchProcess()` process data in 512KB chunks to avoid blocking the main thread on large files.

### Deflate/Inflate (deflate.ts, inflate.ts)

Ports of JZlib 1.0.2 (which itself is based on zlib 1.1.3). These are classic zlib implementations with:

- `Deflater(level?)`: `append(data)` compresses a chunk, `flush()` finalizes.
- `Inflater()`: `append(data)` decompresses a chunk, `flush()` cleans up.

Both use an internal `ZStream` abstraction that reads from `next_in` and writes to `next_out` via `read_buf`/`flush_pending`.

### Configuration notes

- **ESM only**: `"type": "module"` in package.json. All source uses ES import/export.
- **No tsconfig.json for compilation** — only `tsconfig.types.json` for declaration emit. The build doesn't type-check.
- **Coverage**: `.c8rc.json` covers `src/**/*` (excludes test/node_modules), `.nycrc.json` excludes `src/arrays.ts` (which likely doesn't exist).
- **CI**: `.github/workflows/npm-publish.yml` handles npm publishing (details not inspected — read if publishing is needed).
