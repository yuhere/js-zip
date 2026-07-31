# @yuhere/js-zip

[![npm](https://img.shields.io/badge/npm-v2.8.26-blue)](https://www.npmjs.com/package/@yuhere/js-zip)
[![npm downloads](https://img.shields.io/npm/dm/@yuhere/js-zip.svg)](https://www.npmjs.com/package/@yuhere/js-zip)
[![coverage](https://img.shields.io/badge/coverage-73%25-yellowgreen)](https://www.npmjs.com/package/@yuhere/js-zip)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![ESM](https://img.shields.io/badge/ESM-only-orange.svg)](https://nodejs.org/api/esm.html)

`@yuhere/js-zip` is a JavaScript library for creating and reading .zip files in the browser and Node.js.

> This library is forked from the version of https://github.com/gildas-lormeau/zip.js/tree/v2.8.26

# Modifications

  1. Removed the Web Worker approach;
  2. Reduced the items from configuration;

# Examples

## Hello world

```js
import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter
} from "@yuhere/js-zip";

// ----
// Write the zip file
// ----

// Creates a BlobWriter object where the zip content will be written.
const zipFileWriter = new BlobWriter();
// Creates a TextReader object storing the text of the entry to add in the zip
// (i.e. "Hello world!").
const helloWorldReader = new TextReader("Hello world!");

// Creates a ZipWriter object writing data via `zipFileWriter`, adds the entry
// "hello.txt" containing the text "Hello world!" via `helloWorldReader`, and
// closes the writer.
const zipWriter = new ZipWriter(zipFileWriter);
await zipWriter.add("hello.txt", helloWorldReader);
await zipWriter.close();

// Retrieves the Blob object containing the zip content into `zipFileBlob`. It
// is also returned by zipWriter.close() for more convenience.
const zipFileBlob = await zipFileWriter.getData();

// ----
// Read the zip file
// ----

// Creates a BlobReader object used to read `zipFileBlob`.
const zipFileReader = new BlobReader(zipFileBlob);
// Creates a TextWriter object where the content of the first entry in the zip
// will be written.
const helloWorldWriter = new TextWriter();

// Creates a ZipReader object reading the zip content via `zipFileReader`,
// retrieves metadata (name, dates, etc.) of the first entry, retrieves its
// content via `helloWorldWriter`, and closes the reader.
const zipReader = new ZipReader(zipFileReader);
const firstEntry = (await zipReader.getEntries()).shift();
const helloWorldText = await firstEntry.getData(helloWorldWriter);
await zipReader.close();

// Displays "Hello world!".
console.log(helloWorldText);
```

## Hello world with Streams

```js
import {
  BlobReader,
  ZipReader,
  ZipWriter
} from "@yuhere/js-zip";

// ----
// Write the zip file
// ----

// Creates a TransformStream object, the zip content will be written in the
// `writable` property.
const zipFileStream = new TransformStream();
// Creates a Promise object resolved to the zip content returned as a Blob
// object retrieved from `zipFileStream.readable`.
const zipFileBlobPromise = new Response(zipFileStream.readable).blob();
// Creates a ReadableStream object storing the text of the entry to add in the
// zip (i.e. "Hello world!").
const helloWorldReadable = new Blob(["Hello world!"]).stream();

// Creates a ZipWriter object writing data into `zipFileStream.writable`, adds
// the entry "hello.txt" containing the text "Hello world!" retrieved from
// `helloWorldReadable`, and closes the writer.
const zipWriter = new ZipWriter(zipFileStream.writable);
await zipWriter.add("hello.txt", helloWorldReadable);
await zipWriter.close();

// Retrieves the Blob object containing the zip content into `zipFileBlob`.
const zipFileBlob = await zipFileBlobPromise;

// ----
// Read the zip file
// ----

// Creates a BlobReader object used to read `zipFileBlob`.
const zipFileReader = new BlobReader(zipFileBlob);
// Creates a TransformStream object, the content of the first entry in the zip
// will be written in the `writable` property.
const helloWorldStream = new TransformStream();
// Creates a Promise object resolved to the content of the first entry returned
// as text from `helloWorldStream.readable`.
const helloWorldTextPromise = new Response(helloWorldStream.readable).text();

// Creates a ZipReader object reading the zip content via `zipFileReader`,
// retrieves metadata (name, dates, etc.) of the first entry, retrieves its
// content into `helloWorldStream.writable`, and closes the reader.
const zipReader = new ZipReader(zipFileReader);
const firstEntry = (await zipReader.getEntries()).shift();
await firstEntry.getData(helloWorldStream.writable);
await zipReader.close();

// Displays "Hello world!".
const helloWorldText = await helloWorldTextPromise;
console.log(helloWorldText);
```
