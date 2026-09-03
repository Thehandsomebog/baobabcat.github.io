const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const TITLE_MIN = 10;
const TITLE_MAX = 60;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_MAX = 160;
const CONTENT_MIN_WORDS = 150;

function decodeHtml(value) {
    return value
        .replaceAll("&amp;", "&")
        .replaceAll("&quot;", '"')
        .replaceAll("&#39;", "'")
        .replaceAll("&apos;", "'")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">");
}

function getIndexableHtmlFiles() {
    const rootFiles = [
        "index.html",
        "services.html",
        "blog.html",
        "case-studies.html",
        "contact.html",
        "privacy.html",
        "manifesto.html",
    ];
    const serviceFiles = fs.readdirSync(path.join(repoRoot, "services"))
        .filter((name) => name.endsWith(".html"))
        .map((name) => path.join("services", name));
    const articleFiles = fs.readdirSync(path.join(repoRoot, "blog"))
        .map((slug) => path.join("blog", slug, "index.html"))
        .filter((file) => fs.existsSync(path.join(repoRoot, file)));
    return [...rootFiles, ...serviceFiles, ...articleFiles];
}

function inspectHtml(html) {
    const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
    const description = decodeHtml(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || "");
    const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
    const bodyHtml = html.match(/<body[\s\S]*?<\/body>/i)?.[0] || "";
    const bodyText = decodeHtml(bodyHtml)
        .replace(/<(script|style|noscript|svg)\b[\s\S]*?<\/\1>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return {
        title,
        description,
        headings,
        wordCount: bodyText ? bodyText.split(/\s+/).length : 0,
    };
}

function auditFile(file) {
    const html = fs.readFileSync(path.join(repoRoot, file), "utf8");
    const { title, description, headings, wordCount } = inspectHtml(html);
    const issues = [];
    if (title.length < TITLE_MIN || title.length > TITLE_MAX) issues.push(`title length ${title.length}`);
    if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) issues.push(`description length ${description.length}`);
    if (!headings.includes(1)) issues.push("missing H1");
    if (headings.some((level, index) => index > 0 && level > headings[index - 1] + 1)) issues.push("heading level skip");
    if (wordCount < CONTENT_MIN_WORDS) issues.push(`thin content (${wordCount} words)`);
    return issues;
}

function runAudit() {
    const results = getIndexableHtmlFiles()
        .map((file) => ({ file, issues: auditFile(file) }))
        .filter((result) => result.issues.length > 0);
    if (results.length) {
        const details = results.map(({ file, issues }) => `${file}: ${issues.join(", ")}`).join("\n");
        throw new Error(`OpenSEO-compatible checks failed:\n${details}`);
    }
    return getIndexableHtmlFiles().length;
}

module.exports = { auditFile, getIndexableHtmlFiles, inspectHtml, runAudit };

if (require.main === module) {
    try {
        const count = runAudit();
        console.log(`OpenSEO-compatible checks passed for ${count} indexable pages.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
