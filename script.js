// 8-bit Drag Animation (2x detail version)
const canvas = document.getElementById('drag-game');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const PIXEL = 2; // Smaller pixels for more detail

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = 80;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Colors matching the gold theme
    const GOLD = '#C9A227';
    const GOLD_LIGHT = '#E8D48A';
    const GOLD_DARK = '#8B7119';
    const SKIN = '#E8B89D';
    const SKIN_DARK = '#C4947D';
    const SKIN_LIGHT = '#F5D5C8';
    const HAIR_DARK = '#4A3728';
    const HAIR_LIGHT = '#6B5344';
    const HAIR_MID = '#5A4233';
    const SHIRT1 = '#C9A227';
    const SHIRT1_DARK = '#A88820';
    const SHIRT1_LIGHT = '#D4B44A';
    const PANTS1 = '#2A2A2A';
    const PANTS1_DARK = '#1A1A1A';
    const SHIRT2 = '#8B7119';
    const SHIRT2_DARK = '#6B5510';
    const PANTS2 = '#1A1A1A';
    const PANTS2_DARK = '#0A0A0A';
    const LIPS = '#C07070';
    const EYE = '#2A2A2A';
    const SHOE = '#5A4A3A';
    const SHOE_SOLE = '#3A2A1A';

    let frame = 0;
    let walkCycle = 0;

    // Draw a single pixel
    function drawPixel(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
    }

    // Woman doing the dragging (facing right, pulling behind her) - 2x detail
    function drawDragger(x, y, walkFrame) {
        const legOffset = walkFrame % 2 === 0 ? 0 : 2;
        const armOffset = walkFrame % 2 === 0 ? 0 : -1;
        const bobOffset = walkFrame % 2 === 0 ? 0 : -1;

        // Hair (ponytail flowing behind to the left)
        drawPixel(x + 2, y + bobOffset, HAIR_DARK);
        drawPixel(x + 3, y + bobOffset, HAIR_DARK);
        drawPixel(x + 4, y + bobOffset, HAIR_MID);
        drawPixel(x + 5, y + bobOffset, HAIR_DARK);
        drawPixel(x + 6, y + bobOffset, HAIR_DARK);
        drawPixel(x + 7, y + bobOffset, HAIR_MID);
        drawPixel(x + 1, y + 1 + bobOffset, HAIR_DARK);
        drawPixel(x + 2, y + 1 + bobOffset, HAIR_DARK);
        drawPixel(x, y + 2 + bobOffset, HAIR_MID);
        drawPixel(x - 1, y + 2 + bobOffset, HAIR_DARK);
        drawPixel(x - 2, y + 3 + bobOffset, HAIR_DARK);

        // Head top hair
        drawPixel(x + 3, y + 1 + bobOffset, HAIR_DARK);
        drawPixel(x + 4, y + 1 + bobOffset, HAIR_MID);
        drawPixel(x + 5, y + 1 + bobOffset, HAIR_DARK);
        drawPixel(x + 6, y + 1 + bobOffset, HAIR_DARK);

        // Face (facing right)
        drawPixel(x + 3, y + 2 + bobOffset, HAIR_DARK);
        drawPixel(x + 4, y + 2 + bobOffset, SKIN);
        drawPixel(x + 5, y + 2 + bobOffset, SKIN);
        drawPixel(x + 6, y + 2 + bobOffset, SKIN_LIGHT);
        drawPixel(x + 7, y + 2 + bobOffset, SKIN);
        drawPixel(x + 3, y + 3 + bobOffset, HAIR_DARK);
        drawPixel(x + 4, y + 3 + bobOffset, SKIN);
        drawPixel(x + 5, y + 3 + bobOffset, SKIN_LIGHT);
        drawPixel(x + 6, y + 3 + bobOffset, SKIN);
        drawPixel(x + 7, y + 3 + bobOffset, SKIN);
        // Eye
        drawPixel(x + 6, y + 3 + bobOffset, EYE);
        // Lower face
        drawPixel(x + 3, y + 4 + bobOffset, SKIN);
        drawPixel(x + 4, y + 4 + bobOffset, SKIN);
        drawPixel(x + 5, y + 4 + bobOffset, SKIN);
        drawPixel(x + 6, y + 4 + bobOffset, SKIN_DARK);
        // Lips
        drawPixel(x + 7, y + 4 + bobOffset, LIPS);
        // Chin/neck
        drawPixel(x + 4, y + 5 + bobOffset, SKIN);
        drawPixel(x + 5, y + 5 + bobOffset, SKIN_DARK);

        // Body (shirt) - more defined
        drawPixel(x + 3, y + 6 + bobOffset, SHIRT1);
        drawPixel(x + 4, y + 6 + bobOffset, SHIRT1_LIGHT);
        drawPixel(x + 5, y + 6 + bobOffset, SHIRT1);
        drawPixel(x + 6, y + 6 + bobOffset, SHIRT1_DARK);
        drawPixel(x + 3, y + 7 + bobOffset, SHIRT1);
        drawPixel(x + 4, y + 7 + bobOffset, SHIRT1_LIGHT);
        drawPixel(x + 5, y + 7 + bobOffset, SHIRT1);
        drawPixel(x + 6, y + 7 + bobOffset, SHIRT1_DARK);
        drawPixel(x + 3, y + 8 + bobOffset, SHIRT1_DARK);
        drawPixel(x + 4, y + 8 + bobOffset, SHIRT1);
        drawPixel(x + 5, y + 8 + bobOffset, SHIRT1_LIGHT);
        drawPixel(x + 6, y + 8 + bobOffset, SHIRT1);
        drawPixel(x + 4, y + 9 + bobOffset, SHIRT1_DARK);
        drawPixel(x + 5, y + 9 + bobOffset, SHIRT1);
        drawPixel(x + 6, y + 9 + bobOffset, SHIRT1);

        // Arms (reaching back to hold feet) with hands
        drawPixel(x + 2, y + 6 + bobOffset + armOffset, SKIN);
        drawPixel(x + 1, y + 7 + bobOffset + armOffset, SKIN);
        drawPixel(x, y + 7 + bobOffset + armOffset, SKIN_DARK);
        drawPixel(x - 1, y + 8 + bobOffset + armOffset, SKIN);
        drawPixel(x - 2, y + 8 + bobOffset + armOffset, SKIN);
        drawPixel(x - 3, y + 8 + bobOffset + armOffset, SKIN_DARK);
        // Hand/fingers
        drawPixel(x - 4, y + 8 + bobOffset + armOffset, SKIN);
        drawPixel(x - 4, y + 9 + bobOffset + armOffset, SKIN_DARK);

        // Legs (walking right) - more defined
        drawPixel(x + 3, y + 10, PANTS1);
        drawPixel(x + 4, y + 10, PANTS1_DARK);
        drawPixel(x + 5, y + 10, PANTS1);
        drawPixel(x + 6, y + 10, PANTS1);
        drawPixel(x + 3 - legOffset, y + 11, PANTS1);
        drawPixel(x + 4 - legOffset, y + 11, PANTS1_DARK);
        drawPixel(x + 5 + legOffset, y + 11, PANTS1);
        drawPixel(x + 6 + legOffset, y + 11, PANTS1);
        drawPixel(x + 3 - legOffset, y + 12, PANTS1);
        drawPixel(x + 4 - legOffset, y + 12, PANTS1);
        drawPixel(x + 5 + legOffset, y + 12, PANTS1_DARK);
        drawPixel(x + 6 + legOffset, y + 12, PANTS1);
        drawPixel(x + 3 - legOffset, y + 13, PANTS1_DARK);
        drawPixel(x + 4 - legOffset, y + 13, PANTS1);
        drawPixel(x + 5 + legOffset, y + 13, PANTS1);
        drawPixel(x + 6 + legOffset, y + 13, PANTS1_DARK);

        // Feet/shoes
        drawPixel(x + 2 - legOffset, y + 14, SHOE);
        drawPixel(x + 3 - legOffset, y + 14, SHOE);
        drawPixel(x + 4 - legOffset, y + 14, SHOE);
        drawPixel(x + 5 + legOffset, y + 14, SHOE);
        drawPixel(x + 6 + legOffset, y + 14, SHOE);
        drawPixel(x + 7 + legOffset, y + 14, SHOE);
        // Soles
        drawPixel(x + 2 - legOffset, y + 15, SHOE_SOLE);
        drawPixel(x + 3 - legOffset, y + 15, SHOE_SOLE);
        drawPixel(x + 4 - legOffset, y + 15, SHOE_SOLE);
        drawPixel(x + 5 + legOffset, y + 15, SHOE_SOLE);
        drawPixel(x + 6 + legOffset, y + 15, SHOE_SOLE);
        drawPixel(x + 7 + legOffset, y + 15, SHOE_SOLE);
    }

    // Woman being dragged (lying down, head to left, feet to right being held) - 2x detail
    function drawDragged(x, y, walkFrame) {
        const bounceOffset = walkFrame % 2 === 0 ? 0 : 1;
        const armWave = walkFrame % 4 < 2 ? 0 : 1;

        // Hair (trailing on ground to the left)
        drawPixel(x - 4, y + 7 + bounceOffset, HAIR_LIGHT);
        drawPixel(x - 3, y + 7 + bounceOffset, HAIR_MID);
        drawPixel(x - 3, y + 8 + bounceOffset, HAIR_LIGHT);
        drawPixel(x - 2, y + 8 + bounceOffset, HAIR_LIGHT);
        drawPixel(x - 2, y + 9 + bounceOffset, HAIR_MID);
        drawPixel(x - 1, y + 9 + bounceOffset, HAIR_LIGHT);
        drawPixel(x - 1, y + 10 + bounceOffset, HAIR_LIGHT);
        drawPixel(x, y + 10 + bounceOffset, HAIR_MID);

        // Head (on left side, face up)
        drawPixel(x, y + 7 + bounceOffset, HAIR_LIGHT);
        drawPixel(x + 1, y + 7 + bounceOffset, HAIR_LIGHT);
        drawPixel(x + 2, y + 7 + bounceOffset, HAIR_MID);
        drawPixel(x, y + 8 + bounceOffset, SKIN);
        drawPixel(x + 1, y + 8 + bounceOffset, SKIN_LIGHT);
        drawPixel(x + 2, y + 8 + bounceOffset, SKIN);
        drawPixel(x + 3, y + 8 + bounceOffset, HAIR_LIGHT);
        // Eyes closed (being dragged)
        drawPixel(x + 1, y + 8 + bounceOffset, EYE);
        drawPixel(x, y + 9 + bounceOffset, SKIN);
        drawPixel(x + 1, y + 9 + bounceOffset, SKIN);
        drawPixel(x + 2, y + 9 + bounceOffset, LIPS);
        drawPixel(x + 3, y + 9 + bounceOffset, SKIN_DARK);
        // Chin
        drawPixel(x + 1, y + 10 + bounceOffset, SKIN);
        drawPixel(x + 2, y + 10 + bounceOffset, SKIN_DARK);

        // Arms trailing behind (flailing)
        drawPixel(x - 1, y + 5 + bounceOffset - armWave, SKIN);
        drawPixel(x - 2, y + 4 + bounceOffset - armWave, SKIN);
        drawPixel(x - 3, y + 3 + bounceOffset - armWave, SKIN_DARK);
        drawPixel(x - 4, y + 3 + bounceOffset - armWave, SKIN);
        drawPixel(x - 1, y + 12 + bounceOffset + armWave, SKIN);
        drawPixel(x - 2, y + 13 + bounceOffset + armWave, SKIN);
        drawPixel(x - 3, y + 14 + bounceOffset + armWave, SKIN_DARK);
        drawPixel(x - 4, y + 14 + bounceOffset + armWave, SKIN);

        // Body (on ground) - horizontal torso with shading
        drawPixel(x + 4, y + 7 + bounceOffset, SHIRT2);
        drawPixel(x + 5, y + 7 + bounceOffset, SHIRT2);
        drawPixel(x + 6, y + 7 + bounceOffset, SHIRT2_DARK);
        drawPixel(x + 7, y + 7 + bounceOffset, SHIRT2);
        drawPixel(x + 8, y + 7 + bounceOffset, SHIRT2);
        drawPixel(x + 4, y + 8 + bounceOffset, SHIRT2_DARK);
        drawPixel(x + 5, y + 8 + bounceOffset, SHIRT2);
        drawPixel(x + 6, y + 8 + bounceOffset, SHIRT2);
        drawPixel(x + 7, y + 8 + bounceOffset, SHIRT2_DARK);
        drawPixel(x + 8, y + 8 + bounceOffset, SHIRT2);
        drawPixel(x + 4, y + 9 + bounceOffset, SHIRT2);
        drawPixel(x + 5, y + 9 + bounceOffset, SHIRT2_DARK);
        drawPixel(x + 6, y + 9 + bounceOffset, SHIRT2);
        drawPixel(x + 7, y + 9 + bounceOffset, SHIRT2);
        drawPixel(x + 8, y + 9 + bounceOffset, SHIRT2_DARK);
        drawPixel(x + 4, y + 10 + bounceOffset, SHIRT2);
        drawPixel(x + 5, y + 10 + bounceOffset, SHIRT2);
        drawPixel(x + 6, y + 10 + bounceOffset, SHIRT2_DARK);
        drawPixel(x + 7, y + 10 + bounceOffset, SHIRT2);
        drawPixel(x + 8, y + 10 + bounceOffset, SHIRT2);

        // Hips transition
        drawPixel(x + 9, y + 8 + bounceOffset, PANTS2);
        drawPixel(x + 9, y + 9 + bounceOffset, PANTS2_DARK);

        // Legs (horizontal)
        drawPixel(x + 10, y + 7 + bounceOffset, PANTS2);
        drawPixel(x + 11, y + 7 + bounceOffset, PANTS2_DARK);
        drawPixel(x + 12, y + 7 + bounceOffset, PANTS2);
        drawPixel(x + 13, y + 7 + bounceOffset, PANTS2);
        drawPixel(x + 10, y + 8 + bounceOffset, PANTS2_DARK);
        drawPixel(x + 11, y + 8 + bounceOffset, PANTS2);
        drawPixel(x + 12, y + 8 + bounceOffset, PANTS2_DARK);
        drawPixel(x + 13, y + 8 + bounceOffset, PANTS2);
        drawPixel(x + 10, y + 9 + bounceOffset, PANTS2);
        drawPixel(x + 11, y + 9 + bounceOffset, PANTS2);
        drawPixel(x + 12, y + 9 + bounceOffset, PANTS2);
        drawPixel(x + 13, y + 9 + bounceOffset, PANTS2_DARK);
        drawPixel(x + 10, y + 10 + bounceOffset, PANTS2);
        drawPixel(x + 11, y + 10 + bounceOffset, PANTS2_DARK);
        drawPixel(x + 12, y + 10 + bounceOffset, PANTS2);
        drawPixel(x + 13, y + 10 + bounceOffset, PANTS2);
        // Lower legs
        drawPixel(x + 14, y + 7 + bounceOffset, PANTS2);
        drawPixel(x + 15, y + 7 + bounceOffset, PANTS2_DARK);
        drawPixel(x + 16, y + 7 + bounceOffset, PANTS2);
        drawPixel(x + 14, y + 8 + bounceOffset, PANTS2_DARK);
        drawPixel(x + 15, y + 8 + bounceOffset, PANTS2);
        drawPixel(x + 16, y + 8 + bounceOffset, PANTS2);
        drawPixel(x + 14, y + 9 + bounceOffset, PANTS2);
        drawPixel(x + 15, y + 9 + bounceOffset, PANTS2);
        drawPixel(x + 16, y + 9 + bounceOffset, PANTS2_DARK);
        drawPixel(x + 14, y + 10 + bounceOffset, PANTS2);
        drawPixel(x + 15, y + 10 + bounceOffset, PANTS2_DARK);
        drawPixel(x + 16, y + 10 + bounceOffset, PANTS2);

        // Feet (being held - shoes sideways)
        drawPixel(x + 17, y + 7 + bounceOffset, SHOE);
        drawPixel(x + 18, y + 7 + bounceOffset, SHOE);
        drawPixel(x + 17, y + 8 + bounceOffset, SHOE_SOLE);
        drawPixel(x + 18, y + 8 + bounceOffset, SHOE_SOLE);
        drawPixel(x + 19, y + 8 + bounceOffset, SHOE);
        drawPixel(x + 17, y + 9 + bounceOffset, SHOE);
        drawPixel(x + 18, y + 9 + bounceOffset, SHOE);
        drawPixel(x + 17, y + 10 + bounceOffset, SHOE_SOLE);
        drawPixel(x + 18, y + 10 + bounceOffset, SHOE_SOLE);
        drawPixel(x + 19, y + 10 + bounceOffset, SHOE);
    }

    // Ground line with texture
    function drawGround() {
        for (let i = 0; i < canvas.width / PIXEL; i++) {
            if (i % 4 !== 0) {
                drawPixel(i, 35, GOLD_DARK);
            }
            if (i % 6 === 0) {
                drawPixel(i, 34, GOLD);
            }
        }
    }

    // Dust particles
    function drawDust(baseX, walkFrame) {
        if (walkFrame % 2 === 0) {
            drawPixel(baseX - 5, 32, GOLD_LIGHT);
            drawPixel(baseX - 7, 31, GOLD);
            drawPixel(baseX - 3, 33, GOLD_LIGHT);
        } else {
            drawPixel(baseX - 6, 31, GOLD);
            drawPixel(baseX - 4, 32, GOLD_LIGHT);
            drawPixel(baseX - 8, 33, GOLD);
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw ground
        drawGround();

        // Calculate position (moving left to right across full width)
        const totalWidth = Math.floor(canvas.width / PIXEL) + 60;
        const baseX = (Math.floor(frame / 3) % totalWidth) - 30;

        // Draw dust particles behind the dragged person
        drawDust(baseX, walkCycle);

        // Draw the scene - dragged person behind (left), dragger in front (right)
        drawDragged(baseX, 16, walkCycle);
        drawDragger(baseX + 24, 16, walkCycle);

        frame++;
        if (frame % 12 === 0) {
            walkCycle++;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Add fade-in styles dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Cast card hover effect with tilt
document.querySelectorAll('.cast-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Trailer placeholder click handler
const trailerPlaceholder = document.querySelector('.trailer-placeholder');
if (trailerPlaceholder) {
    trailerPlaceholder.addEventListener('click', () => {
        // Placeholder for future trailer embed
        console.log('Trailer coming soon!');
    });
}

// Parallax effect on hero
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});
