import { createRequire } from "module";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const require = createRequire(import.meta.url);
const { createCoverageMap } = require("istanbul-lib-coverage");
const libReport = require("istanbul-lib-report");
const reports = require("istanbul-reports");

const nodeCoverage = JSON.parse(
	readFileSync("coverage/node/coverage-final.json", "utf8")
);
const browserCoverage = JSON.parse(
	readFileSync("coverage/browser/coverage-final.json", "utf8")
);

const mergedMap = createCoverageMap(nodeCoverage);
mergedMap.merge(browserCoverage);

console.log("Coverage merged to coverage/merged/");

mkdirSync("coverage/merged", { recursive: true });
writeFileSync(
	"coverage/merged/coverage-final.json",
	JSON.stringify(mergedMap.toJSON())
);

const context = libReport.createContext({
	dir: "coverage/merged",
	coverageMap: mergedMap,
});
reports.create("text").execute(context);
reports.create("html").execute(context);
reports.create("lcov").execute(context);

console.log("Coverage merged to coverage/merged/");
