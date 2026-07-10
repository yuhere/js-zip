# js-zip

js-zip is a JavaScript library for creating and reading .zip files in the browser.

This library is forked from the version of https://github.com/gildas-lormeau/zip.js/tree/v2.8.26

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


# Modifications

  1. Removed the Web Worker approach (some residual code remains, to be cleaned up);
  2. Added support for batched read/write of zip files, suitable for handling large files;

# Reference

    https://github.com/gildas-lormeau/zip.js/tree/master/WebContent/tests


``` javascript
var {zip} = require("zipjs");

function zipBlob(fn, blob, callback, onerror) {
  zip.createWriter(new zip.BlobWriter("application/zip"),
    function (zipWriter) {
      zipWriter.add(fn, new zip.BlobReader(blob), function () {
        zipWriter.close(callback);
      });
    }, (onerror || function def_onerror(message) {
      console.error(message);
    }));
}

function unzipBlob(fn, blob, callback, onerror) {
  zip.createReader(new zip.BlobReader(blob),
    function (zipReader) {
      zipReader.getEntries(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var obj = entries[i];
          if (!obj.directory && obj.filename === fn) {
            obj.getData(new zip.BlobWriter("text/plain"), function (data) {
              zipReader.close();
              callback(data);
              return;
            });
          }
        }
        callback();  // not found the file
      });
    }, (onerror || function def_onerror(message) {
      console.error(message);
    })
  );
}
```


#### One-shot read/write example (callback)

``` javascript
// Read a specific zip entry by name
unzipBlob(entryName, zippedBlob, function (unzippedBlob) {
    if (unzippedBlob !== undefined) {
        ..... unzippedBlob
        var reader = new FileReader();
        reader.readAsText(unzippedBlob);
    }
}, function (err) { // on error handler
    console.error(err);
});

// Write a zip file
zipEntries.push({fn: "data1.json", blob: new Blob([JSON.stringify({record: data}, null, 2)], {type: 'text/plain;charset=utf-8'})});
zipEntries.push({fn: "data2.json", blob: new Blob([JSON.stringify({record: data}, null, 2)], {type: 'text/plain;charset=utf-8'})});
zipBlob(zipEntries, function (zippedBlob) {
    saveAs(zippedBlob, file_name_idx + ".dat.zip");
});
```

#### Batched read/write example

``` javascript
async function(zipFileBlob) {
    const reader = await createReader(zipFileBlob);
    // createReader, getFileEntries, getEntryTextData, closeReader
    const entries = await getFileEntries(reader, (entry, idx) => {
        return /cache_exp_\d+\.json/gi.exec(entry.filename)
    });
    //
    const stat = {count: 0};
    //
    for (let i = 0;i < entries.length;i++) {
        let blob = await getEntryData(reader, entries[i]);
        let list = await blob2json(blob);
        // blob is the data from the zipEntry
        // process it as needed...
    }
    console.log("...bulkPut...end...");
    await closeReader(reader);
};

async function(name, fn, callback) {
    // createWriter, addToZip, closeWriter
    const zipWriter = await createWriter();
    ...
    //
    const irs = await cache_export_i(name, db, total, SIZE);
    for (let ii = 0, {done, value} = await irs.next();!done;ii++, {done, value} = await irs.next()) {
        // Get data batch by batch in the loop
        typeof(callback)==="function" && callback("in-progress", ii * SIZE + value.length, total);
        // Add each batch to the zip incrementally
        await addToZip(zipWriter, {fn: "fcache_exp_" + ii + ".json", blob: new Blob([JSON.stringify(value, null, 2)])} )
    }
    // Finally get the zipped blob
    const zippedBlob = await closeWriter(zipWriter);
    typeof(callback)==="function" && callback("done", fn);
    return saveAs(zippedBlob, fn);
};

```
