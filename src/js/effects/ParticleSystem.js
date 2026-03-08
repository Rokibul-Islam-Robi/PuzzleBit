import * as THREE from 'three';
import { gsap } from 'gsap';

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.backgroundParticles = null;
        this.isActive = false;
    }

    createScoreEffect(points, position = null) {
        const particleCount = Math.min(points / 100, 20);
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'score-particle';
            particle.textContent = `+${Math.floor(points / particleCount)}`;
            particle.style.cssText = `
                position: absolute;
                color: #4ecdc4;
                font-weight: bold;
                font-size: 1.2rem;
                pointer-events: none;
                z-index: 1000;
                text-shadow: 0 0 10px #4ecdc4;
            `;
            
            // Position particle
            if (position) {
                particle.style.left = `${position.x}px`;
                particle.style.top = `${position.y}px`;
            } else {
                particle.style.left = `${Math.random() * window.innerWidth}px`;
                particle.style.top = `${Math.random() * window.innerHeight}px`;
            }
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            // Animate particle
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            const endX = parseFloat(particle.style.left) + Math.cos(angle) * distance;
            const endY = parseFloat(particle.style.top) + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${endX - parseFloat(particle.style.left)}px, ${endY - parseFloat(particle.style.top)}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 1500,
                easing: 'ease-out'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }

    createCompletionEffect() {
        // Create celebration particles
        const particleCount = 50;
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1001;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px currentColor;
            `;
            
            document.body.appendChild(particle);
            
            // Animate particle explosion
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 200 + Math.random() * 200;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(0)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(1)`, 
                    opacity: 1 
                },
                { 
                    transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 2000,
                easing: 'ease-out'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }

    startBackgroundParticles() {
        if (this.backgroundParticles) return;
        
        this.backgroundParticles = [];
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: rgba(78, 205, 196, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
            `;
            
            document.body.appendChild(particle);
            this.backgroundParticles.push(particle);
            
            // Animate background particle
            this.animateBackgroundParticle(particle);
        }
    }

    animateBackgroundParticle(particle) {
        const duration = 10000 + Math.random() * 10000;
        const startY = parseFloat(particle.style.top);
        const endY = -10;
        
        particle.animate([
            { transform: 'translateY(0)', opacity: 0.6 },
            { transform: `translateY(${endY - startY}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => {
            // Reset particle to bottom
            particle.style.top = `${window.innerHeight + 10}px`;
            particle.style.left = `${Math.random() * window.innerWidth}px`;
            
            // Continue animation
            this.animateBackgroundParticle(particle);
        };
    }

    stopBackgroundParticles() {
        if (this.backgroundParticles) {
            this.backgroundParticles.forEach(particle => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            });
            this.backgroundParticles = null;
        }
    }

    createHintEffect(targetElement) {
        if (!targetElement) return;
        
        const rect = targetElement.getBoundingClientRect();
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #4ecdc4;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                box-shadow: 0 0 8px #4ecdc4;
            `;
            
            document.body.appendChild(particle);
            
            // Animate hint particle
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50;
            const endX = rect.left + rect.width / 2 + Math.cos(angle) * distance;
            const endY = rect.top + rect.height / 2 + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(calc(-50% + ${endX - (rect.left + rect.width / 2)}px), calc(-50% + ${endY - (rect.top + rect.height / 2)}px)) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }

    createVictoryEffect() {
        // Create confetti effect
        const confettiCount = 100;
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * window.innerWidth}px;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                z-index: 1001;
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            document.body.appendChild(confetti);
            
            // Animate confetti falling
            const duration = 3000 + Math.random() * 2000;
            const endX = Math.random() * window.innerWidth;
            const endY = window.innerHeight + 10;
            
            confetti.animate([
                { transform: `translate(0, 0) rotate(${Math.random() * 360}deg)` },
                { transform: `translate(${endX - parseFloat(confetti.style.left)}px, ${endY}px) rotate(${Math.random() * 720}deg)` }
            ], {
                duration: duration,
                easing: 'ease-in'
            }).onfinish = () => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            };
        }
    }

    createMoveEffect(position) {
        const particleCount = 6;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: #4ecdc4;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${position.x}px;
                top: ${position.y}px;
            `;
            
            document.body.appendChild(particle);
            
            // Animate move particle
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 30;
            const endX = position.x + Math.cos(angle) * distance;
            const endY = position.y + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: `translate(${endX - position.x}px, ${endY - position.y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-out'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }

    createErrorEffect(position) {
        const particleCount = 4;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ff6b6b;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${position.x}px;
                top: ${position.y}px;
                box-shadow: 0 0 8px #ff6b6b;
            `;
            
            document.body.appendChild(particle);
            
            // Animate error particle
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 40;
            const endX = position.x + Math.cos(angle) * distance;
            const endY = position.y + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: `translate(${endX - position.x}px, ${endY - position.y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 400,
                easing: 'ease-out'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }

    createLevelTransitionEffect() {
        // Create transition particles
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: #4ecdc4;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                box-shadow: 0 0 12px #4ecdc4;
            `;
            
            document.body.appendChild(particle);
            
            // Animate transition particle
            const duration = 1000 + Math.random() * 1000;
            const endX = Math.random() * window.innerWidth;
            const endY = Math.random() * window.innerHeight;
            
            particle.animate([
                { transform: 'scale(0)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 },
                { transform: `translate(${endX - parseFloat(particle.style.left)}px, ${endY - parseFloat(particle.style.top)}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'ease-in-out'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }

    createButtonClickEffect(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: #4ecdc4;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
            `;
            
            document.body.appendChild(particle);
            
            // Animate button click particle
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 30;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'scale(0)', opacity: 1 },
                { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 300,
                easing: 'ease-out'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }

    destroy() {
        // Clean up all particles
        this.stopBackgroundParticles();
        
        // Remove any remaining particles
        document.querySelectorAll('.score-particle, .particle').forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
    }
} 