# AURA ARCHITECTS Landing Page

I'll create a stunning, high-end landing page for an architecture firm using Three.js and GSAP. The design will be minimalist, premium, and focused on 3D architectural visuals.

## Folder Structure
```
aura-architects/
├── index.html
├── style.css
├── main.js
└── animations.js
```

## index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AURA ARCHITECTS</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js"></script>
</head>
<body>
    <!-- Theme toggle and sound toggle -->
    <div class="controls">
        <button id="theme-toggle" class="control-btn">
            <span class="light-icon">☀️</span>
            <span class="dark-icon">🌙</span>
        </button>
        <button id="sound-toggle" class="control-btn">
            <span class="sound-on">🔊</span>
            <span class="sound-off">🔇</span>
        </button>
    </div>

    <!-- Hero Section -->
    <section id="hero" class="hero">
        <div id="webgl-container"></div>
        <div class="hero-content">
            <h1 class="hero-title">Designing Space.<br>Shaping Futures.</h1>
            <p class="hero-subtitle">Award-winning architectural design studio</p>
        </div>
        <div class="scroll-indicator">
            <span>Scroll</span>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About AURA</h2>
            <div class="about-content">
                <p class="about-text">
                    Founded in 2010, AURA ARCHITECTS blends innovation with timeless design principles. 
                    Our team of visionary architects and designers create spaces that transcend conventional 
                    boundaries, focusing on sustainability, human experience, and architectural integrity.
                </p>
                <p class="about-text">
                    With projects spanning luxury residences, commercial spaces, and urban masterplans, 
                    we approach each commission as a unique narrative waiting to be shaped.
                </p>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
        <div class="container">
            <h2 class="section-title">Our Services</h2>
            <div class="services-grid">
                <div class="service-card" data-service="1">
                    <h3>Architectural Design</h3>
                    <p>Conceptual to construction documentation, our holistic approach ensures design integrity throughout the process.</p>
                </div>
                <div class="service-card" data-service="2">
                    <h3>Interior Design</h3>
                    <p>Curated spatial experiences that complement and enhance the architectural vision.</p>
                </div>
                <div class="service-card" data-service="3">
                    <h3>Urban Planning</h3>
                    <p>Strategic masterplanning for communities that balance density, green spaces, and human scale.</p>
                </div>
                <div class="service-card" data-service="4">
                    <h3>3D Visualization</h3>
                    <p>Immersive representations that bring architectural concepts to life before construction begins.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                <div class="project-card" data-project="1">
                    <div class="project-visual"></div>
                    <h3>Horizon Residence</h3>
                    <p>Malibu, California</p>
                </div>
                <div class="project-card" data-project="2">
                    <div class="project-visual"></div>
                    <h3>Atrium Tower</h3>
                    <p>Tokyo, Japan</p>
                </div>
                <div class="project-card" data-project="3">
                    <div class="project-visual"></div>
                    <h3>Serene Pavilion</h3>
                    <p>Copenhagen, Denmark</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section id="cta" class="cta">
        <div class="container">
            <h2 class="cta-text">Let’s build something iconic.</h2>
            <a href="#" class="cta-button">Start a Project</a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>© 2025 AURA ARCHITECTS. All rights reserved.</p>
        </div>
    </footer>

    <!-- Fallback for non-WebGL browsers -->
    <div id="fallback" class="fallback hidden">
        <div class="fallback-content">
            <h2>Your browser doesn't support WebGL</h2>
            <p>Please use a modern browser like Chrome, Firefox, or Safari for the full experience.</p>
        </div>
    </div>

    <!-- Scripts -->
    <script src="main.js"></script>
    <script src="animations.js"></script>
</body>
</html>
```

## style.css
```css
/* Base Styles */
:root {
    --color-bg: #ffffff;
    --color-text: #1a1a1a;
    --color-accent: #d4af37;
    --color-light: #f8f8f8;
    --color-dark: #0a0a0a;
    --color-gray: #e0e0e0;
    --transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    --easing: cubic-bezier(0.165, 0.84, 0.44, 1);
}

[data-theme="dark"] {
    --color-bg: #0a0a0a;
    --color-text: #f0f0f0;
    --color-light: #1a1a1a;
    --color-dark: #ffffff;
    --color-gray: #333333;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--color-bg);
    color: var(--color-text);
    overflow-x: hidden;
    line-height: 1.6;
}

.container {
    width: min(90%, 1200px);
    margin: 0 auto;
}

/* Controls */
.controls {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    gap: 12px;
    z-index: 1000;
}

.control-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
    color: var(--color-text);
}

.control-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
}

.dark-icon, .sound-off {
    display: none;
}

[data-theme="dark"] .light-icon {
    display: none;
}

[data-theme="dark"] .dark-icon {
    display: block;
}

.sound-on {
    display: block;
}

.sound-off {
    display: none;
}

/* Hero Section */
.hero {
    position: relative;
    height: 100vh;
    overflow: hidden;
}

#webgl-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 20px;
    color: var(--color-text);
}

.hero-title {
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
    font-size: clamp(1rem, 3vw, 1.5rem);
    font-weight: 300;
    opacity: 0.9;
}

.scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
}

.scroll-indicator span {
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.7;
    letter-spacing: 1px;
}

.scroll-indicator::after {
    content: '';
    width: 1px;
    height: 30px;
    background: var(--color-text);
    opacity: 0.5;
    margin-top: 10px;
    animation: scroll-pulse 2s infinite;
}

@keyframes scroll-pulse {
    0% { opacity: 0.2; }
    50% { opacity: 0.8; }
    100% { opacity: 0.2; }
}

/* Section Styles */
section {
    padding: 100px 0;
}

.section-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    text-align: center;
    margin-bottom: 60px;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: var(--color-accent);
}

/* About Section */
.about-content {
    max-width: 700px;
    margin: 0 auto;
}

.about-text {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    font-weight: 300;
}

/* Services Section */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.service-card {
    background: var(--color-light);
    padding: 40px 30px;
    border-radius: 8px;
    transition: var(--transition);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .service-card {
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.service-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.service-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    font-weight: 600;
}

.service-card p {
    font-weight: 300;
    opacity: 0.9;
}

/* Projects Section */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    margin-top: 50px;
}

.project-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: var(--transition);
    background: var(--color-light);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .project-card {
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.project-visual {
    height: 250px;
    background: linear-gradient(135deg, #e0e0e0, #f0f0f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text);
    font-size: 1.5rem;
}

[data-theme="dark"] .project-visual {
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
}

.project-card:hover .project-visual {
    transform: scale(1.05);
}

.project-card h3 {
    font-size: 1.4rem;
    margin: 20px 0 10px;
    font-weight: 600;
}

.project-card p {
    font-weight: 300;
    opacity: 0.8;
}

/* CTA Section */
.cta {
    background: var(--color-light);
    padding: 120px 0;
    text-align: center;
}

.cta-text {
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 700;
    margin-bottom: 40px;
    line-height: 1.2;
}

.cta-button {
    display: inline-block;
    padding: 16px 48px;
    background: var(--color-text);
    color: var(--color-bg);
    text-decoration: none;
    font-weight: 600;
    border-radius: 4px;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Footer */
.footer {
    padding: 30px 0;
    text-align: center;
    font-weight: 300;
    opacity: 0.7;
}

/* Fallback */
.fallback {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.fallback-content {
    max-width: 600px;
    text-align: center;
    padding: 20px;
}

.fallback h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.fallback p {
    font-size: 1.2rem;
    opacity: 0.8;
}

.hidden {
    display: none !important;
}

/* Responsive Design */
@media (max-width: 768px) {
    .controls {
        top: 10px;
        right: 10px;
    }
    
    .control-btn {
        width: 36px;
        height: 36px;
    }
    
    .hero-title {
        font-size: clamp(2rem, 8vw, 3.5rem);
    }
    
    .section-title {
        font-size: clamp(1.8rem, 6vw, 2.5rem);
    }
    
    .service-card {
        padding: 30px 20px;
    }
    
    .cta {
        padding: 80px 0;
    }
    
    .cta-text {
        font-size: clamp(1.8rem, 6vw, 3rem);
    }
}
```

## main.js
```javascript
// Main Three.js scene for AURA ARCHITECTS landing page
// This file handles the 3D architectural visualization

// Global variables
let scene, camera, renderer, model;
let container;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let cameraTarget = new THREE.Vector3(0, 0, 0);
let isWebGLSupported = true;

// Initialize the scene
function init() {
    // Check for WebGL support
    if (!Detector.webgl) {
        document.getElementById('fallback').classList.remove('hidden');
        isWebGLSupported = false;
        return;
    }
    
    // Get container
    container = document.getElementById('webgl-container');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 10, 20);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Add lighting
    setupLighting();
    
    // Create architectural model
    createModel();
    
    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Start animation
    animate();
}

// Set up lighting for the scene
function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(5, 10, 7);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);
    
    // Hemisphere light for natural ambient
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);
}

// Create the architectural model
function createModel() {
    // Group to hold all model parts
    model = new THREE.Group();
    scene.add(model);
    
    // Create main structure - abstract parametric building
    const buildingGroup = new THREE.Group();
    
    // Main tower
    const towerGeometry = new THREE.BoxGeometry(2, 4, 2);
    const towerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1
    });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.castShadow = true;
    tower.receiveShadow = true;
    buildingGroup.add(tower);
    
    // Floating platforms
    const platformGeometry = new THREE.BoxGeometry(3, 0.2, 3);
    const platformMaterial = new THREE.MeshStandard材质({ 
        color: 0xf0f0f0,
        roughness: 0.3,
        metalness: 0.05
    });
    
    for (let i = 0; i < 3; i++) {
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = 1 + i * 1.2;
        platform.position.x = Math.sin(i) * 1.5;
        platform.position.z = Math.cos(i) * 1.5;
        platform.castShadow = true;
        buildingGroup.add(platform);
    }
    
    // Curved elements (inspired by Zaha Hadid)
    const curveGeometry = new THREE.TorusGeometry(2.5, 0.3, 16, 100);
    const curveMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd4af37,
        roughness: 0.1,
        metalness: 0.8
    });
    const curve = new THREE.Mesh(curveGeometry, curveMaterial);
    curve.rotation.x = Math.PI / 2;
    curve.position.y = 2;
    curve.castShadow = true;
    buildingGroup.add(curve);
    
    // Glass elements
    const glassGeometry = new THREE.BoxGeometry(2.2, 4.2, 0.1);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 0.9,
        transparent: true,
        roughness: 0,
        clearcoat: 1.0
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.z = -1.1;
    buildingGroup.add(glass);
    
    // Position the entire building
    buildingGroup.position.y = -1;
    model.add(buildingGroup);
    
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf8f8f8,
        roughness: 0.8,
        metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Adjust model for dark theme
    updateThemeColors();
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
}

// Handle mouse movement for parallax effect
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 10;
    mouseY = (event.clientY - windowHalfY) / 10;
}

// Animation loop
function animate() {
    if (!isWebGLSupported) return;
    
    requestAnimationFrame(animate);
    
    // Update camera position based on mouse for parallax
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(cameraTarget);
    
    // Rotate the model slowly
    if (model) {
        model.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Update scene colors based on current theme
function updateThemeColors() {
    if (!isWebGLSupported || !scene) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Update background
    scene.background = new THREE.Color(isDark ? 0x0a0a0a : 0xffffff);
    scene.fog.color = new THREE.Color(isDark ? 0x0a0a0a : 0xffffff);
    
    // Update materials if they exist
    if (model) {
        // Update building materials
        model.traverse(child => {
            if (child.isMesh) {
                if (child.material.color) {
                    // Skip gold elements
                    if (child.material.color.getHex() !== 0xd4af37) {
                        child.material.color = new THREE.Color(isDark ? 0xf0f0f0 : 0xffffff);
                    }
                }
                if (child.material.emissive) {
                    child.material.emissive = new THREE.Color(isDark ? 0x111111 : 0x000000);
                }
            }
        });
    }
    
    // Update renderer
    renderer.setClearColor(isDark ? 0x0a0a0a : 0xffffff);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme based on system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Initialize Three.js scene
    init();
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeColors();
        });
    }
    
    // Sound toggle functionality (placeholder)
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const soundOn = soundToggle.querySelector('.sound-on');
            const soundOff = soundToggle.querySelector('.sound-off');
            if (soundOn.style.display === 'none') {
                soundOn.style.display = 'block';
                soundOff.style.display = 'none';
            } else {
                soundOn.style.display = 'none';
                soundOff.style.display = 'block';
            }
        });
    }
});

// Detector for WebGL support (simplified version)
const Detector = {
    webgl: (function() {
        try {
            const canvas = document.createElement('canvas');
            return !!window.WebGLRenderingContext && 
                   (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    })()
};
```

## animations.js
```javascript
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
```

## How to Use

1. Create a new folder called `aura-architects`
2. Save each file in the folder with the exact names provided
3. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)

## Features

- **Stunning 3D Architecture Visualization**: Abstract parametric building with glass elements and curved forms inspired by Zaha Hadid
- **WebGL Fallback**: Graceful degradation for browsers without WebGL support
- **Theme Toggle**: Switch between light and dark modes
- **Sound Toggle**: Control ambient sound (placeholder functionality)
- **Mouse Parallax**: Subtle camera movement based on mouse position
- **Smooth Animations**: GSAP-powered scroll animations and micro-interactions
- **Responsive Design**: Works on all device sizes
- **Premium Aesthetic**: Minimalist design with ample whitespace and elegant typography

The landing page showcases the firm's modern, premium approach through sophisticated 3D visuals and subtle animations that convey architectural excellence without overwhelming the user. The design follows the principles of minimal Japanese architecture while incorporating futuristic elements that appeal to luxury real estate clients.
