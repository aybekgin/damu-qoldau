// Particles Animation for Hero Section
'use strict';

class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        this.container.appendChild(this.canvas);
        this.resize();
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Recreate particles on resize
        this.createParticles();
    }
    
    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.mousePosition.x = -1000;
            this.mousePosition.y = -1000;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.update(this.canvas.width, this.canvas.height, this.mousePosition);
            particle.draw(this.ctx);
        }
        
        // Draw connections
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (maxDistance - distance) / maxDistance * 0.2;
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 3 + 1;
        this.originalRadius = this.radius;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.originalOpacity = this.opacity;
    }
    
    update(canvasWidth, canvasHeight, mousePosition) {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off walls
        if (this.x < 0 || this.x > canvasWidth) {
            this.vx = -this.vx;
        }
        if (this.y < 0 || this.y > canvasHeight) {
            this.vy = -this.vy;
        }
        
        // Keep particles in bounds
        this.x = Math.max(0, Math.min(canvasWidth, this.x));
        this.y = Math.max(0, Math.min(canvasHeight, this.y));
        
        // Mouse interaction
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            
            // Repel particle
            this.vx -= Math.cos(angle) * force * 0.01;
            this.vy -= Math.sin(angle) * force * 0.01;
            
            // Increase size and opacity
            this.radius = this.originalRadius * (1 + force * 0.5);
            this.opacity = Math.min(1, this.originalOpacity * (1 + force));
        } else {
            // Return to original size
            this.radius += (this.originalRadius - this.radius) * 0.1;
            this.opacity += (this.originalOpacity - this.opacity) * 0.1;
        }
        
        // Add some friction
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = 'rgba(37, 99, 235, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Floating elements animation
class FloatingElements {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.createFloatingElements();
        this.animate();
    }
    
    createFloatingElements() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const shapes = ['💰', '📊', '💼', '🎯', '⭐', '🚀'];
        
        for (let i = 0; i < 6; i++) {
            const element = document.createElement('div');
            element.textContent = shapes[i];
            element.style.position = 'absolute';
            element.style.fontSize = Math.random() * 20 + 20 + 'px';
            element.style.opacity = '0.1';
            element.style.pointerEvents = 'none';
            element.style.zIndex = '0';
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            element.style.transform = 'translate(-50%, -50%)';
            
            hero.appendChild(element);
            
            this.elements.push({
                el: element,
                speed: Math.random() * 0.5 + 0.2,
                direction: Math.random() * Math.PI * 2
            });
        }
    }
    
    animate() {
        this.elements.forEach(item => {
            const rect = item.el.getBoundingClientRect();
            const parentRect = item.el.parentElement.getBoundingClientRect();
            
            let currentLeft = parseFloat(item.el.style.left);
            let currentTop = parseFloat(item.el.style.top);
            
            currentLeft += Math.cos(item.direction) * item.speed;
            currentTop += Math.sin(item.direction) * item.speed;
            
            // Wrap around
            if (currentLeft > 100) currentLeft = -10;
            if (currentLeft < -10) currentLeft = 100;
            if (currentTop > 100) currentTop = -10;
            if (currentTop < -10) currentTop = 100;
            
            item.el.style.left = currentLeft + '%';
            item.el.style.top = currentTop + '%';
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle system
    const particleSystem = new ParticleSystem('particles');
    
    // Initialize floating elements
    const floatingElements = new FloatingElements();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        if (particleSystem) {
            particleSystem.destroy();
        }
    });
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, FloatingElements };
}