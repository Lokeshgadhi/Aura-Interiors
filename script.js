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
            if (typeof braze !== 'undefined') {
                braze.logCustomEvent("form_submitted", {
                    source_page: window.BRAZE_PAGE_NAME || document.title
                });
                var emailField = document.getElementById('contact-email');
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

window.addEventListener('load', hideLoader);

// Fallback: Force hide loader after 3 seconds in case of slow/failed asset loading (e.g. Unsplash placeholders)
setTimeout(hideLoader, 3000);

// 7. AI Chatbot Functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

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



