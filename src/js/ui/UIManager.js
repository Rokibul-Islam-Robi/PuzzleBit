export class UIManager {
    constructor(game) {
        this.game = game;
        this.currentScreen = null;
        this.screens = {};
        
        this.initializeScreens();
    }

    initializeScreens() {
        this.screens = {
            'loading-screen': document.getElementById('loading-screen'),
            'main-menu': document.getElementById('main-menu'),
            'game-ui': document.getElementById('game-ui'),
            'pause-menu': document.getElementById('pause-menu'),
            'level-complete': document.getElementById('level-complete')
        };
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
            }
        });
        
        // Show target screen
        const targetScreen = this.screens[screenName];
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            this.currentScreen = screenName;
            
            // Add entrance animation
            this.addEntranceAnimation(targetScreen);
        }
    }

    addEntranceAnimation(screen) {
        // Reset transform
        screen.style.transform = 'translateY(20px)';
        screen.style.opacity = '0';
        
        // Animate in
        setTimeout(() => {
            screen.style.transition = 'all 0.5s ease-out';
            screen.style.transform = 'translateY(0)';
            screen.style.opacity = '1';
        }, 50);
    }

    updateGameStats(stats) {
        const scoreElement = document.querySelector('.score');
        const movesElement = document.querySelector('.moves');
        const timerElement = document.querySelector('.timer');
        
        if (scoreElement) {
            scoreElement.textContent = `Score: ${stats.score}`;
        }
        
        if (movesElement) {
            movesElement.textContent = `Moves: ${stats.moves}`;
        }
        
        if (timerElement) {
            timerElement.textContent = `Time: ${stats.time}`;
        }
    }

    updateLevelInfo(levelNumber, levelName) {
        const levelNumberElement = document.querySelector('.level-number');
        const levelNameElement = document.querySelector('.level-name');
        
        if (levelNumberElement) {
            levelNumberElement.textContent = `Level ${levelNumber}`;
        }
        
        if (levelNameElement) {
            levelNameElement.textContent = levelName;
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    getNotificationColor(type) {
        const colors = {
            info: 'linear-gradient(135deg, #4ecdc4, #45b7d1)',
            success: 'linear-gradient(135deg, #96ceb4, #4caf50)',
            warning: 'linear-gradient(135deg, #ffd700, #ff9800)',
            error: 'linear-gradient(135deg, #ff6b6b, #e91e63)'
        };
        
        return colors[type] || colors.info;
    }

    showHintEffect() {
        // Create hint visual effect
        const hintOverlay = document.createElement('div');
        hintOverlay.className = 'hint-overlay';
        hintOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(78, 205, 196, 0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.3s ease-out;
        `;
        
        document.body.appendChild(hintOverlay);
        
        // Animate in
        setTimeout(() => {
            hintOverlay.style.opacity = '1';
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            hintOverlay.style.opacity = '0';
            setTimeout(() => {
                if (hintOverlay.parentNode) {
                    hintOverlay.parentNode.removeChild(hintOverlay);
                }
            }, 300);
        }, 2000);
    }

    createParticleEffect(x, y, color = '#4ecdc4') {
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`, opacity: 0 }
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

    showVictoryEffect() {
        // Create victory celebration effect
        const victoryOverlay = document.createElement('div');
        victoryOverlay.className = 'victory-overlay';
        victoryOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
            pointer-events: none;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.5s ease-out;
        `;
        
        document.body.appendChild(victoryOverlay);
        
        // Animate in
        setTimeout(() => {
            victoryOverlay.style.opacity = '1';
        }, 100);
        
        // Create confetti effect
        this.createConfettiEffect();
        
        // Remove after animation
        setTimeout(() => {
            victoryOverlay.style.opacity = '0';
            setTimeout(() => {
                if (victoryOverlay.parentNode) {
                    victoryOverlay.parentNode.removeChild(victoryOverlay);
                }
            }, 500);
        }, 3000);
    }

    createConfettiEffect() {
        const confettiCount = 50;
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

    showLoadingProgress(progress, text) {
        const progressBar = document.querySelector('.loading-progress');
        const loadingText = document.querySelector('.loading-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (loadingText) {
            loadingText.textContent = text;
        }
    }

    showError(message) {
        this.showNotification(message, 'error', 5000);
    }

    showSuccess(message) {
        this.showNotification(message, 'success', 3000);
    }

    showWarning(message) {
        this.showNotification(message, 'warning', 4000);
    }

    // Button click effects
    addButtonClickEffect(button) {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    }

    // Add CSS for ripple animation
    addRippleStyles() {
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initialize() {
        this.addRippleStyles();
        
        // Add click effects to all buttons
        document.querySelectorAll('button').forEach(button => {
            this.addButtonClickEffect(button);
        });
    }
} 