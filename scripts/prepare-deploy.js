const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const destination = path.join(root, "_site");
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

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });

for (const file of rootFiles) {
    const source = path.join(root, file);
    if (fs.existsSync(source)) fs.copyFileSync(source, path.join(destination, file));
}

for (const directory of ["blog", "services"]) {
    fs.cpSync(path.join(root, directory), path.join(destination, directory), { recursive: true });
}

fs.mkdirSync(path.join(destination, "assets"), { recursive: true });
fs.cpSync(path.join(root, "assets", "social"), path.join(destination, "assets", "social"), { recursive: true });
fs.writeFileSync(path.join(destination, ".nojekyll"), "");

console.log(`Prepared deploy artifact at ${destination}`);
