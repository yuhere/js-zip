import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["test/all/*.spec.js"],
		setupFiles: ["./test/setup.js"],

		coverage: {
			provider: "v8",
			reporter: ["json", "text", "html", "lcov"],
			include: ["src/**/*.js"],
			reportsDirectory: "coverage/node",
			thresholds: {
				lines: 70,
				functions: 68,
				statements: 68,
				branches: 48,
			},
		},

		pool: "forks",
		singleFork: true,
	},
});
