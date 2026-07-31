import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		{
			name: "serve-test-data-with-range",
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					if (!req.url || !req.url.startsWith("/test/data/")) {
						return next();
					}
					const filePath = path.join(__dirname, req.url);
					try {
						const stats = statSync(filePath);
						const range = req.headers.range;
						if (range) {
							const parts = range.replace(/bytes=/, "").split("-");
							const start = parseInt(parts[0], 10);
							const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
							res.writeHead(206, {
								"Content-Range": `bytes ${start}-${end}/${stats.size}`,
								"Accept-Ranges": "bytes",
								"Content-Length": end - start + 1,
								"Content-Type": "application/octet-stream",
							});
							createReadStream(filePath, { start, end }).pipe(res);
						} else {
							res.writeHead(200, {
								"Content-Length": stats.size,
								"Accept-Ranges": "bytes",
								"Content-Type": "application/octet-stream",
							});
							createReadStream(filePath).pipe(res);
						}
					} catch {
						next();
					}
				});
			},
		},
	],
	test: {
		globals: true,
		include: ["test/all/*.spec.js"],
		exclude: ["test/all/zip64-auto.spec.js"],

		browser: {
			enabled: true,
			provider: playwright(),
			screenshotFailures: false,
			instances: [
				{
					browser: "chromium",
					headless: false,
					launch: {
						args: ["--disable-dev-shm-usage"],
					},
				},
			],
		},

		coverage: {
			provider: "v8",
			reporter: ["json", "text", "html", "lcov"],
			include: ["src/**/*.js"],
			reportsDirectory: "coverage/browser",
		},
	},
});
