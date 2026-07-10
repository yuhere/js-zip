
import { UNDEFINED_VALUE } from "./constants.js";
import {
    CodecStream,
    ChunkStream
} from "./streams/codec-stream.js";

export {
    codec
};

async function codec(stream, workerOptions) {
    const { options, config, streamOptions } = workerOptions;
    const { useCompressionStream } = options;
    options.useCompressionStream = useCompressionStream || (useCompressionStream === UNDEFINED_VALUE && config.useCompressionStream);
    // #############
    const { readable, writable } = stream;
    const { signal } = streamOptions;
    const readable_a = readable
        .pipeThrough(new ChunkStream(config.chunkSize))
        .pipeThrough(new ProgressWatcherStream(streamOptions), { signal });

    // #############
    return await run({ readable: readable_a, writable }, options, config, streamOptions);
}

async function run(stream, options, config, streamOptions) {
    // #############
    const { readable, writable } = stream;
    let codecStream;
    try {
        codecStream = new CodecStream(options, config);
        await readable.pipeThrough(codecStream).pipeTo(writable, { preventClose: true, preventAbort: true });
        const {
            signature,
            inputSize,
            outputSize
        } = codecStream;
        return {
            signature,
            inputSize,
            outputSize
        };
    } catch (error) {
        if (codecStream) {
            error.outputSize = codecStream.outputSize;
        }
        throw error;
    } finally {
        // onTaskFinished();
    }
}

class ProgressWatcherStream extends TransformStream {

    constructor({ onstart, onprogress, size, onend }) {
        let chunkOffset = 0;
        super({
            async start() {
                if (onstart) {
                    await callHandler(onstart, size);
                }
            },
            async transform(chunk, controller) {
                chunkOffset += chunk.length;
                if (onprogress) {
                    await callHandler(onprogress, chunkOffset, size);
                }
                controller.enqueue(chunk);
            },
            async flush() {
                if (onend) {
                    await callHandler(onend, chunkOffset);
                }
            }
        });
    }
}

async function callHandler(handler, ...parameters) {
    try {
        await handler(...parameters);
    } catch {
        // ignored
    }
}

