const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", process.argv.includes("--artifact") ? "_site" : ".");
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
    const articleFiles = require("./generate-blog").getPublishedPosts()
        .map((post) => path.join("blog", post.slug, "index.html"));
    return [...rootFiles, ...serviceFiles, ...articleFiles];
}

function inspectHtml(html) {
    const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
    const description = decodeHtml(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || "");
    const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
    const bodyHtml = html.match(/<body[\s\S]*?<\/body>/i)?.[0] || "";
    const bodyText = decodeHtml(bodyHtml)
        .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ")
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
    if (headings.filter((level) => level === 1).length !== 1) issues.push("expected one H1");
    if (headings.some((level, index) => index > 0 && level > headings[index - 1] + 1)) issues.push("heading level skip");
    if (wordCount < CONTENT_MIN_WORDS) issues.push(`thin content (${wordCount} words)`);
    const pathname = file === "index.html" ? "/" : `/${file.replace(/index\.html$/, "")}`;
    const expectedCanonical = `https://baobabcat.com${pathname}`;
    if (!html.includes(`<link rel="canonical" href="${expectedCanonical}">`)) issues.push("missing or incorrect canonical");
    const sitemap = fs.readFileSync(path.join(repoRoot, "sitemap.xml"), "utf8");
    if (!sitemap.includes(`<loc>${expectedCanonical}</loc>`)) issues.push("missing from sitemap");
    issues.push(...checkLocalReferences(html, expectedCanonical));
    return issues;
}

function checkLocalReferences(html, baseUrl) {
    const issues = [];
    const markup = html.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>").replace(/<style\b[\s\S]*?<\/style>/gi, "");
    for (const match of markup.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
        const value = decodeHtml(match[1]);
        let url;
        try { url = new URL(value, baseUrl); } catch { issues.push(`invalid URL: ${value}`); continue; }
        if (url.origin !== "https://baobabcat.com") continue;
        const relative = decodeURIComponent(url.pathname).replace(/^\//, "");
        let target = path.resolve(repoRoot, relative);
        if (target !== repoRoot && !target.startsWith(`${repoRoot}${path.sep}`)) { issues.push(`unsafe URL: ${value}`); continue; }
        if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
        if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { issues.push(`broken local reference: ${value}`); continue; }
        if (url.hash && target.endsWith(".html")) {
            const id = decodeURIComponent(url.hash.slice(1));
            const targetHtml = fs.readFileSync(target, "utf8");
            if (![...targetHtml.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)].some((item) => item[1] === id)) issues.push(`missing fragment: ${value}`);
        }
    }
    for (const match of html.matchAll(/<meta[^>]+(?:property|name)="(?:og:image|twitter:image)"[^>]+content="([^"]+)"/g)) {
        const url = new URL(match[1], baseUrl);
        if (url.origin !== "https://baobabcat.com" || !fs.existsSync(path.join(repoRoot, url.pathname))) issues.push(`missing social asset: ${match[1]}`);
    }
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
    const recoveryIssues = checkLocalReferences(fs.readFileSync(path.join(repoRoot, "404.html"), "utf8"), "https://baobabcat.com/missing/nested/path");
    if (recoveryIssues.length) throw new Error(`404 recovery: ${recoveryIssues.join(", ")}`);
    return getIndexableHtmlFiles().length;
}

module.exports = { auditFile, getIndexableHtmlFiles, inspectHtml, runAudit, checkLocalReferences };

if (require.main === module) {
    try {
        const count = runAudit();
        console.log(`OpenSEO-compatible checks passed for ${count} indexable pages.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
