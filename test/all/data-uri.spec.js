import * as zip from "../../index.js";

const FILENAME = "lorem.txt";


it("Data URI", async () => {
	try {
		zip.configure({ chunkSize: 128 });
		const zipWriter = new zip.ZipWriter(new zip.Data64URIWriter());
		await zipWriter.add(FILENAME, new zip.TextReader(""));
		const data64Uri = await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.Data64URIReader(data64Uri));
		const entries = await zipReader.getEntries();
		await entries[0].getData(new zip.BlobWriter());
		await zipReader.close();
	} finally {
		// zip.terminateWorkers()
	}
});