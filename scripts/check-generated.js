const { execFileSync } = require("node:child_process");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const outputs = ["*.html", "sitemap.xml", "assets/social", "og-image.jpg"];
execFileSync(process.execPath, ["scripts/generate-blog.js"], { cwd: root, stdio: "inherit" });
execFileSync("git", ["diff", "--exit-code", "--", ...outputs], { cwd: root, stdio: "inherit" });
const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...outputs], { cwd: root, encoding: "utf8" });
if (untracked.trim()) throw new Error(`Untracked generated output:\n${untracked}`);
