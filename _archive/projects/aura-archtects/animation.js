// GSAP animations for AURA ARCHITECTS landing page
// This file handles scroll animations, entrance effects, and interactive elements

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero section text animation
function animateHeroText() {
    gsap.from(".hero-title", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.5
    });
    
    gsap.from(".hero-subtitle", {
        duration: 1.5,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 1
    });
}

// About section animation
function animateAboutSection() {
    gsap.from(".about-text", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%"
        },
        duration: 1,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out"
    });
}

// Services section animations
function animateServices() {
    gsap.utils.toArray(".service-card").forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%"
            },
            duration: 0.8,
            y: 40,
            opacity: 0,
            ease: "power3.out"
        });
    });
}

// Projects section animations
function animateProjects() {
    gsap.utils.toArray(".project-card").forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%"
            },
            duration: 0.8,
            scale: 0.8,
            opacity: 0,
            ease: "back.out(1.7)"
        });
        
        // Add hover effect for project cards
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.4,
                scale: 1.03,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.4,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
}

// CTA section animation
function animateCTA() {
    gsap.from(".cta-text", {
        scrollTrigger: {
            trigger: ".cta",
            start: "top 80%"
        },
        duration: 1.2,
        y: 40,
        opacity: 0,
        ease: "power3.out"
    });
    
    gsap.from(".cta-button", {
        scrollTrigger: {
            trigger: ".cta",
            start: "top 80%"
        },
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 0.3
    });
}

// Initialize all animations
function initAnimations() {
    // Wait for page to load
    window.addEventListener('load', () => {
        animateHeroText();
        animateAboutSection();
        animateServices();
        animateProjects();
        animateCTA();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', initAnimations);
