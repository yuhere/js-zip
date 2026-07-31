import { setMaxListeners } from "node:events";
import { openAsBlob } from "node:fs";

setMaxListeners(100);

beforeAll(() => {
	globalThis.fetch = vi.fn(async (url) => {
		const blob = await openAsBlob("./test" + url.toString().match(/(\/data\/.*)/)[1]);
		return {
			status: 200,
			body: blob.stream(),
			arrayBuffer: () => blob.arrayBuffer(),
		};
	});
});
