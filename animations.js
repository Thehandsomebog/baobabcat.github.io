/* ========================================
   BaobabCat - Animations & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // Check for Form Submission Success
    // ========================================
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
        const successMessage = document.querySelector('.form-success');
        const form = document.querySelector('.contact-form');
        if (successMessage && form) {
            successMessage.style.display = 'flex';
            form.reset();
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                setTimeout(() => {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // ========================================
    // Theme Toggle (Dark/Light Mode)
    // ========================================
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved theme or use system preference
    function getTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return prefersDark.matches ? 'dark' : 'dark'; // Default to dark
    }

    // Apply theme
    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }

    // Initialize theme
    setTheme(getTheme());

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================

    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // ========================================
    // Mobile Navigation Toggle
    // ========================================

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Navbar Background on Scroll
    // ========================================

    const navbar = document.querySelector('.navbar');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.borderBottomColor = 'rgba(42, 42, 58, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.borderBottomColor = 'rgba(31, 31, 46, 1)';
        }
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // ========================================
    // Form Enhancement with Real-time Validation
    // ========================================

    const form = document.querySelector('.contact-form');

    if (form) {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Phone validation regex (accepts common formats)
        const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;

        // Helper to show field error
        function showFieldError(field, message) {
            field.style.borderColor = '#ef4444';
            let errorEl = field.parentElement.querySelector('.field-error');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'field-error';
                errorEl.style.cssText = 'color: #ef4444; font-size: 0.8rem; margin-top: 4px; display: block;';
                field.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = message;
        }

        // Helper to clear field error
        function clearFieldError(field) {
            field.style.borderColor = '';
            const errorEl = field.parentElement.querySelector('.field-error');
            if (errorEl) errorEl.remove();
        }

        // Validate individual field
        function validateField(field) {
            const value = field.value.trim();

            if (field.type === 'checkbox') {
                if (field.required && !field.checked) {
                    field.parentElement.style.color = '#ef4444';
                    return false;
                }
                field.parentElement.style.color = '';
                return true;
            }

            if (field.required && !value) {
                showFieldError(field, 'This field is required');
                return false;
            }

            if (field.type === 'email' && value && !emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }

            if (field.type === 'tel' && value && !phoneRegex.test(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }

            clearFieldError(field);
            return true;
        }

        // Real-time validation on blur
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                // Clear error on input, but only if field was previously invalid
                if (this.style.borderColor === 'rgb(239, 68, 68)') {
                    clearFieldError(this);
                }
            });
        });

        // Checkbox validation
        const checkbox = form.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                validateField(this);
            });
        }

        form.addEventListener('submit', function(e) {
            // Validate all fields before submission
            const allFields = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            allFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
                // Focus first invalid field
                const firstInvalid = form.querySelector('[style*="border-color: rgb(239, 68, 68)"]');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Show sending state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Form will submit naturally to Web3Forms
        });
    }

    // ========================================
    // Add stagger delay to grid items
    // ========================================

    const gridContainers = document.querySelectorAll('.services-grid, .testimonials-grid, .about-stats');

    gridContainers.forEach(container => {
        const items = container.querySelectorAll('.animate-on-scroll');
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });

});
