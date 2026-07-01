import zip from './zip.js';

function zipBlob(fset, callback, onerror, progress) {
    zip.createWriter(new zip.BlobWriter("application/zip"),
        function (zipWriter) {
            function __add_to_zip(fset, i, on_end) {
                if (i >= fset.length) return;  // exit loop
                var { fn, blob } = fset[i];
                typeof (progress) === "function" && progress((i + 1), fset.length, fn);
                var is_last = (i === fset.length - 1);
                var scb = is_last ? on_end : function () {
                    __add_to_zip(fset, i + 1, on_end);
                };
                //
                zipWriter.add(fn, new zip.BlobReader(blob), scb);
            }

            //
            __add_to_zip(fset, 0, function () {
                zipWriter.close(callback);
            });
        }, (onerror || function def_onerror(message) {
            console.error(message);
        }));
}

/**
 *   zipEntries.push({fn: "data1.json", blob: new Blob([JSON.stringify({record: data}, null, 2)], {type: 'text/plain;charset=utf-8'})});
 *   zipEntries.push({fn: "data2.json", blob: new Blob([JSON.stringify({record: data}, null, 2)], {type: 'text/plain;charset=utf-8'})});
 *   let zipFileBlob = await zipBlob5(zipEntries);
 */
async function zipBlob5(fset, progress) {
    return new Promise(function (resolve, reject) {
        zipBlob(fset, resolve, reject, progress)
    })
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
        }, (onerror)
    );
}

function unzipBlob5(fn, blob) {
    return new Promise(function (resolve, reject) {
        unzipBlob(fn, fset, resolve, reject)
    })
}


async function createWriter() {
    function error_handle(message) {
    }
    return new Promise(function (resolve, reject) {
        error_handle.handle = reject;
        zip.createWriter(new zip.BlobWriter("application/zip"), function (zipWriter) {
            zipWriter["error_handle"] = error_handle;
            resolve(zipWriter);
        }, error_handle.handle);
    })
}

async function addToZip(writer, dat) {
    let { fn, blob } = dat;
    let { error_handle } = writer;
    return new Promise(function (resolve, reject) {
        error_handle.handle = reject;
        writer.add(fn, new zip.BlobReader(blob), function () {
            resolve();
        });
    });
}

async function closeWriter(writer) {
    let { error_handle } = writer;
    return new Promise(function (resolve, reject) {
        error_handle.handle = reject;
        writer.close(function (zippedBlob) {
            resolve(zippedBlob);
        })
    })
}

async function createReader(blob) {
    function error_handle(message) {
    }
    return new Promise(function (resolve, reject) {
        error_handle.handle = reject;
        zip.createReader(new zip.BlobReader(blob), function (zipReader) {
            zipReader["error_handle"] = error_handle;
            resolve(zipReader);
        }, error_handle.handle)
    })
}

async function getFileEntries(reader, filter) {
    let { error_handle } = reader;
    return new Promise(function (resolve, reject) {
        error_handle.handle = reject;
        reader.getEntries(function (entries) {
            resolve(typeof filter === "function" ? entries.filter(filter) : entries);
        });
    })
}

async function getEntryData(reader, entry) {
    let { error_handle } = reader;
    return new Promise(function (resolve, reject) {
        error_handle.handle = reject;
        if (!entry.directory) {
            entry.getData(new zip.BlobWriter(), function (data) {
                resolve(data);
            });
        } else {
            reject("Can not getData from a directory entry.")
        }
    })
}

async function closeReader(reader) {
    let { error_handle } = reader;
    return new Promise(function (resolve, reject) {
        error_handle.handle = reject;
        resolve(reader.close());
    })
}

export {
    zipBlob, zipBlob5,
    unzipBlob, unzipBlob5,
    // ##########
    createWriter, addToZip, closeWriter,
    createReader, getFileEntries, getEntryData, closeReader
};