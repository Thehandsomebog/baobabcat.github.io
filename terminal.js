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
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    const tabs = document.querySelectorAll('.status-bar__tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        const link = tab.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            if (href === page || (page === '' && href === 'index.html')) {
                tab.classList.add('active');
            }
        }
    });
}

/**
 * Initialize on DOM ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    setActiveTab();

    // Home page animations
    if (document.body.classList.contains('page-home')) {
        animateHero();
        animateStats();
    }
});
