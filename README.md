# js-zip

js-zip is a JavaScript library for creating and reading .zip files in the browser.

chrome 浏览器中解压 zip 文件。

插件 "Chrome extension source viewer" 中使用 zip.js 对 CRX 文件进行解压缩&压缩处理，

这个库是 fork 自 https://github.com/gildas-lormeau/zip.js 比较早期的版本。

``` javascript
function handleBlob(blob, publicKey, raw_crx_data) {
    var progressDiv = document.getElementById('initial-status');
    progressDiv.hidden = true;

    setBlobAsDownload(blob);
    setRawCRXAsDownload(raw_crx_data);
    setPublicKey(publicKey);

    zip.createReader(new zip.BlobReader(blob), function(zipReader) {
        renderPanelResizer();
        zipReader.getEntries(handleZipEntries);
        window.addEventListener('unload', function() {
            zipReader.close();
            // Close background page as well, to avoid memory leak.....
            //chrome.extension.getBackgroundPage().close();
            // F***, Extension crashes if navigating away >.>
        });
    });
}
```

# 修改了什么？

  1, 放弃使用 worker 的方式(还有部分代码残留, 有空清理);
  2, 增加了对 zip 文件的分批读写的支持, 适合大文件的处理;

# 参考

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


#### 一次性读写 zip 文件的例子 (callback)

``` javascript
// 读取 zip 文件中指定文件名的的 zipEntry
unzipBlob(entryName, zippedBlob, function (unzippedBlob) {
    if (unzippedBlob !== undefined) {
        ..... unzippedBlob
        var reader = new FileReader();
        reader.readAsText(unzippedBlob);
    }
}, function (err) { // on error handler
    console.error(err);
});

// 写入 zip 文件
zipEntries.push({fn: "data1.json", blob: new Blob([JSON.stringify({record: data}, null, 2)], {type: 'text/plain;charset=utf-8'})});
zipEntries.push({fn: "data2.json", blob: new Blob([JSON.stringify({record: data}, null, 2)], {type: 'text/plain;charset=utf-8'})});
zipBlob(zipEntries, function (zippedBlob) {
    saveAs(zippedBlob, file_name_idx + ".dat.zip");
});
```

#### 分批读写 zip 文件的例子

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
        // blob 是从 zipEntry 中获得的数据
        // 这里根据需要做点什么...
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
        // 在循环中获得一笔一笔的数据
        typeof(callback)==="function" && callback("in-progress", ii * SIZE + value.length, total);
        // 将数据逐笔的加入到 zip 中....
        await addToZip(zipWriter, {fn: "fcache_exp_" + ii + ".json", blob: new Blob([JSON.stringify(value, null, 2)])} )
    }
    // 最后获得 zipFileBlob
    const zippedBlob = await closeWriter(zipWriter);
    typeof(callback)==="function" && callback("done", fn);
    return saveAs(zippedBlob, fn);
};

```