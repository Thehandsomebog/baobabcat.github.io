const fs = require("fs");
const path = require("path");
const posts = require("../content/posts.cjs");

const repoRoot = path.resolve(__dirname, "..");
const blogPath = path.join(repoRoot, "blog.html");
const homePath = path.join(repoRoot, "index.html");

const BLOG_ENTRIES_START = "<!-- GENERATED_BLOG_ENTRIES_START -->";
const BLOG_ENTRIES_END = "<!-- GENERATED_BLOG_ENTRIES_END -->";
const BLOG_TEMPLATES_START = "<!-- GENERATED_BLOG_TEMPLATES_START -->";
const BLOG_TEMPLATES_END = "<!-- GENERATED_BLOG_TEMPLATES_END -->";
const HOME_POSTS_START = "<!-- GENERATED_HOME_POSTS_START -->";
const HOME_POSTS_END = "<!-- GENERATED_HOME_POSTS_END -->";

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00Z`);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        timeZone: "UTC",
    }).replace(",", "");
}

function indentBlock(block, indent) {
    return block
        .trim()
        .split("\n")
        .map((line) => `${indent}${line}`)
        .join("\n");
}

function replaceSection(fileContent, startMarker, endMarker, generatedBlock) {
    const startIndex = fileContent.indexOf(startMarker);
    const endIndex = fileContent.indexOf(endMarker);
    assert(startIndex !== -1, `Missing start marker ${startMarker}`);
    assert(endIndex !== -1 && endIndex > startIndex, `Missing end marker ${endMarker}`);

    const before = fileContent.slice(0, startIndex + startMarker.length);
    const after = fileContent.slice(endIndex);
    return `${before}\n${generatedBlock}\n${after}`;
}

function getPublishedPosts() {
    const slugs = new Set();
    const published = posts
        .filter((post) => (post.status || "published") === "published")
        .map((post) => ({ ...post }))
        .sort((left, right) => new Date(right.date) - new Date(left.date));

    assert(published.length > 0, "At least one published post is required.");

    published.forEach((post) => {
        assert(post.slug, "Each post needs a slug.");
        assert(!slugs.has(post.slug), `Duplicate slug: ${post.slug}`);
        slugs.add(post.slug);
        assert(post.title, `Missing title for ${post.slug}`);
        assert(post.date, `Missing date for ${post.slug}`);
        assert(post.readTime, `Missing readTime for ${post.slug}`);
        assert(post.category, `Missing category for ${post.slug}`);
        assert(post.filename, `Missing filename for ${post.slug}`);
        assert(post.summary, `Missing summary for ${post.slug}`);
        assert(post.bodyHtml, `Missing bodyHtml for ${post.slug}`);
    });

    return published;
}

function renderBlogEntries(postsToRender) {
    return postsToRender.map((post) => `                <div class="blog-entry" data-post="${post.slug}">
                    <span class="blog-entry__perms">-rw-r--r--</span>
                    <span class="blog-entry__date">${formatDate(post.date)}</span>
                    <span class="blog-entry__time">${post.readTime}</span>
                    <span class="blog-entry__name">${post.filename}</span>
                </div>`).join("\n");
}

function renderBlogTemplates(postsToRender) {
    return postsToRender.map((post) => `        <template id="post-${post.slug}">
${indentBlock(post.bodyHtml, "            ")}
        </template>`).join("\n\n");
}

function renderHomePosts(postsToRender) {
    const featuredPosts = postsToRender.filter((post) => post.featured === true).slice(0, 3);
    const homepagePosts = featuredPosts.length > 0 ? featuredPosts : postsToRender.slice(0, 3);

    return homepagePosts.map((post) => `                        <article class="post-preview">
                            <div class="post-preview__meta">${post.category}</div>
                            <h3><a href="blog.html#post-${post.slug}">${post.title}</a></h3>
                            <p>${post.homeSummary || post.summary}</p>
                        </article>`).join("\n");
}

function main() {
    const publishedPosts = getPublishedPosts();

    const blogHtml = fs.readFileSync(blogPath, "utf8");
    const homeHtml = fs.readFileSync(homePath, "utf8");

    const updatedBlog = replaceSection(
        replaceSection(blogHtml, BLOG_ENTRIES_START, BLOG_ENTRIES_END, renderBlogEntries(publishedPosts)),
        BLOG_TEMPLATES_START,
        BLOG_TEMPLATES_END,
        renderBlogTemplates(publishedPosts)
    );

    const updatedHome = replaceSection(
        homeHtml,
        HOME_POSTS_START,
        HOME_POSTS_END,
        renderHomePosts(publishedPosts)
    );

    fs.writeFileSync(blogPath, updatedBlog);
    fs.writeFileSync(homePath, updatedHome);

    console.log(`Generated blog output from ${publishedPosts.length} published posts.`);
}

main();
