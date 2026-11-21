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
