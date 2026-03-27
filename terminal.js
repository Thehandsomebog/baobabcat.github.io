// terminal.js — Typing animations and interactions

/**
 * Types text character by character into an element.
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text to type
 * @param {number} speed - ms per character
 * @returns {Promise} resolves when done
 */
function typeText(element, text, speed = 50) {
    return new Promise(resolve => {
        let i = 0;
        function tick() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(tick, speed);
            } else {
                resolve();
            }
        }
        tick();
    });
}

/**
 * Runs the hero typing animation sequence.
 * Line 1: "Deploy AI." in green
 * Line 2: "Stay human." in yellow
 * Then subtitle types out.
 */
async function animateHero() {
    const output = document.getElementById('typed-output');
    const subtitle = document.getElementById('subtitle-text');
    if (!output || !subtitle) return;

    // Create line 1 span
    const line1 = document.createElement('span');
    line1.style.color = 'var(--accent-green)';
    output.appendChild(line1);
    await typeText(line1, 'Deploy AI.', 50);

    // Line break
    output.appendChild(document.createTextNode('\n'));

    // Create line 2 span
    const line2 = document.createElement('span');
    line2.style.color = 'var(--accent-yellow)';
    output.appendChild(line2);
    await typeText(line2, 'Stay human.', 50);

    // Pause, then type subtitle
    await new Promise(r => setTimeout(r, 400));
    await typeText(subtitle, 'AI consulting for businesses ready to grow.', 30);
}

/**
 * Animates the stats pane, revealing lines one by one.
 */
function animateStats() {
    const container = document.getElementById('stats-output');
    if (!container) return;

    const stats = [
        { key: 'models_deployed    ', value: ': 50+' },
        { key: 'hours_saved_weekly ', value: ': 500+' },
        { key: 'client_satisfaction', value: ': 98%' },
        { key: 'efficiency_gain    ', value: ': 10x' },
        { key: '', value: '' },
        { status: 'status: all systems operational ✓' }
    ];

    stats.forEach((stat, i) => {
        const line = document.createElement('div');
        line.className = 'stat-line';

        if (stat.status) {
            line.className += ' stat-status';
            line.textContent = stat.status;
        } else if (stat.key) {
            const keySpan = document.createElement('span');
            keySpan.className = 'stat-key';
            keySpan.textContent = stat.key;
            line.appendChild(keySpan);

            const valSpan = document.createElement('span');
            valSpan.className = 'stat-value';
            valSpan.textContent = stat.value;
            line.appendChild(valSpan);
        }

        container.appendChild(line);

        setTimeout(() => {
            line.classList.add('visible');
        }, 800 + (i * 300));
    });
}

/**
 * Highlights the active status bar tab based on current page filename.
 */
function setActiveTab() {
    const path = window.location.pathname;
    const pageFull = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    // Normalize: strip .html extension for comparison
    const page = pageFull.replace(/\.html$/, '') || 'index';

    const tabs = document.querySelectorAll('.status-bar__tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        const link = tab.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            // Normalize href the same way
            const hrefBase = href ? href.replace(/\.html$/, '') : '';
            if (hrefBase === page || (page === 'index' && hrefBase === 'index')) {
                tab.classList.add('active');
            }
        }
    });
}

/**
 * Blog split-pane reader.
 * Clicking an entry opens the reader pane and shrinks the list.
 */
function initBlog() {
    const list = document.querySelector('.blog-list');
    const reader = document.querySelector('.blog-reader');
    const readerContent = document.querySelector('.blog-reader__content');
    const readerLabel = document.querySelector('.blog-reader__label');
    const closeBtn = document.querySelector('.blog-reader__close');

    if (!list || !reader) return;

    // Entry click handler
    document.querySelectorAll('.blog-entry').forEach(entry => {
        entry.addEventListener('click', () => {
            const postId = entry.dataset.post;
            const template = document.getElementById('post-' + postId);
            if (!template) return;

            // Clear and populate reader using DOM cloning
            while (readerContent.firstChild) {
                readerContent.removeChild(readerContent.firstChild);
            }
            const content = template.content.cloneNode(true);
            readerContent.appendChild(content);

            // Update pane label
            if (readerLabel) {
                readerLabel.textContent = '~/blog/' + postId + '.md';
            }

            // Open split
            list.classList.add('split');
            reader.classList.add('open');
        });
    });

    // Close handler
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            reader.classList.remove('open');
            list.classList.remove('split');
        });
    }
}

/**
 * Updates the tmux-style clock in the status bar.
 * Format: "HH:MM DD-Mon-YY" matching real tmux.
 */
function initClock() {
    const el = document.getElementById('tmux-clock');
    if (!el) return;

    function update() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const mon = months[now.getMonth()];
        const yr = String(now.getFullYear()).slice(-2);
        el.textContent = '"* BaobabCat" ' + h + ':' + m + ' ' + day + '-' + mon + '-' + yr;
    }

    update();
    setInterval(update, 10000);
}

/**
 * Initialize on DOM ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    setActiveTab();
    initClock();

    // Home page animations
    if (document.body.classList.contains('page-home')) {
        animateHero();
        animateStats();
    }

    // Blog page
    if (document.body.classList.contains('page-blog')) {
        initBlog();
    }
});
