import { Crc32Stream } from "./crc32-stream.js";
import { AESEncryptionStream, AESDecryptionStream } from "./aes-crypto-stream.js";
import { ZipCryptoEncryptionStream, ZipCryptoDecryptionStream } from "./zip-crypto-stream.js";
import { ERR_INVALID_SIGNATURE } from "./common-crypto.js";
import { ERR_ABORT_CHECK_PASSWORD, ERR_INVALID_PASSWORD } from "./common-crypto.js";
const ERR_INVALID_UNCOMPRESSED_SIZE = "Invalid uncompressed size";
const FORMAT_DEFLATE_RAW = "deflate-raw";
const FORMAT_DEFLATE64_RAW = "deflate64-raw";
class DeflateStream extends TransformStream {
  constructor(options, { chunkSize, CompressionStreamZlib, CompressionStream }) {
    super({});
    const { compressed, encrypted, zipCrypto, signed, level } = options;
    const stream = this;
    let crc32Stream, encryptionStream;
    let readable = super.readable;
    if ((!encrypted || zipCrypto) && signed) {
      crc32Stream = new Crc32Stream();
      readable = pipeThrough(readable, crc32Stream);
    }
    if (compressed) {
      readable = pipeThroughCommpressionStream(readable, { level, chunkSize }, CompressionStream, CompressionStreamZlib, CompressionStream);
    }
    if (encrypted) {
      if (zipCrypto) {
        readable = pipeThrough(readable, new ZipCryptoEncryptionStream(options));
      } else {
        encryptionStream = new AESEncryptionStream(options);
        readable = pipeThrough(readable, encryptionStream);
      }
    }
    setReadable(stream, readable, () => {
      let signature;
      if (encrypted && !zipCrypto) {
        signature = encryptionStream.signature;
      }
      if ((!encrypted || zipCrypto) && signed) {
        signature = new DataView(crc32Stream.value.buffer).getUint32(0);
      }
      stream.signature = signature;
    });
  }
}
class InflateStream extends TransformStream {
  constructor(options, { chunkSize, DecompressionStreamZlib, DecompressionStream }) {
    super({});
    const { zipCrypto, encrypted, signed, signature, compressed, deflate64 } = options;
    let crc32Stream, decryptionStream;
    let readable = super.readable;
    if (encrypted) {
      if (zipCrypto) {
        readable = pipeThrough(readable, new ZipCryptoDecryptionStream(options));
      } else {
        decryptionStream = new AESDecryptionStream(options);
        readable = pipeThrough(readable, decryptionStream);
      }
    }
    if (compressed) {
      readable = pipeThroughCommpressionStream(readable, { chunkSize, deflate64 }, DecompressionStream, DecompressionStreamZlib, DecompressionStream);
    }
    if ((!encrypted || zipCrypto) && signed) {
      crc32Stream = new Crc32Stream();
      readable = pipeThrough(readable, crc32Stream);
    }
    setReadable(this, readable, () => {
      if ((!encrypted || zipCrypto) && signed) {
        const dataViewSignature = new DataView(crc32Stream.value.buffer);
        if (signature != dataViewSignature.getUint32(0, false)) {
          throw new Error(ERR_INVALID_SIGNATURE);
        }
      }
    });
  }
}
function setReadable(stream, readable, flush) {
  readable = pipeThrough(readable, new TransformStream({ flush }));
  Object.defineProperty(stream, "readable", {
    get() {
      return readable;
    }
  });
}
function pipeThroughCommpressionStream(readable, options, CompressionStreamNative, CompressionStreamZlib, CompressionStream) {
  const Stream = CompressionStreamNative ? CompressionStreamNative : CompressionStreamZlib || CompressionStream;
  const format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;
  try {
    readable = pipeThrough(readable, new Stream(format, options));
  } catch (error) {
    if (CompressionStreamZlib) {
      readable = pipeThrough(readable, new CompressionStreamZlib(format, options));
    } else {
      throw error;
    }
  }
  return readable;
}
function pipeThrough(readable, transformStream) {
  return readable.pipeThrough(transformStream);
}
export {
  DeflateStream,
  ERR_ABORT_CHECK_PASSWORD,
  ERR_INVALID_PASSWORD,
  ERR_INVALID_SIGNATURE,
  ERR_INVALID_UNCOMPRESSED_SIZE,
  InflateStream
};
