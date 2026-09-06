const fs = require("fs");
const path = require("path");
const { getPublishedPosts } = require("./generate-blog");

const root = path.resolve(__dirname, "..");
const rootFiles = [
    "404.html",
    "CNAME",
    "ai-pulse.html",
    "apple-touch-icon.png",
    "blog.html",
    "case-studies.html",
    "contact.html",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon.svg",
    "googlefcc2469c106d4caa.html",
    "index.html",
    "manifesto.html",
    "og-image.jpg",
    "privacy.html",
    "robots.txt",
    "services.html",
    "sitemap.xml",
    "styles.css",
    "terminal.js",
];

function prepareDeploy(destination = path.join(root, "_site"), publishedPosts = getPublishedPosts()) {
    if (path.resolve(destination) === root || path.resolve(destination) === path.parse(root).root) throw new Error("Unsafe artifact destination");
    fs.rmSync(destination, { recursive: true, force: true });
    fs.mkdirSync(destination, { recursive: true });

    for (const file of rootFiles) {
        const source = path.join(root, file);
        if (fs.existsSync(source)) fs.copyFileSync(source, path.join(destination, file));
    }

    fs.cpSync(path.join(root, "services"), path.join(destination, "services"), { recursive: true });
    fs.mkdirSync(path.join(destination, "assets", "social"), { recursive: true });
    for (const post of publishedPosts) {
        const articleDirectory = path.join(destination, "blog", post.slug);
        fs.mkdirSync(articleDirectory, { recursive: true });
        fs.copyFileSync(path.join(root, "blog", post.slug, "index.html"), path.join(articleDirectory, "index.html"));
        fs.copyFileSync(path.join(root, "assets", "social", `${post.slug}.jpg`), path.join(destination, "assets", "social", `${post.slug}.jpg`));
    }
    for (const file of fs.readdirSync(path.join(root, "services")).filter((file) => file.endsWith(".html"))) {
        const socialFile = `service-${file.replace(/\.html$/, "")}.jpg`;
        fs.copyFileSync(path.join(root, "assets", "social", socialFile), path.join(destination, "assets", "social", socialFile));
    }
    fs.writeFileSync(path.join(destination, ".nojekyll"), "");

    console.log(`Prepared deploy artifact at ${destination}`);
    return destination;
}

module.exports = { prepareDeploy };
if (require.main === module) prepareDeploy();
