const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, ".lighthouseci");
const port = 4174;
const baseUrl = `http://127.0.0.1:${port}`;
const routes = ["/", "/contact.html", "/blog.html", "/blog/why-ai-pilots-stall/"];
const budgets = {
    performance: 0.9,
    accessibility: 1,
    "best-practices": 0.95,
    seo: 0.95,
};

async function waitForServer() {
    for (let attempt = 0; attempt < 40; attempt += 1) {
        try {
            const response = await fetch(baseUrl);
            if (response.ok) return;
        } catch {
            // Server is still starting.
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("Preview server did not become ready.");
}

async function main() {
    const [{ default: lighthouse }, chromeLauncher] = await Promise.all([
        import("lighthouse"),
        import("chrome-launcher"),
    ]);
    fs.mkdirSync(outputDir, { recursive: true });

    const server = spawn(
        process.execPath,
        [path.join(root, "node_modules", "serve", "build", "main.js"), "-l", String(port)],
        { cwd: root, stdio: "ignore" }
    );

    let chrome;
    try {
        await waitForServer();
        chrome = await chromeLauncher.launch({
            chromePath: chromium.executablePath(),
            chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
        });

        for (const route of routes) {
            const result = await lighthouse(`${baseUrl}${route}`, {
                port: chrome.port,
                output: "json",
                logLevel: "error",
                formFactor: "mobile",
                screenEmulation: {
                    mobile: true,
                    width: 412,
                    height: 823,
                    deviceScaleFactor: 1,
                    disabled: false,
                },
            });
            const report = result.lhr;
            const routeName = route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replaceAll("/", "-").replaceAll(".", "_");
            fs.writeFileSync(path.join(outputDir, `${routeName}.json`), result.report);

            for (const [category, minimum] of Object.entries(budgets)) {
                const score = report.categories[category].score;
                if (score < minimum) {
                    throw new Error(`${route} ${category} score ${score} is below ${minimum}`);
                }
            }

            const lcp = report.audits["largest-contentful-paint"].numericValue;
            const cls = report.audits["cumulative-layout-shift"].numericValue;
            const tbt = report.audits["total-blocking-time"].numericValue;
            if (lcp > 2500 || cls > 0.1 || tbt > 200) {
                throw new Error(`${route} exceeded a metric budget: LCP=${lcp}, CLS=${cls}, TBT=${tbt}`);
            }

            const scores = Object.keys(budgets)
                .map((category) => `${category}=${Math.round(report.categories[category].score * 100)}`)
                .join(" ");
            console.log(`${route} ${scores} LCP=${Math.round(lcp)}ms CLS=${cls.toFixed(3)} TBT=${Math.round(tbt)}ms`);
        }
    } finally {
        if (chrome) await chrome.kill();
        server.kill("SIGTERM");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
