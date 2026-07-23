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

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        window.setTimeout(() => line.classList.add("visible"), reduceMotion ? 0 : 160 + index * 90);
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
    const search = document.getElementById("blog-search");
    const filters = document.querySelectorAll("[data-blog-filter]");
    const loadMore = document.querySelector(".blog-load-more");
    const emptyState = document.querySelector(".blog-empty");
    const resultCount = document.getElementById("blog-result-count");
    const entries = [...document.querySelectorAll(".blog-entry")];
    const pageSize = 12;
    let activeCategory = "all";
    let visibleLimit = pageSize;
    let lastTrigger = null;

    if (!list || !reader || !readerContent || entries.length === 0) {
        return;
    }

    function updateArchive() {
        const query = search ? search.value.trim().toLowerCase() : "";
        const matches = entries.filter((entry) => {
            const matchesCategory = activeCategory === "all" || entry.dataset.category === activeCategory;
            const matchesQuery = !query || entry.textContent.toLowerCase().includes(query);
            return matchesCategory && matchesQuery;
        });

        entries.forEach((entry) => {
            const matchIndex = matches.indexOf(entry);
            entry.hidden = matchIndex === -1 || matchIndex >= visibleLimit;
        });

        const shown = Math.min(matches.length, visibleLimit);
        if (resultCount) {
            resultCount.textContent = `${shown} of ${matches.length} articles`;
        }
        if (emptyState) {
            emptyState.hidden = matches.length !== 0;
        }
        if (loadMore) {
            loadMore.hidden = matches.length <= visibleLimit;
        }
    }

    function openPost(entry) {
        entries.forEach((item) => item.classList.remove("active"));
        entry.classList.add("active");
        lastTrigger = entry;

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
        reader.setAttribute("aria-hidden", "false");
        reader.removeAttribute("inert");
        window.location.hash = `post-${postId}`;

        if (window.matchMedia("(max-width: 767px)").matches) {
            reader.focus({ preventScroll: true });
        }
    }

    entries.forEach((entry) => {
        entry.addEventListener("click", () => openPost(entry));
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            reader.classList.remove("open");
            reader.setAttribute("aria-hidden", "true");
            reader.setAttribute("inert", "");
            list.classList.remove("split");
            entries.forEach((item) => item.classList.remove("active"));
            history.replaceState(null, "", window.location.pathname);
            if (lastTrigger && !lastTrigger.hidden) {
                lastTrigger.focus();
            } else if (search) {
                search.focus();
            }
        });
    }

    if (search) {
        search.addEventListener("input", () => {
            visibleLimit = pageSize;
            updateArchive();
        });
    }

    filters.forEach((filter) => {
        filter.addEventListener("click", () => {
            activeCategory = filter.dataset.blogFilter;
            visibleLimit = pageSize;
            filters.forEach((item) => {
                const selected = item === filter;
                item.classList.toggle("active", selected);
                item.setAttribute("aria-pressed", String(selected));
            });
            updateArchive();
        });
    });

    if (loadMore) {
        loadMore.addEventListener("click", () => {
            visibleLimit += pageSize;
            updateArchive();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && reader.classList.contains("open") && closeBtn) {
            closeBtn.click();
        }
    });

    updateArchive();

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
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
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
        animateStats();
    }

    if (document.body.classList.contains("page-blog")) {
        initBlog();
    }
});
