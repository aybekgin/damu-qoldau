// Main JavaScript functionality for Grant Seller Website
'use strict';

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const heroConsult = document.getElementById('heroConsult');
const grantsConsult = document.getElementById('grantsConsult');
const ctaForm = document.getElementById('ctaForm');
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initTabs();
    initSlider();
    initForms();
    initModal();
    initScrollEffects();
    initPhoneFormat();
});

// Mobile Menu
function initMobileMenu() {
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileOverlay.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Smooth Scroll for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Grants Tabs
function initTabs() {
    const tabs = document.querySelectorAll('.grants__tab');
    const panels = document.querySelectorAll('.grants__panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPanel = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            document.getElementById(targetPanel).classList.add('active');
        });
    });
}

// Reviews Infinite Scroll
function initSlider() {
    const track = document.getElementById('reviewsTrack');
    
    if (!track) return;
    
    // Clone all review cards for seamless infinite scroll
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Pause animation on hover for better UX
    track.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    track.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
}

// Forms
function initForms() {
    // CTA Form
    if (ctaForm) {
        ctaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }
    
    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }
    
    // Consultation buttons
    if (heroConsult) {
        heroConsult.addEventListener('click', () => scrollToElement('#contact'));
    }
    
    if (grantsConsult) {
        grantsConsult.addEventListener('click', () => scrollToElement('#contact'));
    }
}

function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Generate WhatsApp message
    setTimeout(() => {
        const whatsappMessage = generateWhatsAppMessage(data, form);
        const whatsappUrl = `https://wa.me/77755083546?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showModal();
        
        console.log('Form data sent to WhatsApp:', data);
    }, 1000);
}

function generateWhatsAppMessage(data, form) {
    const formType = form.id === 'ctaForm' ? 'CTA форма' : 'Контактная форма';
    const timestamp = new Date().toLocaleString('ru-RU', {
        timeZone: 'Asia/Almaty',
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let message = `🚀 *Новая заявка с сайта АЕМ Консалтинг*\n\n`;
    message += `📋 *Тип формы:* ${formType}\n`;
    message += `📅 *Дата:* ${timestamp}\n\n`;
    
    // Add form fields
    if (data.name || data[Object.keys(data)[0]]) {
        const name = data.name || data[Object.keys(data)[0]] || 'Не указано';
        message += `👤 *Имя:* ${name}\n`;
    }
    
    if (data.phone || data.tel) {
        const phone = data.phone || data.tel || 'Не указан';
        message += `📞 *Телефон:* ${phone}\n`;
    }
    
    if (data.message || data.question) {
        const userMessage = data.message || data.question;
        message += `💬 *Сообщение:* ${userMessage}\n`;
    }
    
    message += `\n💰 *Интерес:* Получение грантов и субсидий`;
    message += `\n🌐 *Источник:* Сайт АЕМ Консалтинг`;
    
    return message;
}

function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Modal
function initModal() {
    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }
    
    if (modalOk) {
        modalOk.addEventListener('click', hideModal);
    }
    
    // Close modal on backdrop click
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal();
            }
        });
    }
}

function showModal() {
    if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal() {
    if (successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Scroll Effects
function initScrollEffects() {
    // Header background on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
    });
    
    // Animate elements on scroll
    initScrollAnimations();
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const delay = el.getAttribute('data-aos-delay');
        if (delay) {
            el.style.transitionDelay = delay + 'ms';
        }
        
        observer.observe(el);
    });
}

// Phone Number Formatting
function initPhoneFormat() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.charAt(0) === '8') {
                    value = '7' + value.slice(1);
                } else if (value.charAt(0) !== '7') {
                    value = '7' + value;
                }
                
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.slice(1, 4);
                }
                if (value.length >= 5) {
                    formatted += ') ' + value.slice(4, 7);
                }
                if (value.length >= 8) {
                    formatted += '-' + value.slice(7, 9);
                }
                if (value.length >= 10) {
                    formatted += '-' + value.slice(9, 11);
                }
                
                e.target.value = formatted;
            }
        });
        
        // Set placeholder
        if (input.placeholder === '+7 (___) ___-__-__') {
            input.placeholder = '+7 (701) 234-56-78';
        }
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initCounters,
        initTabs,
        initSlider,
        initForms,
        showModal,
        hideModal
    };
}