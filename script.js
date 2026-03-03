// ============================================
// NEXUS AI — INTERACTIONS & 3D
// Three.js 3D scene + scroll animations
// ============================================

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== HERO TYPING EFFECT =====
const typingText = document.querySelector('.hero-subtitle');
if (typingText) {
    const originalText = typingText.textContent;
    typingText.textContent = '';
    let i = 0;
    function type() {
        if (i < originalText.length) {
            typingText.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, 20);
        }
    }
    // Start after a slight delay
    setTimeout(type, 800);
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, i * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const statValues = document.querySelectorAll('.stat-value[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statValues.forEach(el => counterObserver.observe(el));

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ===== TESTIMONIALS CAROUSEL =====
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let totalSlides = 3;

function getCardWidth() {
    const w = window.innerWidth;
    if (w <= 768) return 100;
    if (w <= 1024) return 50;
    return 33.333;
}

function goToSlide(index) {
    const maxSlide = window.innerWidth <= 768 ? totalSlides - 1 : window.innerWidth <= 1024 ? totalSlides - 2 : 0;
    currentSlide = Math.max(0, Math.min(index, maxSlide));
    const cardWidth = getCardWidth();
    track.style.transform = `translateX(-${currentSlide * cardWidth}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== CONTACT FORM (Sagar Labs V2 - Formspree) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        // We will try AJAX first, but if it fails with "isn't set up", we will guide the user.
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalHTML = btn.innerHTML;
        const formData = new FormData(contactForm);

        btn.innerHTML = '<span>Enviando...</span>';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                btn.innerHTML = '<span>✓ ¡Enviado con éxito!</span>';
                btn.style.background = 'linear-gradient(135deg, #10B981, #06B6D4)';
                contactForm.reset();
            } else {
                const result = await response.json();
                console.error('Formspree Error:', result);

                if (result.errors && result.errors[0].message.includes("not set up")) {
                    btn.innerHTML = '<span>× Activa tu email</span>';
                    alert("¡Atención! Formspree te ha enviado un correo a rubensagarr@gmail.com para activar este formulario. Debes confirmar ese correo para empezar a recibir mensajes.");
                } else {
                    btn.innerHTML = '<span>× Error en envío</span>';
                }
                btn.style.background = '#ef4444';
            }
        } catch (error) {
            console.error('Submission Catch:', error);
            btn.innerHTML = '<span>× Error de Protocolo</span>';
            btn.style.background = '#ef4444';
            alert("Error de conexión. Si estás usando el archivo localmente, asegúrate de que tu navegador permita peticiones externas o confirma el correo de activación de Formspree.");
        }

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.opacity = '1';
            btn.disabled = false;
        }, 5000);
    });
}

setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    btn.style.opacity = '1';
    btn.disabled = false;
}, 5000);
    });
}

// ===== AURORA SHADER BACKGROUND =====
(function initAuroraBackground() {
    const container = document.getElementById('heroCanvas');
    if (!container || typeof THREE === 'undefined') return;

    const auroraScene = new THREE.Scene();
    const auroraCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const auroraRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    auroraRenderer.setPixelRatio(Math.min(window.devicePixelRatio * 2, 3));
    auroraRenderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(auroraRenderer.domElement);

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float iTime;
        uniform vec2 iResolution;
        varying vec2 vUv;

        #define S smoothstep

        vec4 Line(vec2 uv, float speed, float height, vec3 col) {
            uv.y += S(1., 0., abs(uv.x)) * sin(iTime * speed + uv.x * height) * 0.2;
            return vec4(S(0.06 * S(0.2, 0.9, abs(uv.x)), 0., abs(uv.y) - 0.004) * col, 1.0) * S(1., 0.3, abs(uv.x));
        }

        void main() {
            vec2 uv = (vUv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);
            vec4 O = vec4(0.);

            for (float i = 0.; i <= 5.; i += 1.) {
                float t = i / 5.;
                float timeOffset = iTime * 0.3 + t * 2.0;

                vec3 auroraColor = vec3(
                    0.1 + 0.6 * sin(timeOffset + t * 3.14159),
                    0.3 + 0.7 * sin(timeOffset * 1.3 + t * 2.0),
                    0.4 + 0.6 * cos(timeOffset * 0.8 + t * 1.5)
                );

                auroraColor = mix(auroraColor, vec3(0.0, 0.8, 0.6), sin(timeOffset + t) * 0.5 + 0.5);
                auroraColor = mix(auroraColor, vec3(0.7, 0.2, 0.9), cos(timeOffset * 0.7 + t * 1.2) * 0.3 + 0.3);

                O += Line(uv, 1. + t * 0.8, 4. + t, auroraColor);
            }

            gl_FragColor = O;
        }
    `;

    const auroraMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(window.innerWidth * 2, window.innerHeight * 2) }
        }
    });

    const auroraGeometry = new THREE.PlaneGeometry(2, 2);
    const auroraPlane = new THREE.Mesh(auroraGeometry, auroraMaterial);
    auroraScene.add(auroraPlane);

    const auroraStartTime = Date.now();

    function animateAurora() {
        requestAnimationFrame(animateAurora);
        auroraMaterial.uniforms.iTime.value = (Date.now() - auroraStartTime) * 0.001;
        auroraRenderer.render(auroraScene, auroraCamera);
    }

    window.addEventListener('resize', () => {
        auroraRenderer.setSize(window.innerWidth, window.innerHeight);
        auroraMaterial.uniforms.iResolution.value.set(window.innerWidth * 2, window.innerHeight * 2);
    });

    animateAurora();
})();

// ===== THREE.JS 3D SCENE =====
(function init3DScene() {
    const container = document.getElementById('hero3D');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
        canvas: container,
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    // Point lights
    const pointLight1 = new THREE.PointLight(0x8B5CF6, 2, 20);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06B6D4, 2, 20);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xEC4899, 1, 15);
    pointLight3.position.set(0, 3, -2);
    scene.add(pointLight3);

    // Central icosahedron (neural network core)
    const icoGeometry = new THREE.IcosahedronGeometry(1.4, 1);
    const icoMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B5CF6,
        emissive: 0x2a1a4e,
        specular: 0x06B6D4,
        shininess: 100,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    scene.add(icosahedron);

    // Inner solid icosahedron
    const innerIcoGeometry = new THREE.IcosahedronGeometry(0.8, 0);
    const innerIcoMaterial = new THREE.MeshPhongMaterial({
        color: 0x06B6D4,
        emissive: 0x032e38,
        specular: 0x8B5CF6,
        shininess: 80,
        transparent: true,
        opacity: 0.4
    });
    const innerIcosahedron = new THREE.Mesh(innerIcoGeometry, innerIcoMaterial);
    scene.add(innerIcosahedron);

    // Orbiting spheres (data nodes)
    const orbitSpheres = [];
    const orbitColors = [0x8B5CF6, 0x06B6D4, 0xEC4899, 0xF59E0B, 0x10B981];
    for (let i = 0; i < 12; i++) {
        const sphereGeom = new THREE.SphereGeometry(0.06 + Math.random() * 0.06, 16, 16);
        const sphereMat = new THREE.MeshPhongMaterial({
            color: orbitColors[i % orbitColors.length],
            emissive: orbitColors[i % orbitColors.length],
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeom, sphereMat);
        sphere.userData = {
            orbitRadius: 2 + Math.random() * 1.5,
            orbitSpeed: 0.3 + Math.random() * 0.5,
            orbitOffset: Math.random() * Math.PI * 2,
            verticalOscillation: Math.random() * 1.5,
            verticalSpeed: 0.2 + Math.random() * 0.3
        };
        orbitSpheres.push(sphere);
        scene.add(sphere);
    }

    // Orbital rings
    const ringGeom1 = new THREE.TorusGeometry(2.5, 0.01, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, transparent: true, opacity: 0.15 });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeom2 = new THREE.TorusGeometry(3, 0.01, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x06B6D4, transparent: true, opacity: 0.1 });
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    const ringGeom3 = new THREE.TorusGeometry(2, 0.01, 16, 100);
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xEC4899, transparent: true, opacity: 0.1 });
    const ring3 = new THREE.Mesh(ringGeom3, ringMat3);
    ring3.rotation.x = Math.PI / 2;
    ring3.rotation.z = Math.PI / 5;
    scene.add(ring3);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Rotate central shapes
        icosahedron.rotation.x = elapsed * 0.15 + mouseY * 0.3;
        icosahedron.rotation.y = elapsed * 0.2 + mouseX * 0.3;

        innerIcosahedron.rotation.x = elapsed * -0.25;
        innerIcosahedron.rotation.y = elapsed * -0.3;

        // Pulse effect
        const pulseScale = 1 + Math.sin(elapsed * 1.5) * 0.05;
        icosahedron.scale.set(pulseScale, pulseScale, pulseScale);

        const innerPulse = 1 + Math.sin(elapsed * 2) * 0.08;
        innerIcosahedron.scale.set(innerPulse, innerPulse, innerPulse);

        // Orbit spheres
        orbitSpheres.forEach((sphere) => {
            const d = sphere.userData;
            sphere.position.x = Math.cos(elapsed * d.orbitSpeed + d.orbitOffset) * d.orbitRadius;
            sphere.position.z = Math.sin(elapsed * d.orbitSpeed + d.orbitOffset) * d.orbitRadius;
            sphere.position.y = Math.sin(elapsed * d.verticalSpeed + d.orbitOffset) * d.verticalOscillation;
        });

        // Rotate rings
        ring1.rotation.z = elapsed * 0.1;
        ring2.rotation.z = elapsed * -0.08;
        ring3.rotation.y = elapsed * 0.12;

        // Animate lights
        pointLight1.position.x = Math.sin(elapsed * 0.5) * 4;
        pointLight1.position.y = Math.cos(elapsed * 0.3) * 3;

        pointLight2.position.x = Math.cos(elapsed * 0.4) * 4;
        pointLight2.position.z = Math.sin(elapsed * 0.6) * 3;

        // Camera follows mouse gently
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();
})();

// ===== MOBILE TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelector('.nav-links');
let isMenuOpen = false;

mobileToggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(10, 10, 15, 0.95)';
        navLinks.style.backdropFilter = 'blur(20px)';
        navLinks.style.padding = '20px 24px';
        navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
        navLinks.style.gap = '16px';

        mobileToggle.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        mobileToggle.children[1].style.opacity = '0';
        mobileToggle.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        navLinks.style.display = '';
        navLinks.style.flexDirection = '';
        navLinks.style.position = '';
        navLinks.style.top = '';
        navLinks.style.left = '';
        navLinks.style.right = '';
        navLinks.style.background = '';
        navLinks.style.backdropFilter = '';
        navLinks.style.padding = '';
        navLinks.style.borderBottom = '';
        navLinks.style.gap = '';

        mobileToggle.children[0].style.transform = '';
        mobileToggle.children[1].style.opacity = '';
        mobileToggle.children[2].style.transform = '';
    }
});

// ===== CLIENT VALIDATION SLIDER =====
(function initValidationSlider() {
    const needSlider = document.getElementById('needSlider');
    const sliderValue = document.getElementById('sliderValue');
    const validationCategory = document.getElementById('validationCategory');
    const validationDesc = document.getElementById('validationDesc');
    const validationFeatures = document.getElementById('validationFeatures');

    const categories = [
        {
            max: 33,
            name: "Básico",
            desc: "Necesitas automatizaciones sencillas y chatbots de preguntas frecuentes para optimizar tareas repetitivas de bajo nivel.",
            features: ["Chatbot FAQ", "Automatización Email", "Bot de Citas"]
        },
        {
            max: 66,
            name: "Intermedio",
            desc: "Necesitas un sistema con RAG (Retrieval-Augmented Generation), integración con tu CRM y memoria de largo plazo para tus clientes.",
            features: ["Conexión a Bases de Datos", "Análisis de Tendencias", "Soporte Multicanal"]
        },
        {
            max: 100,
            name: "Avanzado",
            desc: "Tu empresa requiere Agentes AI Autónomos con capacidad de razonamiento multi-etapa, orquestación de herramientas y auto-corrección.",
            features: ["Agentes Autónomos", "Fine-tuning Propio", "Multi-model Swarms"]
        }
    ];

    if (needSlider) {
        needSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            sliderValue.textContent = val;

            const cat = categories.find(c => val <= c.max);
            if (cat) {
                validationCategory.textContent = cat.name;
                validationDesc.textContent = cat.desc;
                validationFeatures.innerHTML = cat.features.map(f => `<li>${f}</li>`).join('');
            }
        });
    }
})();

// ===== AI EXPERT CHAT LOGIC (Voice & Text) =====
(function initAIChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatBox = document.getElementById('chatBox');

    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatBox.classList.toggle('open');
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatBox.classList.remove('open');
        });
    }

    function addMessage(text, isUser = false) {
        const msg = document.createElement('div');
        msg.className = `msg ${isUser ? 'user-msg' : 'bot-msg'}`;
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    const expertResponses = [
        "Los agentes AI pueden automatizar hasta el 80% de tus tareas de soporte.",
        "Para implementar RAG necesitamos tus bases de conocimiento en formato vectorial.",
        "Sagar Labs V2 se especializa en Agentic AI usando LangChain y CrewAI.",
        "La integración MCP es la tendencia #1 para conectar modelos con herramientas locales.",
        "¡Excelente pregunta! Un agente autónomo puede tomar decisiones sin intervención humana constante."
    ];

    function botResponse(text) {
        setTimeout(() => {
            const response = expertResponses[Math.floor(Math.random() * expertResponses.length)];
            addMessage(response);
            speak(response);
        }, 800);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const text = chatInput.value.trim();
            if (text) {
                addMessage(text, true);
                chatInput.value = '';
                botResponse(text);
            }
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendBtn.click();
        });
    }

    // Voice Support (Speech to Text)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-MX';

        voiceBtn.addEventListener('click', () => {
            recognition.start();
            voiceBtn.classList.add('active');
        });

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            chatInput.value = text;
            voiceBtn.classList.remove('active');
            sendBtn.click();
        };

        recognition.onerror = () => voiceBtn.classList.remove('active');
        recognition.onend = () => voiceBtn.classList.remove('active');
    } else if (voiceBtn) {
        voiceBtn.style.display = 'none';
    }

    // Text to Speech
    function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-MX';
            utterance.rate = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    }
})();
