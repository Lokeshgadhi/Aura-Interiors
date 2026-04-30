/* 
  Aura Interiors - core interactivity
*/

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.glass-nav');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // 1. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 5%';
            nav.style.background = 'rgba(9, 11, 15, 0.85)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.padding = '1.5rem 5%';
            nav.style.background = 'rgba(9, 11, 15, 0.7)';
            nav.style.boxShadow = 'none';
        }
    }, { passive: true });

    // 2. Mobile Menu Toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(9, 11, 15, 0.95)';
                navLinks.style.padding = '2rem';
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                navLinks.style.display = '';
            }
        });
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

window.addEventListener('load', hideLoader);

// Fallback: Force hide loader after 3 seconds in case of slow/failed asset loading (e.g. Unsplash placeholders)
setTimeout(hideLoader, 3000);



