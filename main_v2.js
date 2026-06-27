/* ==========================================================================
   Abhishek K's Portfolio Javascript - Interactivity & Premium Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursorGlow();
    initNavbar();
    initTypewriter();
    initParticles();
    initScrollReveal();
    initCounters();
    initContactForm();
    initThemeToggle();
    initScrollProgress();
    initCustomCursor();
    initFeaturedCarousel();
    initProjectModal();
    initLiveDemoHandlers();
    initVisitorCounter();
});

/* --------------------------------------------------------------------------
   1. Quantum Interface Loader
   -------------------------------------------------------------------------- */
function initLoader() {
    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('.loader-progress');

    // Simulate loading completion
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('fade-out');
                // Allow interactions after loader vanishes
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 300);
        } else {
            width += Math.floor(Math.random() * 15) + 5;
            if (width > 100) width = 100;
            progressBar.style.width = width + '%';
        }
    }, 80);

    // Backup if loading takes too long
    window.addEventListener('load', () => {
        clearInterval(interval);
        progressBar.style.width = '100%';
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 200);
    });
}

/* --------------------------------------------------------------------------
   2. Interactive Cursor Glow
   -------------------------------------------------------------------------- */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');

    window.addEventListener('mousemove', (e) => {
        // Track coordinate adjustments
        cursorGlow.style.setProperty('--mouse-x', `${e.clientX}px`);
        cursorGlow.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
}

/* --------------------------------------------------------------------------
   3. Sticky Navbar & Mobile Navigation Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    // Scroll Triggers
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky Header Shadow
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back To Top Visibility
        if (scrollY > 600) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active Link Highlight
        highlightActiveLink();
    });

    // Back to top button action
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile Hamburger Toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Close Menu on Overlay Click (for mobile viewports)
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuToggle.contains(e.target) && navbar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Helper highlight function
    function highlightActiveLink() {
        let fromTop = window.scrollY + 120;

        navLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (!section) return;

            if (
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }
}

function closeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    if (menuToggle && navbar) {
        menuToggle.classList.remove('active');
        navbar.classList.remove('active');
    }
}

/* --------------------------------------------------------------------------
   4. Typed Headline Text Loops
   -------------------------------------------------------------------------- */
function initTypewriter() {
    const textElement = document.getElementById('typed-text');
    const words = [
        "BCA AI & ML Student",
        "Web Developer",
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            charIndex--;
            typeSpeed = 40; // delete faster
        } else {
            charIndex++;
            typeSpeed = 100; // standard typing speed
        }

        textElement.textContent = currentWord.substring(0, charIndex);

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // pause before typing next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start Typewriter
    setTimeout(type, 1000);
}

/* --------------------------------------------------------------------------
   5. Interactive HTML5 Canvas Particles Background
   -------------------------------------------------------------------------- */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Keep dimensions responsive
    window.addEventListener('resize', () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        init();
    });

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Check boundary collisions
            if (this.x > width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Interactive mouse repeller logic
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = dx / distance;
                    let directionY = dy / distance;

                    // Repel particles from mouse coordinates
                    this.x -= directionX * force * 3;
                    this.y -= directionY * force * 3;
                }
            }

            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (width * height) / 9000;
        if (numberOfParticles > 120) numberOfParticles = 120;
        if (numberOfParticles < 30) numberOfParticles = 30;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.5;
            let x = Math.random() * (width - size * 2) + size;
            let y = Math.random() * (height - size * 2) + size;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;

            // Random styling accents
            let r = Math.random();
            let color = 'rgba(0, 242, 254, 0.2)'; // Cyan
            if (r > 0.6) color = 'rgba(168, 85, 247, 0.2)'; // Purple
            else if (r > 0.3) color = 'rgba(59, 130, 246, 0.2)'; // Blue

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect node links
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    opacityValue = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacityValue * 0.08})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    init();
    animate();
}

/* --------------------------------------------------------------------------
   6. Custom Scroll Reveal Animation Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // If it's the skills section, animate skill meters
                if (entry.target.id === 'skills') {
                    animateSkills();
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Helper functions for skill meter load
    function animateSkills() {
        const progressFills = document.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 100);
        });
    }
}

/* --------------------------------------------------------------------------
   7. Stats Numerical Counters
   -------------------------------------------------------------------------- */
function initCounters() {
    const counterElements = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const limit = parseInt(target.getAttribute('data-target'), 10);
                let current = 0;
                const duration = 1200; // Total count up milliseconds
                const frameRate = 1000 / 60; // 60 FPS (approx 16ms)
                const totalFrames = Math.round(duration / frameRate);
                const step = Math.max(Math.ceil(limit / totalFrames), 1);

                const timer = setInterval(() => {
                    current += step;
                    if (current >= limit) {
                        target.textContent = limit.toLocaleString();
                        clearInterval(timer);
                    } else {
                        target.textContent = current.toLocaleString();
                    }
                }, frameRate);

                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });

    counterElements.forEach(el => {
        observer.observe(el);
    });
}

/* --------------------------------------------------------------------------
   8. Contact Form Client-side Processing
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const sendIcon = submitBtn.querySelector('.send-icon');

        // Transmit state visualization
        submitBtn.disabled = true;
        btnText.textContent = "TRANSMITTING...";
        sendIcon.className = "fa-solid fa-spinner fa-spin";

        // Read form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Submit asynchronously to Formspree
        const formspreeUrl = form.getAttribute('action') || 'https://formspree.io/f/xvgowoze';

        fetch(formspreeUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    // Success state
                    submitBtn.disabled = false;
                    btnText.textContent = "TRANSMIT MESSAGE";
                    sendIcon.className = "fa-solid fa-paper-plane send-icon";
                    feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Message transmitted successfully! Abhishek will contact you shortly.</span>';
                    feedback.className = "form-feedback-message show success";
                    form.reset();
                } else {
                    return response.json().then(jsonErr => {
                        throw new Error(jsonErr.error || 'Transmission failed');
                    });
                }
            })
            .catch(error => {
                // Error state
                submitBtn.disabled = false;
                btnText.textContent = "TRANSMIT MESSAGE";
                sendIcon.className = "fa-solid fa-paper-plane send-icon";
                feedback.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color: #ff3e3e;"></i> <span>Error: ${error.message || 'Cannot reach server'}. Please try again later.</span>`;
                feedback.className = "form-feedback-message show error";
            })
            .finally(() => {
                // Clear feedback after 6 seconds
                setTimeout(() => {
                    feedback.classList.remove('show');
                }, 6000);
            });
    });
}

/* --------------------------------------------------------------------------
   9. Premium Theme Toggle Switch
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Check saved choice or system default
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.documentElement.classList.add('light-mode');
        document.body.classList.add('light-mode');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.documentElement.classList.remove('light-mode');
        document.body.classList.remove('light-mode');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-mode');
        document.body.classList.toggle('light-mode');
        const isLight = document.documentElement.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
}

/* --------------------------------------------------------------------------
   10. Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
    const progress = document.getElementById('scroll-progress');
    if (!progress) return;

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const scrollPercent = (window.scrollY / docHeight) * 100;
            progress.style.width = scrollPercent + '%';
        }
    });
}

/* --------------------------------------------------------------------------
   11. Custom Glowing Cursor & Magnetic Buttons
   -------------------------------------------------------------------------- */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('custom-cursor-dot');
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // Smooth delay follow for outline ring
    function followMouse() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(followMouse);
    }
    followMouse();

    // Scale on link hovers
    const interactives = document.querySelectorAll('a, button, .project-card, .repo-card, .project-card-img-trigger');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Magnetic Effect on major buttons
    const magnetics = document.querySelectorAll('.btn, .btn-resume-nav, .theme-toggle-btn');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

/* --------------------------------------------------------------------------
   12. Featured Project Carousel
   -------------------------------------------------------------------------- */
const featuredProjectsData = [
    {
        title: "RentalCarAI Website",
        desc: "A production-ready, full-stack vehicle rental platform engineered to streamline the booking lifecycle. Features a responsive modern frontend client communicating with a highly secure Spring Boot API backend, supported by a structured MySQL relational database.",
        features: [
            "<strong>User Authentication:</strong> Secure password encryption and session control.",
            "<strong>Fleet Filters:</strong> Filter dynamic rental records by brand, fuel type, and price.",
            "<strong>Real-time Search:</strong> High-speed string matching across fields.",
            "<strong>My Bookings:</strong> Personal client dashboard showing booking status and history."
        ],
        tech: [
            { name: "HTML5", icon: "fa-brands fa-html5 text-orange-500" },
            { name: "CSS3", icon: "fa-brands fa-css3-alt text-blue-500" },
            { name: "JavaScript", icon: "fa-brands fa-js text-yellow-500" },
            { name: "Spring Boot", icon: "fa-solid fa-leaf text-green-500" },
            { name: "MySQL", icon: "fa-solid fa-database text-cyan" }
        ],
        github: "https://github.com/Abhi6282shek/RentalCarAI",
        demo: "https://symphonious-buttercream-02a2db.netlify.app",
        stats: [
            { isVal: true, val: "6", label: "Cars Available", sublabel: "" },
            { isVal: false, val: "", label: "Authentication System", sublabel: "Security Config" },
            { isVal: false, val: "", label: "Booking Management", sublabel: "Dynamic Workflow" },
            { isVal: false, val: "", label: "Responsive Design", sublabel: "Mobile Optimized" },
            { isVal: false, val: "", label: "Spring Boot Backend", sublabel: "RESTful Services" },
            { isVal: false, val: "", label: "MySQL Database", sublabel: "Relational Integrity" }
        ],
        statsIcons: [
            "fa-solid fa-car text-cyan",
            "fa-solid fa-lock text-purple",
            "fa-solid fa-calendar-check text-blue",
            "fa-solid fa-mobile-screen-button text-cyan",
            "fa-solid fa-leaf text-green-500",
            "fa-solid fa-server text-purple"
        ]
    },
    {
        title: "Medical Store Billing System",
        desc: "A full-stack web application designed to automate medical store billing, manage medicine inventory, compute taxes, track sales, and generate digital invoices. Engineered with an ASP.NET Core backend and a responsive frontend client.",
        features: [
            "<strong>Billing Dashboard:</strong> Dynamic checkout with real-time tax/discount computation and digital invoices.",
            "<strong>Inventory Management:</strong> Track medicine stocks, expiration dates, and low-quantity alerts.",
            "<strong>Sales Reports:</strong> Interactive visual insights on daily revenues, cashier transactions, and client histories.",
            "<strong>Role-Based Access:</strong> Custom role authentication separating Cashiers and Administrators."
        ],
        tech: [
            { name: "ASP.NET Core", icon: "fa-solid fa-server text-purple" },
            { name: "MySQL", icon: "fa-solid fa-database text-cyan" },
            { name: "HTML5 & CSS3", icon: "fa-brands fa-html5 text-orange-500" },
            { name: "JavaScript", icon: "fa-brands fa-js text-yellow-500" }
        ],
        github: "https://github.com/Abhi6282shek/MedicalStoreBillingSystem",
        demo: "#",
        stats: [
            { isVal: true, val: "99.9", label: "API Uptime", sublabel: "" },
            { isVal: false, val: "", label: "Dynamic Invoicing", sublabel: "Real-time Computations" },
            { isVal: false, val: "", label: "Low-Stock Alerts", sublabel: "Visual Status Indicators" },
            { isVal: false, val: "", label: "Role Authorization", sublabel: "Cashier & Admin Access" },
            { isVal: false, val: "", label: "C# ASP.NET Core", sublabel: "RESTful Web APIs" },
            { isVal: false, val: "", label: "MySQL Relational DB", sublabel: "Transactional Integrity" }
        ],
        statsIcons: [
            "fa-solid fa-circle-check text-green-500",
            "fa-solid fa-file-invoice-dollar text-green-500",
            "fa-solid fa-triangle-exclamation text-yellow-500",
            "fa-solid fa-user-shield text-blue-500",
            "fa-solid fa-gears text-orange-500",
            "fa-solid fa-database text-cyan"
        ]
    },
    {
        title: "Movie Booking Android App",
        desc: "A Kotlin & Java-based mobile application supporting cinema reservations, dynamic seat mappings, local offline caching with RoomDB, and real-time database updates via Firebase.",
        features: [
            "<strong>Interactive Seats:</strong> Interactive seat selection grids with occupancy state listeners.",
            "<strong>Real-time Backend:</strong> Firebase Auth logins and real-time database updates.",
            "<strong>Local Cache:</strong> Local caching layer for offline mode using Room database.",
            "<strong>Cloud Messages:</strong> System notification confirmations for ticket booking."
        ],
        tech: [
            { name: "Java", icon: "fa-brands fa-java text-red-500" },
            { name: "Kotlin", icon: "fa-brands fa-android text-green-500" },
            { name: "Android SDK", icon: "fa-solid fa-mobile-screen-button text-blue-500" },
            { name: "Firebase", icon: "fa-solid fa-fire text-orange-500" },
            { name: "RoomDB", icon: "fa-solid fa-hard-drive text-cyan" }
        ],
        github: "https://github.com/Abhi6282shek/MovieBookingApp",
        demo: "#",
        stats: [
            { isVal: true, val: "200", label: "Synced seat select", sublabel: "" },
            { isVal: false, val: "", label: "Firebase Integration", sublabel: "Real-time updates" },
            { isVal: false, val: "", label: "Jetpack Compose UI", sublabel: "Native Layouts" },
            { isVal: false, val: "", label: "Offline Cache Sync", sublabel: "Room Database" },
            { isVal: false, val: "", label: "Cloud Notification", sublabel: "Firebase Messaging" },
            { isVal: false, val: "", label: "Coroutines Async", sublabel: "Responsive threads" }
        ],
        statsIcons: [
            "fa-solid fa-bolt text-yellow-500",
            "fa-solid fa-fire text-orange-500",
            "fa-solid fa-mobile-screen-button text-cyan",
            "fa-solid fa-hard-drive text-blue-500",
            "fa-solid fa-bell text-purple",
            "fa-solid fa-code text-green-500"
        ]
    }
];

function initFeaturedCarousel() {
    const track = document.getElementById('featured-carousel-track');
    const prevBtn = document.getElementById('featured-prev');
    const nextBtn = document.getElementById('featured-next');
    const dotsContainer = document.getElementById('featured-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = Array.from(track.children);
    const dots = Array.from(dotsContainer.children);
    let activeIndex = 0;

    const featuredTitle = document.getElementById('featured-title');
    const featuredDesc = document.getElementById('featured-desc');
    const featuredFeaturesList = document.getElementById('featured-features-list');
    const featuredTechBadges = document.getElementById('featured-tech-badges');
    const featuredGithubLink = document.getElementById('featured-github-link');
    const featuredDemoLink = document.getElementById('featured-demo-link');
    const featuredStatsGrid = document.getElementById('featured-stats-grid');
    const detailsContainer = document.querySelector('.featured-project-details');

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateProjectDetails(index) {
        const data = featuredProjectsData[index];
        if (!data) return;

        // Fade out details and stats
        if (detailsContainer) {
            detailsContainer.style.opacity = '0';
            detailsContainer.style.transform = 'translateY(10px)';
        }
        if (featuredStatsGrid) {
            featuredStatsGrid.style.opacity = '0';
            featuredStatsGrid.style.transform = 'translateY(10px)';
        }

        setTimeout(() => {
            // Update Text Details
            if (featuredTitle) featuredTitle.textContent = data.title;
            if (featuredDesc) featuredDesc.textContent = data.desc;

            // Update Features List
            if (featuredFeaturesList) {
                featuredFeaturesList.innerHTML = '';
                data.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fa-solid fa-circle-check text-cyan"></i> ${feature}`;
                    featuredFeaturesList.appendChild(li);
                });
            }

            // Update Tech Badges
            if (featuredTechBadges) {
                featuredTechBadges.innerHTML = '';
                data.tech.forEach(t => {
                    const span = document.createElement('span');
                    span.className = 'badge';
                    span.innerHTML = `<i class="${t.icon}"></i> ${t.name}`;
                    featuredTechBadges.appendChild(span);
                });
            }

            // Update Links
            if (featuredGithubLink) featuredGithubLink.href = data.github;
            if (featuredDemoLink) featuredDemoLink.href = data.demo;

            // Update Stats Grid
            if (featuredStatsGrid) {
                featuredStatsGrid.innerHTML = '';
                data.stats.forEach((stat, i) => {
                    const card = document.createElement('div');
                    card.className = 'featured-stat-card glass-card';
                    
                    const iconClass = data.statsIcons[i] || 'fa-solid fa-gear';
                    
                    let metaHTML = '';
                    if (stat.isVal) {
                        const plusText = index === 1 ? '%' : (index === 2 ? ' ms' : '+'); // custom plus/unit suffix
                        metaHTML = `
                            <div class="stat-meta">
                                <span class="stat-val" data-target="${stat.val}">0</span><span class="plus-sign">${plusText}</span>
                                <span class="stat-lbl">${stat.label}</span>
                            </div>
                        `;
                    } else {
                        metaHTML = `
                            <div class="stat-meta">
                                <span class="stat-lbl">${stat.label}</span>
                                <span class="stat-sublbl">${stat.sublabel}</span>
                            </div>
                        `;
                    }
                    
                    card.innerHTML = `
                        <i class="${iconClass}"></i>
                        ${metaHTML}
                    `;
                    featuredStatsGrid.appendChild(card);
                });
            }

            // Fade in details and stats
            if (detailsContainer) {
                detailsContainer.style.opacity = '1';
                detailsContainer.style.transform = 'translateY(0)';
            }
            if (featuredStatsGrid) {
                featuredStatsGrid.style.opacity = '1';
                featuredStatsGrid.style.transform = 'translateY(0)';
            }

            // Trigger numerical count animation on new elements
            setTimeout(() => {
                const statValElements = document.querySelectorAll('#featured-stats-grid .stat-val');
                statValElements.forEach(el => {
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    if (!isNaN(target)) {
                        animateValue(el, 0, target, 1000);
                    }
                });
            }, 100);

        }, 350);
    }

    function updateSlides(targetIndex) {
        slides[activeIndex].classList.remove('active');
        dots[activeIndex].classList.remove('active');

        slides[targetIndex].classList.add('active');
        dots[targetIndex].classList.add('active');
        activeIndex = targetIndex;

        updateProjectDetails(targetIndex);
    }

    prevBtn.addEventListener('click', () => {
        let index = activeIndex - 1;
        if (index < 0) index = slides.length - 1;
        updateSlides(index);
    });

    nextBtn.addEventListener('click', () => {
        let index = (activeIndex + 1) % slides.length;
        updateSlides(index);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlides(index);
        });
    });

    // Auto cycle every 6s
    let autoPlay = setInterval(() => {
        let index = (activeIndex + 1) % slides.length;
        updateSlides(index);
    }, 6000);

    // Reset autoplay timer on manual click
    const resetAutoplay = () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => {
            let index = (activeIndex + 1) % slides.length;
            updateSlides(index);
        }, 6000);
    };

    prevBtn.addEventListener('click', resetAutoplay);
    nextBtn.addEventListener('click', resetAutoplay);
    dots.forEach(dot => dot.addEventListener('click', resetAutoplay));

    // Trigger initial numbers count up on page load
    setTimeout(() => {
        const statValElements = document.querySelectorAll('#featured-stats-grid .stat-val');
        statValElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (!isNaN(target)) {
                animateValue(el, 0, target, 1200);
            }
        });
    }, 500);
}

/* --------------------------------------------------------------------------
   13. Dynamic Project Case Study Modal & Lightbox
   -------------------------------------------------------------------------- */
function initProjectModal() {
    const projectDetails = {
        'rental-car': {
            title: "RentalCarAI Website",
            desc: "A production-grade, full-stack vehicle booking system. Engineered with a clean architecture that separates responsive client actions from Spring Boot REST services.",
            images: ["assets/rental_car_dashboard_screenshot.png", "assets/rental_car_details_audi_screenshot.png", "assets/rental_car_details_bmw_screenshot.png", "assets/rental_car_bookings_screenshot.png"],
            tech: ["HTML5", "CSS3", "JavaScript", "Spring Boot", "MySQL"],
            features: [
                "Secure user registration and role checks (Client vs Admin)",
                "Dynamic search filter catalog grids (Brand, Fuel, price limits)",
                "Real-time car status tracker and reservations planner",
                "Personalized reservation overview dashboards"
            ],
            challenges: "Safeguarding multi-threaded db locks during concurrent seat bookings. Implementing custom authentication interceptors in Spring Security without performance overheads.",
            outcomes: "Mastered decoupled front/backend structures, dynamic sql queries, password cryptographic hashing, and responsive fluid flex systems.",
            demo: "https://symphonious-buttercream-02a2db.netlify.app"
        },
        'medical-billing': {
            title: "Medical Store Billing System",
            desc: "A comprehensive web-based platform built to automate medical store transactions, manage stock levels, calculate taxes, and generate invoices.",
            images: ["assets/project2.png", "assets/medical_store_inventory.png", "assets/medical_store_checkout.png"],
            tech: ["ASP.NET Core", "C#", "MySQL", "HTML5/CSS3", "JavaScript"],
            features: [
                "Role-based dashboard security separating cashier billing from administrator inventory management",
                "Dynamic billing checkout page with live tax and discount calculations",
                "Medicine inventory tracker with expiration alerts and low-quantity highlights",
                "Interactive reporting panel showing daily sales, revenues, and transaction summaries"
            ],
            challenges: "Designing a secure, role-based session check on the client-side while protecting API endpoints in ASP.NET Core. Structuring relational MySQL tables for orders, sales items, and medicines to ensure clean cascade updates and deletes.",
            outcomes: "Strengthened full-stack web engineering skills, RESTful API design using ASP.NET Core controllers, database entity relations in MySQL, and DOM manipulation for dynamic checkout lists.",
            demo: "#"
        },
        'movie-app': {
            title: "Movie Booking Android App",
            desc: "A Kotlin & Java Android application supporting cinema reservations, dynamic seat mappings, local offline caching with RoomDB, and real-time database updates via Firebase.",
            images: ["assets/project3.png", "assets/movie_booking_catalog.png", "assets/movie_booking_ticket.png"],
            tech: ["Java", "Kotlin", "Android SDK", "Firebase", "RoomDB"],
            features: [
                "Interactive seat selection grids with occupancy state listeners",
                "Firebase Auth logins and real-time backend updates",
                "Local caching layer for offline mode using Room database",
                "System notification confirmations"
            ],
            challenges: "Synchronizing ticket booking status across clients in under 200ms. Structuring responsive Kotlin coroutines without thread locks.",
            outcomes: "Gained proficiency with Jetpack Compose layouts, local repository patterns, live database listeners, and cloud messaging frameworks.",
            demo: "#"
        }
    };

    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    const backBtn = document.getElementById('modal-back-btn');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    const badges = document.getElementById('modal-tech-badges');
    const featuresList = document.getElementById('modal-features-ul');
    const challenges = document.getElementById('modal-challenges');
    const githubLink = document.getElementById('modal-github-link');
    const demoLink = document.getElementById('modal-demo-link');
    const modalImg = document.getElementById('modal-project-img');

    if (!modal || !closeBtn) return;

    function openModal(projectId) {
        const data = projectDetails[projectId];
        if (!data) return;

        title.textContent = data.title;
        desc.textContent = data.desc;
        challenges.textContent = data.challenges;

        // Links
        let repoName = projectId;
        if (projectId === 'rental-car') repoName = 'RentalCarAI';
        else if (projectId === 'medical-billing') repoName = 'MedicalStoreBillingSystem';
        else if (projectId === 'movie-app') repoName = 'MovieBookingApp';

        githubLink.href = `https://github.com/Abhi6282shek/${repoName}`;
        demoLink.href = data.demo || '#';

        // Tech Badges
        badges.innerHTML = '';
        data.tech.forEach(t => {
            const span = document.createElement('span');
            span.className = 'badge';
            span.textContent = t;
            badges.appendChild(span);
        });

        // Features
        featuresList.innerHTML = '';
        data.features.forEach(f => {
            const li = document.createElement('li');
            li.textContent = f;
            featuresList.appendChild(li);
        });

        // Interactive Carousel Setup
        let currentModalImageIndex = 0;
        const modalImages = data.images || [];

        function updateModalImage(idx) {
            currentModalImageIndex = idx;
            if (modalImg && modalImages.length > 0) {
                modalImg.src = modalImages[idx];
                modalImg.alt = `${data.title} - Screenshot ${idx + 1}`;
                modalImg.onclick = () => {
                    openLightbox(modalImages[idx]);
                };
            }

            // Update dots active class
            const dots = document.querySelectorAll('#modal-carousel-dots .dot');
            dots.forEach((dot, i) => {
                if (i === idx) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }

        // Populate dots
        const dotsContainer = document.getElementById('modal-carousel-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            modalImages.forEach((_, idx) => {
                const dot = document.createElement('span');
                dot.className = 'dot' + (idx === 0 ? ' active' : '');
                dot.addEventListener('click', () => updateModalImage(idx));
                dotsContainer.appendChild(dot);
            });
        }

        // Prev / Next button actions
        const prevBtn = document.getElementById('modal-carousel-prev');
        const nextBtn = document.getElementById('modal-carousel-next');

        if (prevBtn && nextBtn) {
            if (modalImages.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                if (dotsContainer) dotsContainer.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
                if (dotsContainer) dotsContainer.style.display = 'flex';
            }

            prevBtn.onclick = () => {
                let idx = currentModalImageIndex - 1;
                if (idx < 0) idx = modalImages.length - 1;
                updateModalImage(idx);
            };

            nextBtn.onclick = () => {
                let idx = (currentModalImageIndex + 1) % modalImages.length;
                updateModalImage(idx);
            };
        }

        // Set initial image
        updateModalImage(0);

        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    if (backBtn) {
        backBtn.addEventListener('click', closeModal);
    }
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });

    // Event delegation on portfolio project card clicks
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.project-details-trigger-btn');
        const imgTrigger = e.target.closest('.project-card-img-trigger');

        if (trigger) {
            const pId = trigger.getAttribute('data-project-id');
            openModal(pId);
        } else if (imgTrigger) {
            const card = imgTrigger.closest('.project-card');
            if (card) {
                const pId = card.getAttribute('data-project-id');
                openModal(pId);
            }
        }
    });

    /* Lightbox logic */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImg || !lightboxClose) return;

    function openLightbox(imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('show');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

/* --------------------------------------------------------------------------
   14. Live Demo Interceptor & Custom Premium Toast
   -------------------------------------------------------------------------- */
function initLiveDemoHandlers() {
    document.addEventListener('click', (e) => {
        const demoLink = e.target.closest('#featured-demo-link, #modal-demo-link, .live-demo-btn');
        if (demoLink) {
            const href = demoLink.getAttribute('href');
            if (href === '#' || !href) {
                e.preventDefault();
                
                let projectName = "This project";
                let githubUrl = "#";

                // Check if it's the featured carousel project demo
                if (demoLink.id === 'featured-demo-link' || demoLink.closest('.featured-project-links')) {
                    const featuredTitle = document.getElementById('featured-title');
                    projectName = featuredTitle ? featuredTitle.textContent : "This project";
                    
                    const featuredGithubLink = document.getElementById('featured-github-link');
                    githubUrl = featuredGithubLink ? featuredGithubLink.href : "#";
                } 
                // Check if it's the modal case study demo
                else if (demoLink.id === 'modal-demo-link' || demoLink.closest('.modal-actions')) {
                    const modalTitle = document.getElementById('modal-title');
                    projectName = modalTitle ? modalTitle.textContent : "This project";
                    
                    const modalGithubLink = document.getElementById('modal-github-link');
                    githubUrl = modalGithubLink ? modalGithubLink.href : "#";
                }

                showDemoUnavailableToast(projectName, githubUrl);
            }
        }
    });
}

function showDemoUnavailableToast(projectName, githubUrl) {
    // Check if container already exists, otherwise create it
    let container = document.getElementById('custom-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'custom-toast-container';
        container.className = 'custom-toast-container';
        document.body.appendChild(container);
    }

    // Create Toast element
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    
    const iconHTML = `<div class="custom-toast-icon"><i class="fa-solid fa-circle-info"></i></div>`;
    
    let buttonsHTML = '';
    if (githubUrl && githubUrl !== '#') {
        buttonsHTML = `
            <div class="custom-toast-actions">
                <a href="${githubUrl}" target="_blank" class="custom-toast-btn custom-toast-btn-primary"><i class="fa-brands fa-github"></i> Repository</a>
                <button class="custom-toast-btn custom-toast-btn-secondary toast-dismiss-btn">Dismiss</button>
            </div>
        `;
    } else {
        buttonsHTML = `
            <div class="custom-toast-actions">
                <button class="custom-toast-btn custom-toast-btn-secondary toast-dismiss-btn">Close</button>
            </div>
        `;
    }

    toast.innerHTML = `
        ${iconHTML}
        <div class="custom-toast-content">
            <div class="custom-toast-title">Live Demo Info</div>
            <div class="custom-toast-message"><strong>${projectName}</strong> is a full-stack system or local application (with backend services/database) which is not currently hosted online. You can view the code and setup instructions in the GitHub repository!</div>
            ${buttonsHTML}
        </div>
        <button class="custom-toast-close toast-dismiss-btn" aria-label="Close">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger reveal transition
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // Setup dismiss event listeners
    const dismissButtons = toast.querySelectorAll('.toast-dismiss-btn');
    dismissButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dismissToast(toast);
        });
    });

    // Auto dismiss after 8 seconds
    const autoDismissTimeout = setTimeout(() => {
        dismissToast(toast);
    }, 8000);

    function dismissToast(el) {
        clearTimeout(autoDismissTimeout);
        el.classList.remove('show');
        setTimeout(() => {
            el.remove();
            // Remove container if empty
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }
}

/* --------------------------------------------------------------------------
   15. Sleek Local Visitor hits Counter
   -------------------------------------------------------------------------- */
function initVisitorCounter() {
    const counterEl = document.getElementById('visitor-count-val');
    if (!counterEl) return;

    const baseVisits = 1428;
    let visits = parseInt(localStorage.getItem('visitor_count'), 10);
    
    if (isNaN(visits)) {
        visits = baseVisits;
    } else {
        visits += 1;
    }
    
    localStorage.setItem('visitor_count', visits);
    
    const targetVisits = visits;
    let current = Math.max(0, targetVisits - 100);
    
    counterEl.textContent = current.toLocaleString();
    
    const interval = setInterval(() => {
        current += 5;
        if (current >= targetVisits) {
            counterEl.textContent = targetVisits.toLocaleString();
            clearInterval(interval);
        } else {
            counterEl.textContent = current.toLocaleString();
        }
    }, 30);
}

