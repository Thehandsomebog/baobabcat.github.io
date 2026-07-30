const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const posts = require("../content/posts.cjs");
const { proofEntries, representativePatterns } = require("../content/proof.cjs");

const repoRoot = path.resolve(__dirname, "..");
const blogPath = path.join(repoRoot, "blog.html");
const homePath = path.join(repoRoot, "index.html");
const casesPath = path.join(repoRoot, "case-studies.html");
const sitemapPath = path.join(repoRoot, "sitemap.xml");
const socialDir = path.join(repoRoot, "assets", "social");
const siteUrl = "https://baobabcat.com";

const BLOG_ENTRIES_START = "<!-- GENERATED_BLOG_ENTRIES_START -->";
const BLOG_ENTRIES_END = "<!-- GENERATED_BLOG_ENTRIES_END -->";
const BLOG_TEMPLATES_START = "<!-- GENERATED_BLOG_TEMPLATES_START -->";
const BLOG_TEMPLATES_END = "<!-- GENERATED_BLOG_TEMPLATES_END -->";
const HOME_POSTS_START = "<!-- GENERATED_HOME_POSTS_START -->";
const HOME_POSTS_END = "<!-- GENERATED_HOME_POSTS_END -->";
const HOME_PROOF_START = "<!-- GENERATED_HOME_PROOF_START -->";
const HOME_PROOF_END = "<!-- GENERATED_HOME_PROOF_END -->";
const CASES_START = "<!-- GENERATED_CASES_START -->";
const CASES_END = "<!-- GENERATED_CASES_END -->";

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function formatDate(dateString, includeYear = false) {
    const date = new Date(`${dateString}T00:00:00Z`);
    return date.toLocaleString("en-US", {
        month: includeYear ? "long" : "short",
        day: "2-digit",
        year: includeYear ? "numeric" : undefined,
        timeZone: "UTC",
    }).replace(",", "");
}

function slugifyCategory(category) {
    return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function capitalize(value) {
    return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

function getArchivePresentation(post) {
    if (post.displayTitle) {
        return {
            displayTitle: post.displayTitle,
            series: post.series || "",
        };
    }

    const cleanupMatch = post.title.match(/^What to clean up before AI touches (?:your )?(.+)$/i);
    if (cleanupMatch) {
        return {
            displayTitle: capitalize(cleanupMatch[1]),
            series: "Before AI touches…",
        };
    }

    return {
        displayTitle: post.title,
        series: post.series || "",
    };
}

function indentBlock(block, indent) {
    return block.trim().split("\n").map((line) => `${indent}${line}`).join("\n");
}

function replaceSection(fileContent, startMarker, endMarker, generatedBlock) {
    const startIndex = fileContent.indexOf(startMarker);
    const endIndex = fileContent.indexOf(endMarker);
    assert(startIndex !== -1, `Missing start marker ${startMarker}`);
    assert(endIndex !== -1 && endIndex > startIndex, `Missing end marker ${endMarker}`);
    return `${fileContent.slice(0, startIndex + startMarker.length)}\n${generatedBlock}\n${fileContent.slice(endIndex)}`;
}

function writeIfChanged(filePath, content) {
    if (!fs.existsSync(filePath) || fs.readFileSync(filePath, "utf8") !== content) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content);
    }
}

function getPublishedPosts() {
    const slugs = new Set();
    const published = posts
        .filter((post) => (post.status || "published") === "published")
        .map((post) => ({ ...post, canonicalPath: `/blog/${post.slug}/` }))
        .sort((left, right) => new Date(right.date) - new Date(left.date));

    assert(published.length > 0, "At least one published post is required.");
    published.forEach((post) => {
        ["slug", "title", "date", "readTime", "category", "filename", "summary", "bodyHtml"].forEach((field) => {
            assert(post[field], `Missing ${field} for ${post.slug || "post"}`);
        });
        assert(!slugs.has(post.slug), `Duplicate slug: ${post.slug}`);
        slugs.add(post.slug);
    });
    return published;
}

function getApprovedProof() {
    const slugs = new Set();
    return proofEntries.filter((entry) => {
        assert(entry.slug && !slugs.has(entry.slug), `Invalid or duplicate proof slug: ${entry.slug}`);
        slugs.add(entry.slug);
        if (!entry.approvedForPublicUse) return false;
        ["category", "clientDisplayName", "problem", "intervention", "outcome", "evidenceReviewedAt"].forEach((field) => {
            assert(entry[field], `Approved proof ${entry.slug} is missing ${field}`);
        });
        assert(Array.isArray(entry.metrics) && entry.metrics.length > 0, `Approved proof ${entry.slug} needs metrics`);
        entry.metrics.forEach((metric) => {
            ["label", "value", "method", "timeframe"].forEach((field) => {
                assert(metric[field], `Metric in ${entry.slug} is missing ${field}`);
            });
        });
        if (entry.testimonial) {
            ["quote", "attribution", "role"].forEach((field) => {
                assert(entry.testimonial[field], `Testimonial in ${entry.slug} is missing ${field}`);
            });
            assert(entry.testimonial.permissionConfirmed === true, `Testimonial in ${entry.slug} lacks permission`);
        }
        return true;
    });
}

function renderBlogEntries(postsToRender) {
    return postsToRender.map((post) => {
        const { displayTitle, series } = getArchivePresentation(post);
        const searchText = `${post.title} ${displayTitle} ${post.category}`;
        const seriesMarkup = series ? `<span class="blog-entry__series">${escapeHtml(series)}</span>` : "";
        return `                <a class="blog-entry" href="${post.canonicalPath}" data-post="${post.slug}" data-category="${slugifyCategory(post.category)}" data-search="${escapeHtml(searchText)}" aria-label="${escapeHtml(`${post.title}, ${post.category}, ${formatDate(post.date)}, ${post.readTime} read`)}" aria-expanded="false" aria-controls="blog-reader">
                    <span class="blog-entry__category">${escapeHtml(post.category)}</span>
                    <span class="blog-entry__date">${formatDate(post.date)}</span>
                    <span class="blog-entry__time">${escapeHtml(post.readTime)}</span>
                    <span class="blog-entry__title-group">${seriesMarkup}<span class="blog-entry__name">${escapeHtml(displayTitle)}</span></span>
                </a>`;
    }).join("\n");
}

function renderBlogTemplates(postsToRender) {
    return postsToRender.map((post) => `        <template id="post-${post.slug}">
            <a class="blog-reader__full-link" href="${post.canonicalPath}">Open full article</a>
${indentBlock(post.bodyHtml, "            ")}
        </template>`).join("\n\n");
}

function renderHomePosts(postsToRender) {
    const featuredPosts = postsToRender.filter((post) => post.featured === true).slice(0, 3);
    const homepagePosts = featuredPosts.length > 0 ? featuredPosts : postsToRender.slice(0, 3);
    return homepagePosts.map((post) => `                        <article class="post-preview">
                            <div class="post-preview__meta">${escapeHtml(post.category)}</div>
                            <h3><a href="${post.canonicalPath}">${escapeHtml(post.title)}</a></h3>
                            <p>${escapeHtml(post.homeSummary || post.summary)}</p>
                        </article>`).join("\n");
}

function renderProofCard(entry, representative = false) {
    const heading = representative ? entry.title : entry.clientDisplayName;
    const metrics = representative ? "" : `<dl class="proof-card__metrics">${entry.metrics.map((metric) => `
                        <div><dt>${escapeHtml(metric.label)}</dt><dd>${escapeHtml(metric.value)}</dd><small>${escapeHtml(metric.timeframe)} · ${escapeHtml(metric.method)}</small></div>`).join("")}
                    </dl>`;
    const testimonial = !representative && entry.testimonial ? `
                    <blockquote><p>“${escapeHtml(entry.testimonial.quote)}”</p><cite>${escapeHtml(entry.testimonial.attribution)}, ${escapeHtml(entry.testimonial.role)}</cite></blockquote>` : "";
    return `            <article class="proof-card">
                <div class="kicker">${escapeHtml(entry.category)}</div>
                <h3>${escapeHtml(heading)}</h3>
                <div class="proof-card__story">
                    <div><span>operating problem</span><p>${escapeHtml(entry.problem)}</p></div>
                    <div><span>intervention</span><p>${escapeHtml(entry.intervention)}</p></div>
                    <div class="proof-card__outcome"><span>${representative ? "intended outcome" : "verified outcome"}</span><p>${escapeHtml(entry.outcome)}</p></div>
                </div>${metrics}${testimonial}
            </article>`;
}

function renderCaseStudies(approvedProof) {
    if (approvedProof.length) return approvedProof.map((entry) => renderProofCard(entry)).join("\n");
    return `            <div class="proof-disclosure" role="note">
                <strong>Representative engagement patterns</strong>
                <p>These are examples of the operating problems and intended outcomes BaobabCat works toward. They are not attributed client results or verified performance claims.</p>
            </div>
${representativePatterns.map((entry) => renderProofCard(entry, true)).join("\n")}`;
}

function renderHomeProof(approvedProof) {
    const source = approvedProof.length ? approvedProof.slice(0, 3) : representativePatterns;
    return source.map((entry) => `            <a href="case-studies.html" class="outcome-strip__item">
                <span>${escapeHtml(entry.category)}</span>
                <strong>${escapeHtml(approvedProof.length ? entry.outcome : entry.title)}</strong>
            </a>`).join("\n");
}

function absolutizeArticleHtml(html) {
    return html
        .replaceAll('href="services/', 'href="/services/')
        .replaceAll('href="contact.html"', 'href="/contact.html"')
        .replaceAll('href="blog.html"', 'href="/blog.html"')
        .replaceAll('href="case-studies.html"', 'href="/case-studies.html"');
}

function articlePage(post) {
    const title = escapeHtml(post.title);
    const description = escapeHtml(post.summary);
    const canonical = `${siteUrl}${post.canonicalPath}`;
    const social = `${siteUrl}/assets/social/${post.slug}.jpg`;
    const articleBody = absolutizeArticleHtml(post.bodyHtml)
        .replace(/<h2>.*?<\/h2>/, "")
        .replaceAll("<h3>", "<h2>")
        .replaceAll("</h3>", "</h2>");
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | BaobabCat</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${social}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="BaobabCat article card: ${title}">
    <meta property="article:published_time" content="${post.date}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${social}">
    <meta name="twitter:image:alt" content="BaobabCat article card: ${title}">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="stylesheet" href="/styles.css">
</head>
<body class="page-article">
    <main class="site-wrap article-layout">
        <nav class="article-breadcrumb" aria-label="Breadcrumb"><a href="/blog.html">Blog</a><span aria-hidden="true">/</span><span>${escapeHtml(post.category)}</span></nav>
        <article class="article-document">
            <header class="article-header">
                <div class="eyebrow">${escapeHtml(post.category)}</div>
                <h1>${title}</h1>
                <p class="article-meta"><time datetime="${post.date}">${formatDate(post.date, true)}</time><span>${escapeHtml(post.readTime)} read</span></p>
                <p class="article-summary">${description}</p>
            </header>
            <div class="blog-reader__content article-content">
${indentBlock(articleBody, "                ")}
            </div>
        </article>
        <aside class="pane article-cta">
            <div class="pane__label">~/next-step</div>
            <div class="pane__body cta-strip">
                <div><div class="section-title">Apply this to a real workflow</div><p class="section-copy">Bring the queue, handoff, or operating problem that needs to change.</p></div>
                <a class="btn-terminal btn-terminal--primary" href="/contact.html">[Contact BaobabCat]</a>
            </div>
        </aside>
    </main>
    ${statusBar("/")}
    <script src="/terminal.js"></script>
</body>
</html>
`;
}

function statusBar(prefix = "") {
    return `<nav class="status-bar" aria-label="Primary">
        <span class="status-bar__session">BaobabCat</span>
        <ul class="status-bar__tabs">
            <li class="status-bar__tab"><a href="${prefix}index.html">0:home</a></li>
            <li class="status-bar__tab"><a href="${prefix}services.html">1:services</a></li>
            <li class="status-bar__tab"><a href="${prefix}blog.html">2:blog</a></li>
            <li class="status-bar__tab"><a href="${prefix}case-studies.html">3:cases</a></li>
            <li class="status-bar__tab"><a href="${prefix}contact.html">4:contact</a></li>
        </ul>
        <span id="tmux-clock" class="status-bar__clock"></span>
    </nav>`;
}

function wrapText(title, maxChars = 34) {
    const words = title.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((word) => {
        if (`${line} ${word}`.trim().length > maxChars && line) {
            lines.push(line);
            line = word;
        } else {
            line = `${line} ${word}`.trim();
        }
    });
    if (line) lines.push(line);
    return lines.slice(0, 4);
}

function socialSvg(title, category = "AI operations") {
    const lines = wrapText(title);
    const titleLines = lines.map((line, index) => `<text x="76" y="${245 + index * 66}" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="#f3f7f4">${escapeHtml(line)}</text>`).join("");
    return Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#0b0d0c"/>
        <circle cx="1080" cy="70" r="330" fill="#6fd56f" opacity=".08"/>
        <rect x="42" y="42" width="1116" height="546" rx="18" fill="#111512" stroke="#344039" stroke-width="2"/>
        <text x="76" y="105" font-family="monospace" font-size="24" fill="#6fd56f">$ baobabcat open</text>
        <text x="76" y="170" font-family="monospace" font-size="22" fill="#9aa59e">${escapeHtml(category)}</text>
        ${titleLines}
        <text x="76" y="548" font-family="monospace" font-size="24" fill="#f4c95d">Deploy AI. Stay human.</text>
        <text x="1124" y="548" text-anchor="end" font-family="monospace" font-size="20" fill="#9aa59e">baobabcat.com</text>
    </svg>`);
}

async function generateSocialImage(filePath, title, category) {
    const next = await sharp(socialSvg(title, category)).jpeg({ quality: 82, progressive: true }).toBuffer();
    assert(next.length <= 200 * 1024, `${path.basename(filePath)} exceeds 200 KB`);
    if (!fs.existsSync(filePath) || !fs.readFileSync(filePath).equals(next)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, next);
    }
}

function renderSitemap(publishedPosts) {
    const staticUrls = [
        ["/", "weekly", "1.0"],
        ["/services.html", "monthly", "0.9"],
        ["/blog.html", "weekly", "0.8"],
        ["/case-studies.html", "monthly", "0.7"],
        ["/contact.html", "monthly", "0.8"],
        ["/privacy.html", "yearly", "0.3"],
        ["/manifesto.html", "monthly", "0.4"],
    ];
    const latest = publishedPosts[0].date;
    const urls = staticUrls.map(([url, frequency, priority]) => `  <url><loc>${siteUrl}${url}</loc><lastmod>${latest}</lastmod><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`);
    publishedPosts.forEach((post) => {
        urls.push(`  <url><loc>${siteUrl}${post.canonicalPath}</loc><lastmod>${post.date}</lastmod><changefreq>yearly</changefreq><priority>0.6</priority></url>`);
    });
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

async function main() {
    const publishedPosts = getPublishedPosts();
    const approvedProof = getApprovedProof();
    const blogHtml = fs.readFileSync(blogPath, "utf8");
    const homeHtml = fs.readFileSync(homePath, "utf8");
    const casesHtml = fs.readFileSync(casesPath, "utf8");

    writeIfChanged(blogPath, replaceSection(
        replaceSection(blogHtml, BLOG_ENTRIES_START, BLOG_ENTRIES_END, renderBlogEntries(publishedPosts)),
        BLOG_TEMPLATES_START,
        BLOG_TEMPLATES_END,
        renderBlogTemplates(publishedPosts)
    ));
    writeIfChanged(homePath, replaceSection(
        replaceSection(homeHtml, HOME_POSTS_START, HOME_POSTS_END, renderHomePosts(publishedPosts)),
        HOME_PROOF_START,
        HOME_PROOF_END,
        renderHomeProof(approvedProof)
    ));
    writeIfChanged(casesPath, replaceSection(casesHtml, CASES_START, CASES_END, renderCaseStudies(approvedProof)));

    for (const post of publishedPosts) {
        writeIfChanged(path.join(repoRoot, "blog", post.slug, "index.html"), articlePage(post));
        await generateSocialImage(path.join(socialDir, `${post.slug}.jpg`), post.title, post.category);
    }
    await generateSocialImage(path.join(repoRoot, "og-image.jpg"), "AI systems for real business workflows", "BaobabCat");
    writeIfChanged(sitemapPath, renderSitemap(publishedPosts));
    console.log(`Generated ${publishedPosts.length} articles, social cards, proof, and sitemap output.`);
}

module.exports = { getPublishedPosts, getApprovedProof, getArchivePresentation, renderSitemap, articlePage };

if (require.main === module) {
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}
