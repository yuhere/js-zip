import { readFileSync, writeFileSync, existsSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const versionBadge = `https://img.shields.io/badge/npm-v${pkg.version}-blue`;

let coverageBadge = "";
const coverageFile = "coverage/merged/coverage-final.json";

if (existsSync(coverageFile)) {
	const coverage = JSON.parse(readFileSync(coverageFile, "utf8"));

	const lineHits = new Map();
	for (const [file, data] of Object.entries(coverage)) {
		for (const [stmtId, count] of Object.entries(data.s || {})) {
			const stmt = data.statementMap?.[stmtId];
			if (stmt) {
				const key = `${file}:${stmt.start.line}`;
				if (count > 0) lineHits.set(key, true);
				else if (!lineHits.has(key)) lineHits.set(key, false);
			}
		}
	}

	const total = lineHits.size;
	const covered = [...lineHits.values()].filter(Boolean).length;
	const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
	const color = pct >= 90 ? "brightgreen" : pct >= 80 ? "green" : pct >= 70 ? "yellowgreen" : pct >= 60 ? "yellow" : pct >= 50 ? "orange" : "red";
	coverageBadge = `https://img.shields.io/badge/coverage-${pct}%25-${color}`;
}

const readme = readFileSync("README.md", "utf8");
let updated = readme.replace(/https:\/\/img\.shields\.io\/badge\/npm-v[^"')]+/, versionBadge);
if (coverageBadge) {
	updated = updated.replace(/https:\/\/img\.shields\.io\/badge\/coverage-[^"')]+/, coverageBadge);
}
if (updated !== readme) {
	writeFileSync("README.md", updated);
	console.log(`README.md updated: version=${pkg.version}${coverageBadge ? ", coverage updated" : ""}`);
}
