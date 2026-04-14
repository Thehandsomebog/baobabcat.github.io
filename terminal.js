function typeText(element, text, speed = 40) {
    return new Promise((resolve) => {
        let i = 0;

        function tick() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i += 1;
                window.setTimeout(tick, speed);
                return;
            }

            resolve();
        }

        tick();
    });
}

async function animateHero() {
    const output = document.getElementById("typed-output");
    const subtitle = document.getElementById("subtitle-text");
    if (!output || !subtitle) {
        return;
    }

    const line1 = document.createElement("span");
    line1.style.color = "var(--accent-green)";
    output.appendChild(line1);
    await typeText(line1, "Deploy AI.", 42);

    output.appendChild(document.createTextNode("\n"));

    const line2 = document.createElement("span");
    line2.style.color = "var(--accent-yellow)";
    output.appendChild(line2);
    await typeText(line2, "Stay human.", 42);

    await new Promise((resolve) => window.setTimeout(resolve, 260));
    await typeText(subtitle, "Practical AI systems for companies that want measurable business outcomes, not demos.", 16);
}

function animateStats() {
    const container = document.getElementById("stats-output");
    if (!container) {
        return;
    }

    const stats = [
        { key: "services             ", value: ": strategy, automation, training" },
        { key: "industries           ", value: ": support, service, ops teams" },
        { key: "delivery             ", value: ": working systems over slide decks" },
        { key: "focus                ", value: ": support, workflows, analytics" },
        { status: "status: available for new client work" }
    ];

    stats.forEach((stat, index) => {
        const line = document.createElement("div");
        line.className = "stat-line";

        if (stat.status) {
            line.className += " stat-status";
            line.textContent = stat.status;
        } else {
            const key = document.createElement("span");
            key.className = "stat-key";
            key.textContent = stat.key;

            const value = document.createElement("span");
            value.className = "stat-value";
            value.textContent = stat.value;

            line.appendChild(key);
            line.appendChild(value);
        }

        container.appendChild(line);
        window.setTimeout(() => line.classList.add("visible"), 450 + index * 170);
    });
}

function setActiveTab() {
    const path = window.location.pathname.replace(/^\//, "");
    const page = path || "index.html";
    const currentRoute = page.replace(/(?:index)?\.html$/, "").replace(/\/$/, "") || "index";

    document.querySelectorAll(".status-bar__tab").forEach((tab) => {
        tab.classList.remove("active");
        const link = tab.querySelector("a");
        if (!link) {
            return;
        }

        const href = link.getAttribute("href");
        if (!href) {
            return;
        }

        const normalizedHref = href.replace(/^(\.\/|\.\.\/)+/, "");
        const normalizedRoute = normalizedHref.replace(/(?:index)?\.html$/, "").replace(/\/$/, "") || "index";
        const serviceDetail = page.startsWith("services/");
        if (normalizedRoute === currentRoute) {
            tab.classList.add("active");
        } else if (serviceDetail && normalizedHref === "services.html") {
            tab.classList.add("active");
        }
    });
}

function initBlog() {
    const list = document.querySelector(".blog-list");
    const reader = document.querySelector(".blog-reader");
    const readerContent = document.querySelector(".blog-reader__content");
    const readerLabel = document.querySelector(".blog-reader__label");
    const closeBtn = document.querySelector(".blog-reader__close");
    const entries = document.querySelectorAll(".blog-entry");

    if (!list || !reader || !readerContent || entries.length === 0) {
        return;
    }

    function openPost(entry) {
        entries.forEach((item) => item.classList.remove("active"));
        entry.classList.add("active");

        const postId = entry.dataset.post;
        const template = postId ? document.getElementById(`post-${postId}`) : null;
        if (!template) {
            return;
        }

        readerContent.replaceChildren(template.content.cloneNode(true));
        if (readerLabel) {
            readerLabel.textContent = `~/blog/${postId}.md`;
        }

        list.classList.add("split");
        reader.classList.add("open");
        window.location.hash = `post-${postId}`;
    }

    entries.forEach((entry) => {
        entry.addEventListener("click", () => openPost(entry));
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            reader.classList.remove("open");
            list.classList.remove("split");
            entries.forEach((item) => item.classList.remove("active"));
            history.replaceState(null, "", window.location.pathname);
        });
    }

    const hash = window.location.hash.replace(/^#/, "");
    if (hash.startsWith("post-")) {
        const entry = document.querySelector(`.blog-entry[data-post="${hash.replace(/^post-/, "")}"]`);
        if (entry) {
            openPost(entry);
        }
    }
}

function initClock() {
    const el = document.getElementById("tmux-clock");
    if (!el) {
        return;
    }

    function update() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mon = months[now.getMonth()];
        const yr = String(now.getFullYear()).slice(-2);
        el.textContent = `"* BaobabCat" ${h}:${m} ${day}-${mon}-${yr}`;
    }

    update();
    window.setInterval(update, 10000);
}

function initContinue() {
    const button = document.querySelector("[data-continue]");
    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        const target = document.querySelector(button.getAttribute("data-continue"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
}

function initSuccessState() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("submitted") !== "true") {
        return;
    }

    const banner = document.getElementById("form-success");
    if (banner) {
        banner.classList.add("is-visible");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setActiveTab();
    initClock();
    initContinue();
    initSuccessState();

    if (document.body.classList.contains("page-home")) {
        animateHero();
        animateStats();
    }

    if (document.body.classList.contains("page-blog")) {
        initBlog();
    }
});
