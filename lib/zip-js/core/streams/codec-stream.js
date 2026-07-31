import { UNDEFINED_VALUE } from "../constants.js";
import { ERR_INVALID_UNCOMPRESSED_SIZE, DeflateStream, InflateStream } from "./zip-entry-stream.js";
const CODEC_DEFLATE = "deflate";
const CODEC_INFLATE = "inflate";
class CodecStream extends TransformStream {
  constructor(options, config) {
    super({});
    const codec = this;
    const { codecType } = options;
    let Stream;
    if (codecType.startsWith(CODEC_DEFLATE)) {
      Stream = DeflateStream;
    } else if (codecType.startsWith(CODEC_INFLATE)) {
      Stream = InflateStream;
    }
    codec.outputSize = 0;
    let inputSize = 0;
    const stream = new Stream(options, config);
    const readable = super.readable;
    const inputSizeStream = new TransformStream({
      transform(chunk, controller) {
        if (chunk && chunk.length) {
          inputSize += chunk.length;
          controller.enqueue(chunk);
        }
      },
      flush() {
        Object.assign(codec, {
          inputSize
        });
      }
    });
    const outputSizeStream = new TransformStream({
      transform(chunk, controller) {
        if (chunk && chunk.length) {
          controller.enqueue(chunk);
          codec.outputSize += chunk.length;
          if (options.outputSize !== UNDEFINED_VALUE && codec.outputSize > options.outputSize) {
            throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
          }
        }
      },
      flush() {
        const { signature } = stream;
        Object.assign(codec, {
          signature,
          inputSize
        });
      }
    });
    Object.defineProperty(codec, "readable", {
      get() {
        return readable.pipeThrough(inputSizeStream).pipeThrough(stream).pipeThrough(outputSizeStream);
      }
    });
  }
}
class ChunkStream extends TransformStream {
  constructor(chunkSize) {
    let pendingChunk;
    super({
      transform,
      flush(controller) {
        if (pendingChunk && pendingChunk.length) {
          controller.enqueue(pendingChunk);
        }
      }
    });
    function transform(chunk, controller) {
      if (pendingChunk) {
        const newChunk = new Uint8Array(pendingChunk.length + chunk.length);
        newChunk.set(pendingChunk);
        newChunk.set(chunk, pendingChunk.length);
        chunk = newChunk;
        pendingChunk = null;
      }
      if (chunk.length > chunkSize) {
        controller.enqueue(chunk.slice(0, chunkSize));
        transform(chunk.slice(chunkSize), controller);
      } else {
        pendingChunk = chunk;
      }
    }
  }
}
export {
  CODEC_DEFLATE,
  CODEC_INFLATE,
  ChunkStream,
  CodecStream,
  ERR_INVALID_UNCOMPRESSED_SIZE
};
