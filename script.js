// =====================================================
//   PERFORMANCE OPTIMIZATION UTILITIES
// =====================================================

// Debounce function for expensive operations
const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for scroll/resize events
const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Request Animation Frame wrapper for smooth animations
const rafThrottle = (callback) => {
    let requestId = null;
    return (...args) => {
        if (requestId === null) {
            requestId = requestAnimationFrame(() => {
                callback(...args);
                requestId = null;
            });
        }
    };
};

// Intersection Observer for lazy loading
const observeElement = (element, callback, options = {}) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, ...options });
    
    observer.observe(element);
    return observer;
};

// Performance monitoring
const perfMonitor = {
    start: (label) => performance.mark(`${label}-start`),
    end: (label) => {
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
    }
};

// =====================================================
//   CORE FUNCTIONALITY
// =====================================================

// --- 1. Dark Mode Toggle Logic ---

const root = document.documentElement;
const toggleButton = document.getElementById('dark-mode-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

const initializeTheme = () => {
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
                       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDarkMode) {
        root.classList.add('dark');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
        // Update cube-related CSS variables for dark theme (ensure immediate effect)
        updateCubeThemeVars(true);
    } else {
        root.classList.remove('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        updateCubeThemeVars(false);
    }
};

const toggleTheme = () => {
    if (root.classList.contains('dark')) {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        updateCubeThemeVars(false);
    } else {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
        updateCubeThemeVars(true);
    }
};

toggleButton.addEventListener('click', toggleTheme);

// Initialize theme immediately
initializeTheme();

// --- Cube theme helper: set CSS variables directly (fallback / immediate update) ---
function updateCubeThemeVars(isDark) {
    const el = document.documentElement.style;
    if (isDark) {
        el.setProperty('--cube-accent-1', '#8b5cf6');
        el.setProperty('--cube-accent-2', '#a78bfa');
        el.setProperty('--cube-accent-3', '#c4b5fd');
        el.setProperty('--cube-accent-4', '#6366f1');
        el.setProperty('--cube-accent-5', '#818cf8');
        el.setProperty('--cube-accent-6', '#a5b4fc');
        el.setProperty('--cube-sky-1', '#0a0f1e');
        el.setProperty('--cube-sky-2', '#1a1f35');
        el.setProperty('--cube-stroke-default', '#a78bfa');
        el.setProperty('--cube-outline-stroke', 'rgba(139, 92, 246, 0.6)');
        el.setProperty('--cube-glow', 'rgba(139, 92, 246, 0.25)');
    } else {
        el.setProperty('--cube-accent-1', '#0891b2');
        el.setProperty('--cube-accent-2', '#06b6d4');
        el.setProperty('--cube-accent-3', '#22d3ee');
        el.setProperty('--cube-accent-4', '#0ea5e9');
        el.setProperty('--cube-accent-5', '#14b8a6');
        el.setProperty('--cube-accent-6', '#38bdf8');
        el.setProperty('--cube-sky-1', '#f8fafc');
        el.setProperty('--cube-sky-2', '#e0f2fe');
        el.setProperty('--cube-stroke-default', '#0891b2');
        el.setProperty('--cube-outline-stroke', 'rgba(8, 145, 178, 0.5)');
        el.setProperty('--cube-glow', 'rgba(8, 145, 178, 0.15)');
    }
}


// --- 2. Scroll Reveal Animation Logic ---

const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% of element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            
            // Apply delay before making it visible
            setTimeout(() => {
                entry.target.classList.add('is-visible');
                
                // If the element has a metric number, animate it
                if (entry.target.classList.contains('metric-card')) {
                    animateMetricCounter(entry.target);
                }
            }, delay);
            
            // Stop observing once it's visible
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

scrollRevealElements.forEach(element => {
    observer.observe(element);
});

// --- 2b. Counter Animation for Hero Metrics ---

function animateMetricCounter(metricCard) {
    const numberElement = metricCard.querySelector('.metric-number');
    if (!numberElement) return;
    
    const target = parseInt(numberElement.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            numberElement.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            numberElement.textContent = target + '+';
        }
    };
    
    updateCounter();
}


// --- 3. Contact Form Submission (Simulated) ---

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Simulate a successful API call delay
    formStatus.classList.remove('hidden', 'text-red-500', 'text-green-500');
    formStatus.classList.add('text-gray-500', 'animate-pulse');
    formStatus.textContent = 'Sending message...';

    setTimeout(() => {
        // Successful submission simulation
        formStatus.classList.remove('text-gray-500', 'animate-pulse');
        formStatus.classList.add('text-green-500');
        formStatus.textContent = 'Message sent successfully! Thank you for reaching out.';
        
        // Clear the form fields
        contactForm.reset();
        
        // Hide status after a few seconds
        setTimeout(() => {
            formStatus.classList.add('hidden');
        }, 5000);

    }, 1500); // 1.5 second delay
});


// --- 4. Desktop Dark Mode Toggle ---
toggleButton?.addEventListener('click', toggleTheme);


// --- 5. Mobile Dark Mode Toggle ---
const mobileToggleButton = document.getElementById('mobile-dark-mode-toggle');
const mobileSunIcon = document.getElementById('mobile-sun-icon');
const mobileMoonIcon = document.getElementById('mobile-moon-icon');

const updateMobileThemeIcons = () => {
    if (root.classList.contains('dark')) {
        mobileMoonIcon?.classList.remove('hidden');
        mobileSunIcon?.classList.add('hidden');
    } else {
        mobileSunIcon?.classList.remove('hidden');
        mobileMoonIcon?.classList.add('hidden');
    }
};

mobileToggleButton?.addEventListener('click', () => {
    toggleTheme();
    updateMobileThemeIcons();
});

// Initialize mobile theme icons
updateMobileThemeIcons();


// --- 6. Mobile Sidebar Navigation ---
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNavSidebar = document.getElementById('mobile-nav-sidebar');
const mobileNavClose = document.getElementById('mobile-nav-close');
const navOverlay = document.getElementById('nav-overlay');
const mobileNavLinks = document.getElementById('mobile-nav-links');

let sidebarOpen = false;

const openSidebar = () => {
    sidebarOpen = true;
    mobileNavSidebar.classList.add('open');
    navOverlay.classList.remove('hidden');
    navOverlay.classList.add('open');
    mobileMenuToggle?.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeSidebar = () => {
    sidebarOpen = false;
    mobileNavSidebar.classList.remove('open');
    navOverlay.classList.add('hidden');
    navOverlay.classList.remove('open');
    mobileMenuToggle?.classList.remove('active');
    document.body.style.overflow = '';
};

// Toggle sidebar on menu button click
mobileMenuToggle?.addEventListener('click', () => {
    if (sidebarOpen) closeSidebar();
    else openSidebar();
});

// Close sidebar on close button click
mobileNavClose?.addEventListener('click', closeSidebar);

// Close sidebar when clicking on overlay
navOverlay?.addEventListener('click', closeSidebar);

// Close sidebar when clicking a link
mobileNavLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
});

// Close sidebar on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarOpen) closeSidebar();
});


// --- 7. Particles Animation ---

const canvas = document.getElementById('particles-canvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            const isDark = document.documentElement.classList.contains('dark');
            const color = isDark ? 'rgba(6, 182, 212, ' : 'rgba(8, 145, 178, ';
            
            ctx.fillStyle = color + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Connect particles
    function connectParticles() {
        const maxDistance = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const isDark = document.documentElement.classList.contains('dark');
                    const opacity = (1 - distance / maxDistance) * 0.15;
                    ctx.strokeStyle = isDark ? 
                        `rgba(6, 182, 212, ${opacity})` : 
                        `rgba(8, 145, 178, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}


// --- 8. Custom Cursor ---

const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower && window.innerWidth > 768) {
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Cursor follows immediately
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';

        // Follower has delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-circle, .skill-tag-pro');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}


// --- 9. Optimized Parallax Effect on Scroll ---

if (window.innerWidth > 1024) {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    const handleParallax = rafThrottle(() => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    window.addEventListener('scroll', handleParallax, { passive: true });
}


// --- 10. Enhanced Typing Animation ---

const typingElement = document.getElementById('typing-text');
if (typingElement) {
    const texts = [
        'MERN Stack',
        'Flutter Development',
        'Android Development',
        'AI Integration',
        'Full-Stack Solutions'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}


// --- 11. Beautiful Background Effects ---

const starsCanvas = document.getElementById('stars-canvas');
const starsCtx = starsCanvas?.getContext('2d');

// Detect if mobile for different background effects
const isMobileView = () => window.innerWidth <= 768;

if (starsCanvas && starsCtx) {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;

    const stars = [];
    const starCount = isMobileView() ? 0 : 80; // No stars on mobile

    class Star {
        constructor() {
            this.x = Math.random() * starsCanvas.width;
            this.y = Math.random() * starsCanvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.brightness = Math.random() * 0.4 + 0.2;
            this.twinkleSpeed = Math.random() * 0.03 + 0.01;
            this.color = this.getStarColor();
        }

        getStarColor() {
            const rand = Math.random();
            if (rand > 0.95) {
                return { r: 220, g: 230, b: 255 }; // Subtle blue
            } else {
                return { r: 240, g: 240, b: 240 }; // Soft white
            }
        }

        update() {
            this.brightness += this.twinkleSpeed;
            if (this.brightness >= 0.6 || this.brightness <= 0.2) {
                this.twinkleSpeed = -this.twinkleSpeed;
            }
        }

        draw() {
            starsCtx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.brightness})`;
            starsCtx.beginPath();
            starsCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            starsCtx.fill();

            // Subtle professional glow
            if (this.brightness > 0.5) {
                starsCtx.shadowBlur = this.size * 2;
                starsCtx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.brightness * 0.3})`;
                starsCtx.beginPath();
                starsCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                starsCtx.fill();
                starsCtx.shadowBlur = 0;
            }
        }
    }

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    function animateStars() {
        starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animateStars);
    }

    // Only animate if in dark mode
    if (document.documentElement.classList.contains('dark')) {
        animateStars();
    }

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (document.documentElement.classList.contains('dark')) {
                    animateStars();
                }
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true
    });

    // Resize handler
    window.addEventListener('resize', () => {
        starsCanvas.width = window.innerWidth;
        starsCanvas.height = window.innerHeight;
        
        // Reinitialize based on screen size
        stars.length = 0;
        const newCount = isMobileView() ? 0 : 80;
        for (let i = 0; i < newCount; i++) {
            stars.push(new Star());
        }
        
        // Reinitialize orbs if mobile
        if (isMobileView()) {
            orbs.length = 0;
            for (let i = 0; i < 3; i++) {
                orbs.push(new GradientOrb());
            }
        }
    });
    
    // --- Beautiful Gradient Orbs for Mobile ---
    const orbs = [];
    
    class GradientOrb {
        constructor() {
            this.x = Math.random() * starsCanvas.width;
            this.y = Math.random() * starsCanvas.height;
            this.size = Math.random() * 150 + 100;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.hue = Math.random() * 60 + 170; // Cyan-blue range
            this.opacity = Math.random() * 0.3 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }
        
        update() {
            // Move orb
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < -this.size || this.x > starsCanvas.width + this.size) {
                this.vx *= -1;
            }
            if (this.y < -this.size || this.y > starsCanvas.height + this.size) {
                this.vy *= -1;
            }
            
            // Pulse effect
            this.pulsePhase += this.pulseSpeed;
            const pulseFactor = Math.sin(this.pulsePhase) * 0.2 + 1;
            this.currentSize = this.size * pulseFactor;
        }
        
        draw() {
            // Create radial gradient
            const gradient = starsCtx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.currentSize
            );
            
            gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${this.opacity})`);
            gradient.addColorStop(0.5, `hsla(${this.hue + 20}, 70%, 50%, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 60%, 40%, 0)`);
            
            starsCtx.fillStyle = gradient;
            starsCtx.beginPath();
            starsCtx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
            starsCtx.fill();
        }
    }
    
    // Initialize orbs for mobile
    if (isMobileView()) {
        for (let i = 0; i < 3; i++) {
            orbs.push(new GradientOrb());
        }
    }
    
    // Animation loop for orbs
    function animateOrbs() {
        starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
        
        orbs.forEach(orb => {
            orb.update();
            orb.draw();
        });
        
        requestAnimationFrame(animateOrbs);
    }
    
    // Start appropriate animation based on device
    if (isMobileView() && document.documentElement.classList.contains('dark')) {
        animateOrbs();
    }
    
    // Update observer to handle mobile orbs
    const originalObserver = observer;
    observer.disconnect();
    
    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (document.documentElement.classList.contains('dark')) {
                    if (isMobileView()) {
                        animateOrbs();
                    } else {
                        animateStars();
                    }
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true
    });
}


// --- 12. Enhanced Info Modal System ---

// Info modal functionality
const initInfoModal = () => {
    const modal = document.getElementById('info-modal');
    const modalClose = document.getElementById('info-modal-close');
    const modalTitle = document.getElementById('info-modal-title');
    const modalBody = document.getElementById('info-modal-body');
    
    // Project information database
    const projectInfo = {
        'TaxMate': {
            title: 'TaxMate - AI-Powered Tax Simplification',
            content: `
                <p><strong>TaxMate</strong> is an intelligent tax simplification system that helps users navigate complex tax calculations with AI-powered document processing and personalized guidance.</p>
                <h4>Key Features:</h4>
                <ul>
                    <li>Smart OCR-based document extraction (Form-16, salary slips)</li>
                    <li>AI-powered tax regime comparison and recommendations</li>
                    <li>Automated tax calculation and deduction optimization</li>
                    <li>Personalized tax-saving suggestions</li>
                    <li>Manual data entry with intelligent validation</li>
                    <li>Interactive dashboard for tax planning</li>
                </ul>
                <h4>Tech Stack:</h4>
                <ul>
                    <li>Frontend: React.js with modern UI</li>
                    <li>Backend: Node.js & Express.js</li>
                    <li>Database: MongoDB</li>
                    <li>AI/ML: OCR integration for document processing</li>
                    <li>Deployment: Vercel</li>
                </ul>
                <h4>GitHub:</h4>
                <p><a href="https://github.com/Adia12528/TaxMate" target="_blank" style="color: #06b6d4;">View Repository →</a></p>
            `
        },
        'Automata Engine': {
            title: 'Automata Engine',
            content: `
                <p><strong>Automata Engine</strong> is a powerful visualization and simulation tool for finite automata, helping students and developers understand automata theory concepts.</p>
                <h4>Key Features:</h4>
                <ul>
                    <li>Interactive DFA/NFA visualization</li>
                    <li>State transition animations</li>
                    <li>String acceptance testing</li>
                    <li>Real-time automata construction</li>
                    <li>Educational examples and tutorials</li>
                </ul>
                <h4>Tech Stack:</h4>
                <ul>
                    <li>Frontend: Modern JavaScript with Canvas API</li>
                    <li>Visualization: Custom rendering engine</li>
                    <li>Deployment: Vercel</li>
                </ul>
                <h4>Links:</h4>
                <p><a href="https://automata-engine.vercel.app" target="_blank" style="color: #10b981;">Live Demo →</a> | <a href="https://github.com/Adia12528/AutomataEngine" target="_blank" style="color: #06b6d4;">GitHub →</a></p>
            `
        },
        'File Compressor': {
            title: 'File Compressor',
            content: `
                <p><strong>File Compressor</strong> is a web-based tool that allows users to compress files efficiently using modern compression algorithms.</p>
                <h4>Key Features:</h4>
                <ul>
                    <li>Fast file compression and decompression</li>
                    <li>Support for multiple file formats</li>
                    <li>Client-side processing for privacy</li>
                    <li>Batch file processing</li>
                    <li>Compression ratio visualization</li>
                    <li>Download compressed files instantly</li>
                </ul>
                <h4>Tech Stack:</h4>
                <ul>
                    <li>Frontend: React.js with modern UI</li>
                    <li>Compression: JavaScript compression libraries</li>
                    <li>Deployment: Vercel</li>
                </ul>
                <h4>Links:</h4>
                <p><a href="https://file-compressor-lac.vercel.app" target="_blank" style="color: #10b981;">Live Demo →</a> | <a href="https://github.com/Adia12528/FileCompressor" target="_blank" style="color: #06b6d4;">GitHub →</a></p>
            `
        }
    };
    
    // Add info icons to project circles
    const addInfoIcons = () => {
        const projectCircles = document.querySelectorAll('.project-circle');
        
        projectCircles.forEach((circle, index) => {
            // Get project name from circle content
            const projectName = circle.querySelector('.circle-content h4')?.textContent || 
                               Object.keys(projectInfo)[index];
            
            // Create info icon button
            const infoBtn = document.createElement('button');
            infoBtn.className = 'info-icon-btn';
            infoBtn.setAttribute('aria-label', 'View project information');
            infoBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            `;
            
            // Add click handler
            infoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(projectName);
            });
            
            circle.appendChild(infoBtn);
        });
    };
    
    // Open modal with project info
    const openModal = (projectName) => {
        const info = projectInfo[projectName] || {
            title: projectName,
            content: `<p>Information about ${projectName} coming soon!</p>`
        };
        
        modalTitle.textContent = info.title;
        modalBody.innerHTML = info.content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // Event listeners
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Initialize info icons
    addInfoIcons();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInfoModal);
} else {
    initInfoModal();
}

// OLD ALIEN MESSAGES REMOVED
const removedAlienMessages = {
    welcome: [
        "👋 <strong>Welcome!</strong> I'm your AI portfolio assistant. Click me anytime for guidance!",
        "🤖 <strong>Hello!</strong> I'm here to help you explore this amazing portfolio. Ask me anything!"
    ],
    features: [
        "✨ <strong>Tech Stack:</strong> This site uses React-style animations, custom particles, and advanced CSS!",
        "🎨 <strong>Design:</strong> Every element features glassmorphism, 3D transforms, and smooth transitions!",
        "⚡ <strong>Performance:</strong> GPU-accelerated animations ensure 60fps on all devices!",
        "🌟 <strong>Themes:</strong> Switch between cinematic space and holographic interface themes!"
    ],
    navigation: [
        "🧭 <strong>Navigation Tip:</strong> Use the menu or scroll to explore different sections!",
        "📍 <strong>Quick Access:</strong> The nav bar auto-hides when scrolling for better viewing!",
        "🔄 <strong>Smooth Scroll:</strong> Click any nav link for smooth animated transitions!"
    ],
    interaction: [
        "🖱️ <strong>Hover Effects:</strong> Try hovering over cards, buttons, and skills for 3D animations!",
        "👆 <strong>Interactive:</strong> Click the floating project circles to visit live websites!",
        "💫 <strong>Animations:</strong> Notice the shimmer effects on cards? That's pure CSS magic!"
    ],
    technical: [
        "⚙️ <strong>Custom Cursor:</strong> On desktop, notice the custom cursor following your mouse!",
        "🎭 <strong>Particles:</strong> 80+ connected particles create this dynamic background!",
        "🌌 <strong>Space Theme:</strong> Dark mode features black holes, wormholes, and flying spaceships!"
    ],
    projects: [
        "🚀 <strong>Projects:</strong> Each circle showcases a real deployed application!",
        "💼 <strong>Portfolio:</strong> Hover and click to explore detailed project information!",
        "🔗 <strong>Live Sites:</strong> All projects link to actual working websites!"
    ],
    mobile: [
        "📱 <strong>Responsive:</strong> This site adapts to 7 different screen sizes!",
        "👌 <strong>Touch-Friendly:</strong> All buttons meet 44px minimum touch target size!",
        "🔄 <strong>Mobile-First:</strong> Optimized for smooth performance on any device!"
    ]
};

let messageHistory = [];
let tooltipTimeout;
let isTooltipLocked = false;

// Get contextual message based on current scroll position
function getContextualMessage() {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent < 15) {
        return alienMessages.welcome[Math.floor(Math.random() * alienMessages.welcome.length)];
    } else if (scrollPercent < 30) {
        return alienMessages.features[Math.floor(Math.random() * alienMessages.features.length)];
    } else if (scrollPercent < 50) {
        return alienMessages.projects[Math.floor(Math.random() * alienMessages.projects.length)];
    } else if (scrollPercent < 70) {
        return alienMessages.interaction[Math.floor(Math.random() * alienMessages.interaction.length)];
    } else {
        return alienMessages.technical[Math.floor(Math.random() * alienMessages.technical.length)];
    }
}

// Get random message from all categories
function getRandomMessage() {
    const allCategories = Object.keys(alienMessages);
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    const messages = alienMessages[randomCategory];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Show tooltip with message
function showTooltip(message, duration = 5000) {
    if (!tooltipContent || !alienTooltip) return;
    
    clearTimeout(tooltipTimeout);
    tooltipContent.innerHTML = message;
    alienTooltip.classList.add('show');
    
    if (!isTooltipLocked) {
        tooltipTimeout = setTimeout(() => {
            alienTooltip.classList.remove('show');
        }, duration);
    }
}

// Hide tooltip
function hideTooltip() {
    if (!isTooltipLocked) {
        clearTimeout(tooltipTimeout);
        alienTooltip?.classList.remove('show');
    }
}

if (alienHelper && alienTooltip && tooltipContent) {
    // Click to get contextual tip
    alienHelper.addEventListener('click', (e) => {
        e.stopPropagation();
        isTooltipLocked = !isTooltipLocked;
        
        if (isTooltipLocked) {
            const message = getContextualMessage();
            messageHistory.push(message);
            showTooltip(message, 0); // Don't auto-hide when locked
        } else {
            hideTooltip();
        }
    });

    // Hide tooltip when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!alienHelper.contains(e.target) && !alienTooltip.contains(e.target)) {
            isTooltipLocked = false;
            hideTooltip();
        }
    });

    // Enhanced hover detection with specific messages
    const hoverableElements = document.querySelectorAll('a, button, .project-circle, .skill-tag-pro, .content-card, .feature-card, .metric-card');
    
    hoverableElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            if (isTooltipLocked) return; // Don't interrupt locked tooltip
            
            const elementClass = element.className;
            let message = '';
            
            // Project circles
            if (elementClass.includes('project-circle')) {
                const projectName = element.querySelector('.circle-title')?.textContent || 'project';
                message = `🎯 <strong>${projectName}</strong> Click to visit the live website!`;
            }
            // Skill tags
            else if (elementClass.includes('skill-tag-pro')) {
                const skillName = element.querySelector('.skill-name')?.textContent || 'skill';
                const skillLevel = element.querySelector('.skill-level')?.textContent || '';
                message = `💪 <strong>${skillName}</strong> ${skillLevel ? '(' + skillLevel + ' level)' : ''} - Notice the 3D hover effect!`;
            }
            // Content cards
            else if (elementClass.includes('content-card')) {
                message = `📦 <strong>Project Card:</strong> Features shimmer animation and glassmorphism design!`;
            }
            // Feature cards
            else if (elementClass.includes('feature-card')) {
                message = `⭐ <strong>Feature Highlight:</strong> Hover reveals enhanced glow and lift animation!`;
            }
            // Metric cards
            else if (elementClass.includes('metric-card')) {
                message = `📊 <strong>Achievement Metric:</strong> These counters animated on scroll reveal!`;
            }
            // Buttons
            else if (element.tagName.toLowerCase() === 'button') {
                message = `🔘 <strong>Interactive Button:</strong> Click for ripple effect and smooth transition!`;
            }
            // Links
            else if (element.tagName.toLowerCase() === 'a') {
                const href = element.getAttribute('href');
                if (href && href.startsWith('http')) {
                    message = `🔗 <strong>External Link:</strong> Opens in a new tab for seamless browsing!`;
                } else if (href && href.startsWith('#')) {
                    message = `🔗 <strong>Section Link:</strong> Smooth scroll to ${href.substring(1)} section!`;
                }
            }
            
            if (message) {
                showTooltip(message, 3000);
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (!isTooltipLocked) {
                setTimeout(() => {
                    hideTooltip();
                }, 500);
            }
        });
    });

    // Theme switch detection
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(() => {
                const isDark = document.documentElement.classList.contains('dark');
                const message = isDark ? 
                    "🌌 <strong>Space Mode Activated!</strong> Enjoy the cinematic deep-space experience!" :
                    "☀️ <strong>Holographic Mode!</strong> Welcome to the bright futuristic interface!";
                showTooltip(message, 4000);
            }, 300);
        });
    }

    // Scroll-triggered tips
    let lastScrollPercent = 0;
    let scrollTipShown = false;
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // Show tip when reaching certain milestones
        if (!scrollTipShown && scrollPercent > 50 && lastScrollPercent <= 50) {
            showTooltip("📜 <strong>Halfway there!</strong> Keep scrolling to see more awesome features!", 3000);
            scrollTipShown = true;
            setTimeout(() => { scrollTipShown = false; }, 30000); // Reset after 30s
        }
        
        lastScrollPercent = scrollPercent;
    });

    // Welcome sequence
    setTimeout(() => {
        showTooltip(alienMessages.welcome[0], 6000);
    }, 2000);

    // Periodic helpful tips (every 45 seconds)
    setInterval(() => {
        if (!isTooltipLocked && !alienTooltip.classList.contains('show')) {
            const randomTip = getRandomMessage();
            showTooltip(randomTip, 5000);
        }
    }, 45000);
}

// --- 13. Mobile Animations & Scroll Reveal ---

// Detect if device is mobile
const isMobile = () => window.innerWidth <= 768;

// Intersection Observer for scroll reveal animations
if (isMobile()) {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after revealing
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add scroll-reveal class to elements on mobile
    const initScrollReveal = () => {
        const elementsToReveal = document.querySelectorAll('.content-card, .feature-card, .skill-tag-pro, .metric-card, .journey-content, .project-circle');
        
        elementsToReveal.forEach(element => {
            element.classList.add('scroll-reveal');
            scrollRevealObserver.observe(element);
        });
    };

    // Initialize after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        initScrollReveal();
    }

    // Add stagger animation indices to elements
    const addAnimationIndices = () => {
        // Cards
        document.querySelectorAll('.content-card').forEach((card, index) => {
            card.style.setProperty('--card-index', index);
        });

        // Skill tags
        document.querySelectorAll('.skill-tag-pro').forEach((tag, index) => {
            tag.style.setProperty('--tag-index', index);
        });

        // Metric cards
        document.querySelectorAll('.metric-card').forEach((card, index) => {
            card.style.setProperty('--metric-index', index);
        });

        // Journey items
        document.querySelectorAll('.journey-content').forEach((item, index) => {
            item.style.setProperty('--journey-index', index);
        });

        // Project circles
        document.querySelectorAll('.project-circle').forEach((circle, index) => {
            circle.style.setProperty('--project-index', index);
        });
    };

    // Initialize indices
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAnimationIndices);
    } else {
        addAnimationIndices();
    }

    // Touch feedback enhancement
    const addTouchFeedback = () => {
        const interactiveElements = document.querySelectorAll('.gradient-button, .content-card, .skill-tag-pro, .nav-link, a');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.97)';
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }, { passive: true });
        });
    };

    // Initialize touch feedback
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addTouchFeedback);
    } else {
        addTouchFeedback();
    }

    // Smooth scroll to section with animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Add a smooth animation when scrolling
                target.style.transform = 'scale(1.02)';
                target.style.transition = 'transform 0.3s ease';
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                setTimeout(() => {
                    target.style.transform = '';
                }, 500);
            }
        });
    });

    // Parallax effect for hero section on mobile
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero-section');
                
                if (hero && scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                    hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });

    // Removed periodic pulse for minimal design

    // Loading animation for images
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    };

    // Initialize lazy loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', lazyLoadImages);
    } else {
        lazyLoadImages();
    }

    // Mobile navigation animation
    const mobileNav = document.querySelector('.mobile-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (mobileNav) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down - hide nav
                mobileNav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show nav
                mobileNav.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

    // --- Sleek Mobile Button Interactions ---
    const initSleekMobileButtons = () => {
        if (!isMobile()) return;
        
        const buttons = document.querySelectorAll('.gradient-button');
        
        buttons.forEach(button => {
            // Touch start - add touch-active class for highlight animation
            button.addEventListener('touchstart', function(e) {
                this.classList.add('touch-active');
                
                // Create dynamic ripple at exact touch point
                const rect = this.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                
                // Set CSS custom properties for ripple position
                this.style.setProperty('--ripple-x', `${x}px`);
                this.style.setProperty('--ripple-y', `${y}px`);
                
            }, { passive: true });
            
            // Touch end - remove touch-active class
            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 600);
            }, { passive: true });
            
            // Touch cancel - cleanup
            button.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
            
            // Add entrance animation delay for staggered effect
            const index = Array.from(buttons).indexOf(button);
            button.style.animationDelay = `${index * 0.1}s, ${0.5 + index * 0.1}s`;
        });
    };
    
    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSleekMobileButtons);
    } else {
        initSleekMobileButtons();
    }
    
    // --- Beautiful Floating Quick Actions for Mobile ---
    const createMobileQuickActions = () => {
        if (!isMobile()) return;
        
        // Create quick actions container
        const quickActionsHTML = `
            <div class="mobile-quick-actions">
                <button class="quick-action-btn" id="quick-action-toggle" aria-label="Quick Actions">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
                <div class="quick-action-menu" id="quick-action-menu">
                    <div class="quick-action-item" data-action="top">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span>Back to Top</span>
                    </div>
                    <div class="quick-action-item" data-action="contact">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Contact Me</span>
                    </div>
                    <div class="quick-action-item" data-action="projects">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>View Projects</span>
                    </div>
                    <div class="quick-action-item" data-action="share">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share Portfolio</span>
                    </div>
                </div>
            </div>
        `;
        
        // Insert into DOM
        document.body.insertAdjacentHTML('beforeend', quickActionsHTML);
        
        // Add event listeners
        const toggleBtn = document.getElementById('quick-action-toggle');
        const menu = document.getElementById('quick-action-menu');
        const actionItems = document.querySelectorAll('.quick-action-item');
        
        let isMenuOpen = false;
        
        toggleBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            toggleBtn.classList.toggle('active', isMenuOpen);
            menu.classList.toggle('active', isMenuOpen);
        });
        
        // Handle action items
        actionItems.forEach(item => {
            item.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                
                switch(action) {
                    case 'top':
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        break;
                    case 'contact':
                        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                        break;
                    case 'projects':
                        document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                        break;
                    case 'share':
                        if (navigator.share) {
                            navigator.share({
                                title: 'Portfolio',
                                text: 'Check out this amazing portfolio!',
                                url: window.location.href
                            }).catch(() => {});
                        } else {
                            // Fallback: copy to clipboard
                            navigator.clipboard.writeText(window.location.href);
                            const span = this.querySelector('span');
                            const originalText = span.textContent;
                            span.textContent = 'Link Copied!';
                            setTimeout(() => {
                                span.textContent = originalText;
                            }, 2000);
                        }
                        break;
                }
                
                // Close menu after action
                isMenuOpen = false;
                toggleBtn.classList.remove('active');
                menu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-quick-actions') && isMenuOpen) {
                isMenuOpen = false;
                toggleBtn.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    };
    
    // Initialize quick actions
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMobileQuickActions);
    } else {
        createMobileQuickActions();
    }
}

// Performance optimization - disable animations on low-end devices
const isLowEndDevice = () => {
    return navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 && 
           navigator.deviceMemory && navigator.deviceMemory <= 4;
};

if (isLowEndDevice() && isMobile()) {
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
    
    // Disable heavy animations
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .dark .content-card::before {
                animation: none !important;
            }
            .profile-avatar {
                animation: mobileZoomIn 0.8s ease-out forwards !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// =====================================================
//   COMPREHENSIVE PERFORMANCE OPTIMIZATIONS
// =====================================================

// 1. Lazy load images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// 2. Optimize resize events
const optimizedResize = debounce(() => {
    // Recalculate layout-dependent values
    const isMobileNow = window.innerWidth <= 768;
    document.body.classList.toggle('is-mobile', isMobileNow);
}, 250);

window.addEventListener('resize', optimizedResize, { passive: true });

// 3. Prefetch critical resources
const prefetchResources = () => {
    const links = document.querySelectorAll('a[href]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const link = entry.target;
                const href = link.getAttribute('href');
                if (href && href.startsWith('http')) {
                    const prefetch = document.createElement('link');
                    prefetch.rel = 'prefetch';
                    prefetch.href = href;
                    document.head.appendChild(prefetch);
                    observer.unobserve(link);
                }
            }
        });
    });
    
    links.forEach(link => observer.observe(link));
};

// 4. Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// 5. Optimize scroll performance with passive listeners
const addPassiveScrollListeners = () => {
    const scrollHandlers = [];
    window.addEventListener('scroll', throttle(() => {
        scrollHandlers.forEach(handler => handler());
    }, 100), { passive: true });
    
    return {
        add: (handler) => scrollHandlers.push(handler)
    };
};

// 6. Critical CSS loaded indicator
document.documentElement.classList.add('fonts-loaded');

// 7. Service Worker for caching (if supported)
if ('serviceWorker' in navigator && 'production' === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, continue without it
        });
    });
}

// 8. Remove unused event listeners on page unload
window.addEventListener('beforeunload', () => {
    // Cleanup to prevent memory leaks
    window.removeEventListener('scroll', handleParallax);
    window.removeEventListener('resize', optimizedResize);
});

// 9. Initialize all optimizations
const initOptimizations = () => {
    perfMonitor.start('initialization');
    
    // Add will-change to animated elements
    const animatedElements = document.querySelectorAll('.content-card, .gradient-button, .skill-tag-pro, .project-circle');
    animatedElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
        // Remove will-change after animation completes
        el.addEventListener('transitionend', function handler() {
            this.style.willChange = 'auto';
            this.removeEventListener('transitionend', handler);
        }, { once: true });
    });
    
    // Lazy load images
    lazyLoadImages();
    
    // Prefetch resources
    if (window.requestIdleCallback) {
        requestIdleCallback(prefetchResources);
    } else {
        setTimeout(prefetchResources, 2000);
    }
    
    // Mark as interactive
    document.documentElement.classList.add('interactive');
    
    perfMonitor.end('initialization');
    
    console.log('✨ Website fully optimized and ready!');
    console.log('⚡ Performance: Smooth animations enabled');
    console.log('🎨 Professional design active');
};

// Run optimizations when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOptimizations);
} else {
    initOptimizations();
}

// Log performance metrics in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Performance Metrics:');
            console.log(`- DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
            console.log(`- Page Load Time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            console.log(`- Total Time: ${perfData.duration}ms`);
        }, 0);
    });
}