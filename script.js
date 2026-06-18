/* 
  Aura Interiors - core interactivity
*/

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.glass-nav');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // 1. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // 2. Mobile Menu Toggle
    const closeMobileMenu = () => {
        navLinks.classList.remove('active');
        const icon = mobileMenu.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    };

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-xmark', isOpen);
        });

        // Reset mobile nav state when resizing back to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, { passive: true });
    }

    // 3. Smooth Anchor Scroll (For proper targets)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 4. Before/After Slider
    const rangeSlider = document.getElementById('compare-slider');
    if (rangeSlider) {
        rangeSlider.addEventListener('input', (e) => {
            const sliderPos = e.target.value;
            document.querySelector('.img-before').style.width = sliderPos + "%";
            document.querySelector('.slider-line').style.left = sliderPos + "%";
            document.querySelector('.slider-button').style.left = sliderPos + "%";
            e.target.setAttribute('aria-valuetext', sliderPos + '% before');
        });
    }

    // 5. Contact Form Submission (Google Sheets Apps Script via iframe)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            // Track Form Submit in Google Analytics
            if (typeof gtag === 'function') {
                gtag('event', 'form_submit', {
                    'event_category': 'conversion',
                    'event_label': 'Contact Form',
                    'value': 1,
                    'currency': 'INR'
                });
            }
            if (typeof braze !== 'undefined') {
                braze.logCustomEvent("form_submitted", {
                    source_page: window.BRAZE_PAGE_NAME || document.title
                });
                const emailField = document.getElementById('contact-email');
                if (emailField && emailField.value) {
                    braze.getUser().setEmail(emailField.value);
                }
            }

            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const hiddenIframe = document.querySelector('iframe[name="hidden_iframe"]');
            const onLoad = () => {
                hiddenIframe.removeEventListener('load', onLoad);
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Inquiry Sent!';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 3000);
            };

            hiddenIframe.addEventListener('load', onLoad);

            // Fallback: re-enable after 8s in case iframe never fires
            setTimeout(() => {
                if (submitBtn.disabled) {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }
            }, 8000);
        });
    }

    // Google Analytics - WhatsApp Click Tracker (Inside DOMContentLoaded)
    document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'conversion',
                    'event_label': 'WhatsApp Lead'
                });
            }
            if (typeof braze !== 'undefined') {
                braze.logCustomEvent("whatsapp_clicked", {
                    source_page: window.BRAZE_PAGE_NAME || document.title
                });
            }
        });
    });

    // Braze - Phone Click Tracker
    document.querySelectorAll('a[href^="tel:"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof braze !== 'undefined') {
                braze.logCustomEvent("phone_clicked", {
                    source_page: window.BRAZE_PAGE_NAME || document.title
                });
            }
        });
    });

    // Braze - Portfolio Item Click Tracker
    document.querySelectorAll('.portfolio-item').forEach(function (item) {
        item.addEventListener('click', function () {
            if (typeof braze !== 'undefined') {
                braze.logCustomEvent("portfolio_viewed", {
                    category: window.BRAZE_PAGE_NAME || document.title
                });
            }
        });
    });

    // Google Analytics - Scroll engagement (fires once per page load)
    let scrollTracked = false;
    window.addEventListener('scroll', () => {
        if (!scrollTracked && window.scrollY > 500) {
            scrollTracked = true;
            if (typeof gtag === 'function') {
                gtag('event', 'scroll_depth', { 'event_category': 'engagement' });
            }
        }
    }, { passive: true });
});

// 6. Page Loader Fade Out
let loaderHidden = false;
const hideLoader = () => {
    if (loaderHidden) return;
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
        loaderHidden = true;
    }
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
    hideLoader();
    initStatsCounter();
    initLightbox();
    initSwiper();
    initScrollProgress();

    // Motion-heavy enhancements — skipped for reduced-motion users
    if (!prefersReducedMotion) {
        initHeroParticles();
        initScrollAnimations();
        initCursor();
        initTilt();
        initMagnetic();

        // Safety net: re-measure trigger positions after fonts/images settle,
        // and force-reveal any reveal target still stuck hidden in the viewport.
        setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
            document.querySelectorAll('.price-card, .testimonials-swiper, .why-card-v2, .service-list-item, .stat-item')
                .forEach(el => {
                    const r = el.getBoundingClientRect();
                    const inView = r.top < window.innerHeight && r.bottom > 0;
                    if (inView && parseFloat(getComputedStyle(el).opacity) === 0) {
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                    }
                });
        }, 1200);
    }
});

setTimeout(hideLoader, 3000);

// ============================================================
// THREE.JS — Hero Particle Field
// ============================================================
function initHeroParticles() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 4;

    // Primary gold particles
    const count = 1800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.028, transparent: true, opacity: 0.7, sizeAttenuation: true });
    scene.add(new THREE.Points(geo, mat));

    // Secondary white dust
    const count2 = 700;
    const pos2 = new Float32Array(count2 * 3);
    for (let i = 0; i < count2 * 3; i++) pos2[i] = (Math.random() - 0.5) * 22;
    const geo2 = new THREE.BufferGeometry();
    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    const mat2 = new THREE.PointsMaterial({ color: 0xffffff, size: 0.012, transparent: true, opacity: 0.25 });
    const particles2 = new THREE.Points(geo2, mat2);
    scene.add(particles2);

    const particles = scene.children[0];
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5);
        targetY = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });

    let smoothX = 0, smoothY = 0;
    const clock = new THREE.Clock();

    (function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        smoothX += (targetX - smoothX) * 0.04;
        smoothY += (targetY - smoothY) * 0.04;

        particles.rotation.y  = t * 0.05 + smoothX * 0.35;
        particles.rotation.x  = t * 0.02 + smoothY * 0.2;
        particles2.rotation.y = -t * 0.025;

        camera.position.x += (smoothX * 0.5 - camera.position.x) * 0.04;
        camera.position.y += (-smoothY * 0.5 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
}

// ============================================================
// GSAP — Scroll-triggered animations
// ============================================================
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const fade = (targets, trigger, extra = {}) => {
        gsap.from(targets, {
            scrollTrigger: { trigger, start: 'top 82%', toggleActions: 'play none none none' },
            y: 45, opacity: 0, duration: 0.75, ease: 'power3.out',
            ...extra
        });
    };

    fade('.section-header', '.section-header');
    fade('.service-list-item', '.services-list-grid', { stagger: 0.07 });
    fade('.why-card-v2',      '.why-grid-v2',        { stagger: 0.1  });
    fade('.price-card',       '.pricing-cards-grid', { stagger: 0.15, y: 55 });
    fade('.step-item',        '.steps-timeline',     { stagger: 0.1  });
    fade('.stat-item',        '.stats-grid',         { stagger: 0.1  });

    gsap.from('.about-text', {
        scrollTrigger: { trigger: '.about', start: 'top 78%' },
        x: -60, opacity: 0, duration: 0.9, ease: 'power3.out'
    });
    gsap.from('.about-visual', {
        scrollTrigger: { trigger: '.about', start: 'top 78%' },
        x: 60, opacity: 0, duration: 0.9, ease: 'power3.out'
    });
    gsap.from('.portfolio-item', {
        scrollTrigger: { trigger: '.portfolio-grid', start: 'top 80%' },
        scale: 0.9, opacity: 0, duration: 0.65, stagger: 0.12, ease: 'power2.out'
    });
    // NOTE: do NOT GSAP-animate `.testimonial-card` — those live inside the
    // Swiper carousel (which clones slides for looping). Setting opacity:0 on
    // them leaves the carousel blank. Animate the whole container once instead.
    gsap.from('.testimonials-swiper', {
        scrollTrigger: { trigger: '.testimonials', start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
    });

    // Recalculate all trigger positions once layout has fully settled
    // (fonts loaded, hero canvas sized, async images in). Without this,
    // lower sections (pricing, testimonials) can mis-measure and stay hidden.
    ScrollTrigger.refresh();
}

// ============================================================
// Animated stats counter (Intersection Observer)
// ============================================================
function initStatsCounter() {
    const els = document.querySelectorAll('.stat-number');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            const isFloat = el.dataset.type === 'float';
            const duration = 2000;
            const startTime = performance.now();

            (function tick(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = isFloat
                    ? (eased * target).toFixed(1)
                    : Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
            })(startTime);
        });
    }, { threshold: 0.6 });

    els.forEach(el => observer.observe(el));
}

// ============================================================
// GLightbox — portfolio image lightbox
// ============================================================
function initLightbox() {
    if (typeof GLightbox === 'undefined') return;
    GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
        skin: 'clean',
        closeEffect: 'fade',
        openEffect: 'fade'
    });
}

// ============================================================
// Swiper — testimonials carousel
// ============================================================
function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 4800, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: { 768: { slidesPerView: 2 } }
    });
}

// ============================================================
// Custom cursor with lag + hover expand
// ============================================================
function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
    }, { passive: true });

    (function loop() {
        ringX += (dotX - ringX) * 0.12;
        ringY += (dotY - ringY) * 0.12;
        dot.style.left  = dotX  + 'px';
        dot.style.top   = dotY  + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(loop);
    })();

    const targets = 'a, button, .cta-btn, .portfolio-item, .service-list-item, .why-card-v2, .price-card, .chatbot-toggle';
    document.querySelectorAll(targets).forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

// ============================================================
// 3D interactive tilt on cards (vanilla, no library)
// ============================================================
function initTilt() {
    const cards = document.querySelectorAll('.price-card, .why-card-v2, .service-list-item, .glass-card');
    const MAX = 9; // max tilt degrees

    cards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.willChange = 'transform';

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.05s linear';
        });

        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width  - 0.5;
            const py = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transform =
                `perspective(900px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            card.style.transform = '';
        });
    });
}

// ============================================================
// Magnetic pull on primary CTA buttons
// ============================================================
function initMagnetic() {
    const buttons = document.querySelectorAll('.cta-btn.primary, .cta-btn.whatsapp-btn, .chatbot-toggle');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ============================================================
// Scroll Progress Bar
// ============================================================
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
}

// 7. AI Chatbot Functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (!chatbotToggle || !chatbotContainer || !chatbotClose || !chatbotInput || !chatbotSend || !chatbotMessages) return;

    // Toggle chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    // Send message function
    const sendMessage = () => {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Simulate typing
        setTimeout(() => {
            addMessage('Typing...', 'bot', true);
            
            // Get bot response
            setTimeout(() => {
                const response = getBotResponse(message);
                // Remove typing indicator
                const typingMsg = chatbotMessages.querySelector('.typing');
                if (typingMsg) typingMsg.remove();
                addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000); // Random delay 1-2s
        }, 500);
    };

    // Add message to chat
    const addMessage = (content, type, isTyping = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message${isTyping ? ' typing' : ''}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    // Bot responses
    const getBotResponse = (userMessage) => {
        const message = userMessage.toLowerCase();
        
        // Keywords and responses
        const responses = {
            greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
            services: ['service', 'what do you do', 'offer', 'provide', 'kitchen', 'wardrobe', 'tv unit', 'dining', 'home interior'],
            pricing: ['price', 'cost', 'budget', 'fee', 'charge', 'rate', 'starting from', '₹'],
            contact: ['contact', 'phone', 'call', 'whatsapp', 'email', 'address', 'location'],
            consultation: ['consultation', 'meeting', 'visit', 'design', '3d', 'free'],
            location: ['hyderabad', 'gachibowli', 'kondapur', 'kukatpally', 'hitech city']
        };

        // Check for greetings
        if (responses.greeting.some(word => message.includes(word))) {
            return "Hello! Welcome to Aura Interiors. I'm here to help you with your interior design needs. What can I assist you with today?";
        }

        // Check for services
        if (responses.services.some(word => message.includes(word))) {
            return "We specialize in modular kitchens, wardrobes, TV units, dining areas, and full home interiors. Our designs start from ₹1.5 Lakhs. Would you like to know more about any specific service?";
        }

        // Check for pricing
        if (responses.pricing.some(word => message.includes(word))) {
            return "Our interior packages start from ₹1.5 Lakhs for basic setups, going up to ₹15 Lakhs for luxury complete home makeovers. We offer transparent pricing with no hidden costs. Would you like a personalized quote?";
        }

        // Check for contact
        if (responses.contact.some(word => message.includes(word))) {
            return "You can reach us at +91 9059072432 or WhatsApp at +91 7981058016. Our email is lokeshgadhi4@gmail.com. We serve Gachibowli, Kondapur, Kukatpally, and Hitech City areas.";
        }

        // Check for consultation
        if (responses.consultation.some(word => message.includes(word))) {
            return "We offer free initial consultations! Our team will visit your space, understand your requirements, and provide 3D design options. Call us at +91 9059072432 to schedule your consultation.";
        }

        // Check for location
        if (responses.location.some(word => message.includes(word))) {
            return "We're based in Hyderabad and serve all major areas including Gachibowli, Kondapur, Kukatpally, Hitech City, and surrounding localities. Let us know your location for better assistance!";
        }

        // Default responses
        const defaults = [
            "I'd be happy to help you with that! Could you please provide more details about what you're looking for?",
            "That's interesting! At Aura Interiors, we specialize in creating beautiful, functional spaces. What specific aspect of interior design are you interested in?",
            "Thanks for your message! We have extensive experience in modular kitchens, wardrobes, and complete home interiors. How can I assist you today?",
            "I understand you're interested in interior design. We offer end-to-end solutions from concept to completion. What would you like to know more about?"
        ];

        return defaults[Math.floor(Math.random() * defaults.length)];
    };

    // Event listeners
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});



