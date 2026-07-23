(() => {
    const measurementId = "G-CH13JG6L1S";
    const storageKey = "baobabcat_analytics_consent";
    const allowedParameters = {
        cta_click: ["cta_id", "page", "destination_category"],
        contact_form_start: ["page"],
        generate_lead: ["page", "method"],
        contact_form_error: ["page", "error_type"],
        service_select: ["service_slug", "source_page"],
        blog_filter: ["filter", "result_count"],
        blog_search: ["query_length_bucket", "result_count"],
        blog_load_more: ["visible_count"],
        blog_article_open: ["article_slug", "source"],
    };
    let consent;
    let loaded = false;

    try {
        consent = localStorage.getItem(storageKey);
    } catch {
        consent = null;
    }

    function gtag() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(arguments);
    }

    function load() {
        if (loaded || consent !== "granted") return;
        loaded = true;
        window.dataLayer = window.dataLayer || [];
        gtag("consent", "default", { analytics_storage: "denied" });
        gtag("consent", "update", { analytics_storage: "granted" });
        gtag("js", new Date());
        gtag("config", measurementId, { anonymize_ip: true });
        const script = document.createElement("script");
        script.id = "baobabcat-ga4";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
    }

    function track(eventName, parameters = {}) {
        if (consent !== "granted" || !allowedParameters[eventName]) return;
        const safeParameters = {};
        allowedParameters[eventName].forEach((key) => {
            if (typeof parameters[key] === "string" || typeof parameters[key] === "number") {
                safeParameters[key] = parameters[key];
            }
        });
        gtag("event", eventName, safeParameters);
    }

    function updateConsent(nextConsent) {
        consent = nextConsent;
        try {
            localStorage.setItem(storageKey, nextConsent);
        } catch {
            // The choice still applies for this page when browser storage is unavailable.
        }
        if (nextConsent === "granted") {
            load();
        } else if (loaded) {
            gtag("consent", "update", { analytics_storage: "denied" });
        }
        document.dispatchEvent(new CustomEvent("baobabcat:consent-change", { detail: nextConsent }));
    }

    window.BaobabAnalytics = {
        track,
        getConsent: () => consent,
        setConsent: updateConsent,
        showPreferences: () => document.dispatchEvent(new CustomEvent("baobabcat:show-consent")),
    };

    if (consent === "granted") load();
})();

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
    });

    requestAnimationFrame(() => {
        container.querySelectorAll(".stat-line").forEach((line) => line.classList.add("visible"));
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
        const articleDetail = page.startsWith("blog/");
        if (normalizedRoute === currentRoute) {
            tab.classList.add("active");
        } else if (serviceDetail && normalizedHref === "services.html") {
            tab.classList.add("active");
        } else if (articleDetail && normalizedHref === "blog.html") {
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

    let readerHistoryActive = false;

    function closePost({ restoreHistory = false } = {}) {
        reader.classList.remove("open");
        reader.setAttribute("aria-hidden", "true");
        reader.setAttribute("inert", "");
        list.classList.remove("split");
        entries.forEach((item) => item.classList.remove("active"));
        if (restoreHistory && readerHistoryActive) {
            history.back();
        } else if (!restoreHistory) {
            readerHistoryActive = false;
        }
        if (lastTrigger && !lastTrigger.hidden) {
            lastTrigger.focus();
        } else if (search) {
            search.focus();
        }
    }

    function openPost(entry, { updateHistory = true } = {}) {
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
        if (updateHistory) {
            const historyMethod = readerHistoryActive ? "replaceState" : "pushState";
            history[historyMethod]({ blogReader: true, postId }, "", entry.href);
            readerHistoryActive = true;
        }
        window.BaobabAnalytics?.track("blog_article_open", { article_slug: postId, source: "archive_reader" });

        if (window.matchMedia("(max-width: 767px)").matches) {
            reader.focus({ preventScroll: true });
        }
    }

    entries.forEach((entry) => {
        entry.addEventListener("click", (event) => {
            const desktopReader = window.matchMedia("(min-width: 1024px)").matches;
            const primaryUnmodified = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
            if (!desktopReader || !primaryUnmodified) return;
            event.preventDefault();
            openPost(entry);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            closePost({ restoreHistory: true });
        });
    }

    if (search) {
        search.addEventListener("input", () => {
            visibleLimit = pageSize;
            updateArchive();
            window.BaobabAnalytics?.track("blog_filter", {
                filter: activeCategory,
                result_count: entries.filter((entry) => !entry.hidden).length,
            });
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
            window.BaobabAnalytics?.track("blog_load_more", {
                visible_count: entries.filter((entry) => !entry.hidden).length,
            });
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
        const slug = hash.replace(/^post-/, "");
        const entry = document.querySelector(`.blog-entry[data-post="${slug}"]`);
        if (entry) {
            window.location.replace(entry.href);
        }
    }

    let searchTimer;
    search?.addEventListener("input", () => {
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(() => {
            const length = search.value.trim().length;
            const bucket = length === 0 ? "0" : length <= 3 ? "1-3" : length <= 8 ? "4-8" : "9+";
            window.BaobabAnalytics?.track("blog_search", {
                query_length_bucket: bucket,
                result_count: entries.filter((entry) => !entry.hidden).length,
            });
        }, 500);
    });

    window.addEventListener("popstate", () => {
        if (reader.classList.contains("open")) closePost();
    });
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
        banner.focus({ preventScroll: true });
    }
    history.replaceState(null, "", window.location.pathname);
}

function initConsentUi() {
    const analytics = window.BaobabAnalytics;
    if (!analytics) return;
    const banner = document.createElement("section");
    banner.className = "consent-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Analytics preference");
    banner.innerHTML = `<p><strong>Optional analytics</strong><br>Allow privacy-conscious interaction measurement to help improve this site.</p>
        <div><button type="button" class="btn-terminal btn-terminal--primary" data-consent="granted">[Allow]</button>
        <button type="button" class="btn-terminal" data-consent="denied">[Decline]</button>
        <a href="/privacy.html">Privacy details</a></div>`;
    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "consent-launcher";
    launcher.textContent = "Privacy choices";
    launcher.setAttribute("aria-label", "Change analytics privacy choice");
    document.body.append(banner, launcher);

    function sync() {
        const undecided = !analytics.getConsent();
        banner.classList.toggle("is-visible", undecided);
        launcher.hidden = undecided;
        if (undecided) banner.querySelector("button")?.focus({ preventScroll: true });
    }

    banner.addEventListener("click", (event) => {
        const button = event.target.closest("[data-consent]");
        if (!button) return;
        analytics.setConsent(button.dataset.consent);
        sync();
        launcher.focus({ preventScroll: true });
    });
    launcher.addEventListener("click", () => {
        banner.classList.add("is-visible");
        banner.querySelector("button")?.focus({ preventScroll: true });
    });
    document.querySelectorAll("[data-analytics-settings]").forEach((button) => {
        button.addEventListener("click", () => launcher.click());
    });
    document.addEventListener("baobabcat:show-consent", () => launcher.click());
    sync();
}

function initAnalyticsEvents() {
    const page = window.location.pathname;
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (!link) return;
        const url = new URL(link.href, window.location.href);
        if (link.classList.contains("btn-terminal") || link.classList.contains("outcome-strip__item")) {
            window.BaobabAnalytics?.track("cta_click", {
                cta_id: link.textContent.trim().slice(0, 80),
                page,
                destination_category: url.pathname.startsWith("/contact") ? "contact" : url.pathname.startsWith("/services") ? "services" : "content",
            });
        }
        const serviceMatch = url.pathname.match(/^\/services\/([^/]+)\.html$/);
        if (serviceMatch) {
            window.BaobabAnalytics?.track("service_select", { service_slug: serviceMatch[1], source_page: page });
        }
    });
    const articleMatch = page.match(/^\/blog\/([^/]+)\/?/);
    if (articleMatch) {
        window.BaobabAnalytics?.track("blog_article_open", { article_slug: articleMatch[1], source: "standalone" });
    }
}

function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    const button = form.querySelector('button[type="submit"]');
    const label = form.querySelector("[data-submit-label]");
    const status = document.getElementById("form-status");
    const banner = document.getElementById("form-success");
    let submitting = false;
    let started = false;

    function fieldError(field) {
        const error = document.getElementById(`${field.id}-error`);
        if (!error) return;
        const message = field.validity.valueMissing
            ? "This field is required."
            : field.validity.typeMismatch
                ? "Enter a valid email address."
                : "";
        error.textContent = message;
        field.setAttribute("aria-invalid", String(Boolean(message)));
    }

    form.querySelectorAll("input, textarea").forEach((field) => {
        field.addEventListener("blur", () => fieldError(field));
        field.addEventListener("input", () => {
            if (!started) {
                started = true;
                window.BaobabAnalytics?.track("contact_form_start", { page: window.location.pathname });
            }
            if (field.getAttribute("aria-invalid") === "true") fieldError(field);
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (submitting) return;
        const invalid = [...form.querySelectorAll("input, textarea")].filter((field) => !field.checkValidity());
        form.querySelectorAll("input, textarea").forEach(fieldError);
        if (invalid.length) {
            status.textContent = "Check the highlighted fields and try again.";
            invalid[0].focus();
            window.BaobabAnalytics?.track("contact_form_error", { page: window.location.pathname, error_type: "validation" });
            return;
        }
        if (!navigator.onLine) {
            status.textContent = "You appear to be offline. Your message is still here; reconnect and try again.";
            window.BaobabAnalytics?.track("contact_form_error", { page: window.location.pathname, error_type: "offline" });
            return;
        }

        submitting = true;
        button.disabled = true;
        form.setAttribute("aria-busy", "true");
        label.textContent = "[Sending…]";
        status.textContent = "Sending your message…";
        banner?.classList.remove("is-visible");
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 12000);

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" },
                signal: controller.signal,
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || result.success !== true) throw new Error("provider");
            form.reset();
            form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
            form.querySelectorAll(".form-error").forEach((error) => { error.textContent = ""; });
            status.textContent = "";
            banner?.classList.add("is-visible");
            banner?.focus({ preventScroll: true });
            window.BaobabAnalytics?.track("generate_lead", { page: window.location.pathname, method: "web3forms" });
        } catch (error) {
            const errorType = error.name === "AbortError" ? "timeout" : error.message === "provider" ? "provider" : "network";
            status.textContent = errorType === "timeout"
                ? "The request timed out. Your message is still here; please try again."
                : "The message could not be sent. Your entries are saved on this page; please try again.";
            window.BaobabAnalytics?.track("contact_form_error", { page: window.location.pathname, error_type: errorType });
        } finally {
            window.clearTimeout(timeout);
            submitting = false;
            button.disabled = false;
            form.removeAttribute("aria-busy");
            label.textContent = "[Send message]";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initConsentUi();
    initAnalyticsEvents();
    setActiveTab();
    initClock();
    initContinue();
    initSuccessState();
    initContactForm();

    if (document.body.classList.contains("page-home")) {
        animateStats();
    }

    if (document.body.classList.contains("page-blog")) {
        initBlog();
    }
});
