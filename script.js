// 8-bit Drag Animation
const canvas = document.getElementById('drag-game');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const PIXEL = 3; // Size of each "pixel"

    // Set canvas width to full window width
    function resizeCanvas() {
        canvas.width = window.innerWidth;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Colors matching the gold theme
    const GOLD = '#C9A227';
    const GOLD_LIGHT = '#E8D48A';
    const GOLD_DARK = '#8B7119';
    const SKIN = '#E8B89D';
    const SKIN_DARK = '#C4947D';
    const HAIR_DARK = '#4A3728';
    const HAIR_LIGHT = '#6B5344';
    const SHIRT1 = '#C9A227';
    const PANTS1 = '#2A2A2A';
    const SHIRT2 = '#8B7119';
    const PANTS2 = '#1A1A1A';

    let frame = 0;
    let walkCycle = 0;

    // Draw a single pixel
    function drawPixel(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
    }

    // Woman doing the dragging (facing right, pulling behind her)
    function drawDragger(x, y, walkFrame) {
        const legOffset = walkFrame % 2 === 0 ? 0 : 1;
        const armOffset = walkFrame % 2 === 0 ? 0 : -1;
        const bobOffset = walkFrame % 2 === 0 ? 0 : -1;

        // Hair (ponytail flowing behind to the left)
        drawPixel(x + 1, y + bobOffset, HAIR_DARK);
        drawPixel(x + 2, y + bobOffset, HAIR_DARK);
        drawPixel(x + 3, y + bobOffset, HAIR_DARK);
        drawPixel(x + 4, y + bobOffset, HAIR_DARK);
        drawPixel(x, y + 1 + bobOffset, HAIR_DARK);

        // Head (facing right)
        drawPixel(x + 1, y + 1 + bobOffset, HAIR_DARK);
        drawPixel(x + 2, y + 1 + bobOffset, SKIN);
        drawPixel(x + 3, y + 1 + bobOffset, SKIN);
        drawPixel(x + 1, y + 2 + bobOffset, SKIN);
        drawPixel(x + 2, y + 2 + bobOffset, SKIN);
        drawPixel(x + 3, y + 2 + bobOffset, SKIN);

        // Body (shirt)
        drawPixel(x + 1, y + 3 + bobOffset, SHIRT1);
        drawPixel(x + 2, y + 3 + bobOffset, SHIRT1);
        drawPixel(x + 3, y + 3 + bobOffset, SHIRT1);
        drawPixel(x + 1, y + 4 + bobOffset, SHIRT1);
        drawPixel(x + 2, y + 4 + bobOffset, SHIRT1);
        drawPixel(x + 3, y + 4 + bobOffset, SHIRT1);
        drawPixel(x + 2, y + 5 + bobOffset, SHIRT1);

        // Arms (reaching back to left to hold feet)
        drawPixel(x, y + 3 + bobOffset + armOffset, SKIN);
        drawPixel(x - 1, y + 4 + bobOffset + armOffset, SKIN);
        drawPixel(x - 2, y + 4 + bobOffset + armOffset, SKIN);

        // Legs (walking right)
        drawPixel(x + 1, y + 6, PANTS1);
        drawPixel(x + 3, y + 6, PANTS1);
        drawPixel(x + 1 - legOffset, y + 7, PANTS1);
        drawPixel(x + 3 + legOffset, y + 7, PANTS1);

        // Feet
        drawPixel(x - legOffset, y + 8, GOLD_DARK);
        drawPixel(x + 1 - legOffset, y + 8, GOLD_DARK);
        drawPixel(x + 3 + legOffset, y + 8, GOLD_DARK);
        drawPixel(x + 4 + legOffset, y + 8, GOLD_DARK);
    }

    // Woman being dragged (lying down, head to left, feet to right being held)
    function drawDragged(x, y, walkFrame) {
        const bounceOffset = walkFrame % 2 === 0 ? 0 : 1;
        const armWave = walkFrame % 4 < 2 ? 0 : 1;

        // Head (on left side, on ground)
        drawPixel(x, y + 4 + bounceOffset, SKIN);
        drawPixel(x + 1, y + 4 + bounceOffset, SKIN);
        drawPixel(x - 1, y + 5 + bounceOffset, HAIR_LIGHT);
        drawPixel(x, y + 5 + bounceOffset, HAIR_LIGHT);
        drawPixel(x + 1, y + 5 + bounceOffset, HAIR_LIGHT);

        // Arms trailing behind (to the left)
        drawPixel(x, y + 3 + bounceOffset - armWave, SKIN);
        drawPixel(x - 1, y + 2 + bounceOffset - armWave, SKIN);
        drawPixel(x, y + 6 + bounceOffset + armWave, SKIN);
        drawPixel(x - 1, y + 7 + bounceOffset + armWave, SKIN);

        // Body (on ground)
        drawPixel(x + 2, y + 4 + bounceOffset, SHIRT2);
        drawPixel(x + 3, y + 4 + bounceOffset, SHIRT2);
        drawPixel(x + 4, y + 4 + bounceOffset, SHIRT2);
        drawPixel(x + 2, y + 5 + bounceOffset, SHIRT2);
        drawPixel(x + 3, y + 5 + bounceOffset, SHIRT2);
        drawPixel(x + 4, y + 5 + bounceOffset, SHIRT2);

        // Legs
        drawPixel(x + 5, y + 4 + bounceOffset, PANTS2);
        drawPixel(x + 6, y + 4 + bounceOffset, PANTS2);
        drawPixel(x + 5, y + 5 + bounceOffset, PANTS2);
        drawPixel(x + 6, y + 5 + bounceOffset, PANTS2);
        drawPixel(x + 7, y + 4 + bounceOffset, PANTS2);
        drawPixel(x + 8, y + 4 + bounceOffset, PANTS2);
        drawPixel(x + 7, y + 5 + bounceOffset, PANTS2);
        drawPixel(x + 8, y + 5 + bounceOffset, PANTS2);

        // Feet (being held on right side near dragger)
        drawPixel(x + 9, y + 4 + bounceOffset, GOLD_DARK);
        drawPixel(x + 10, y + 4 + bounceOffset, GOLD_DARK);
        drawPixel(x + 9, y + 5 + bounceOffset, GOLD_DARK);
        drawPixel(x + 10, y + 5 + bounceOffset, GOLD_DARK);
    }

    // Ground line
    function drawGround() {
        ctx.fillStyle = GOLD_DARK;
        for (let i = 0; i < canvas.width / PIXEL; i++) {
            if (i % 3 !== 0) {
                drawPixel(i, 18, GOLD_DARK);
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw ground
        drawGround();

        // Calculate position (moving left to right across full width) - slower movement
        const totalWidth = Math.floor(canvas.width / PIXEL) + 40;
        const baseX = (Math.floor(frame / 3) % totalWidth) - 20;

        // Draw the scene - dragged person behind (left), dragger in front (right)
        drawDragged(baseX, 8, walkCycle);
        drawDragger(baseX + 13, 8, walkCycle);

        frame++;
        if (frame % 16 === 0) {
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
