import { GameEngine } from './engine/GameEngine.js';
import { UIManager } from './ui/UIManager.js';
import { AudioManager } from './audio/AudioManager.js';
import { LevelManager } from './levels/LevelManager.js';
import { ParticleSystem } from './effects/ParticleSystem.js';

class PuzzleBitGame {
    constructor() {
        this.levelManager = new LevelManager();
        this.uiManager = new UIManager(this);
        this.audioManager = new AudioManager();
        this.particleSystem = new ParticleSystem();
        
        // Initialize Game Engine (3D)
        this.engine = null;
        
        this.score = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.isPaused = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('🎮 Initializing PuzzleBit 3D Game...');
            
            // Initialize UI
            this.uiManager.initialize();
            
            // Setup global event listeners
            this.setupEventListeners();
            
            // Start loading sequence
            await this.startLoadingSequence();
            
        } catch (error) {
            console.error('❌ Game initialization failed:', error);
            this.uiManager.showError('Failed to initialize game. Please refresh the page.');
        }
    }

    async startLoadingSequence() {
        const loadingSteps = [
            { progress: 20, text: 'Loading 3D engine...' },
            { progress: 40, text: 'Initializing game mechanics...' },
            { progress: 60, text: 'Preparing colorful worlds...' },
            { progress: 80, text: 'Setting up levels...' },
            { progress: 100, text: 'Ready to play!' }
        ];

        for (const step of loadingSteps) {
            this.uiManager.showLoadingProgress(step.progress, step.text);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('✅ Loading complete, transitioning to main menu...');
        this.uiManager.showScreen('main-menu');
        this.audioManager.playMusic('menu');
    }

    setupEventListeners() {
        // Main Menu Buttons
        document.getElementById('play-btn')?.addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn')?.addEventListener('click', () => this.uiManager.showScreen('instructions-screen'));
        document.getElementById('back-to-menu-btn')?.addEventListener('click', () => this.uiManager.showScreen('main-menu'));
        
        // Game UI Buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'pause-btn') this.pauseGame();
            if (e.target.id === 'hint-btn') this.showHint();
        });

        // Pause Menu Buttons
        document.getElementById('resume-btn')?.addEventListener('click', () => this.resumeGame());
        document.getElementById('restart-level-btn')?.addEventListener('click', () => this.restartLevel());
        document.getElementById('main-menu-btn')?.addEventListener('click', () => this.returnToMenu());

        // Level Complete Buttons
        document.getElementById('next-level-btn')?.addEventListener('click', () => this.nextLevel());
        document.getElementById('replay-level-btn')?.addEventListener('click', () => this.restartLevel());
        document.getElementById('main-menu-complete-btn')?.addEventListener('click', () => this.returnToMenu());

        // Window Resize
        window.addEventListener('resize', () => {
            if (this.engine) this.engine.handleResize();
        });
    }

    startGame() {
        console.log('🚀 Starting Game...');
        this.uiManager.showScreen('game-ui');
        
        // Ensure we have a canvas for Three.js
        this.ensureCanvas();
        
        if (!this.engine) {
            this.engine = new GameEngine(this);
        }
        
        this.resetGameStats();
        this.loadLevel(this.levelManager.currentLevel);
        
        this.audioManager.playMusic('gameplay');
        this.particleSystem.startBackgroundParticles();
    }

    ensureCanvas() {
        if (!document.getElementById('game-canvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'game-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '-1';
            document.getElementById('game-container').appendChild(canvas);
        }
    }

    loadLevel(levelNumber) {
        const level = this.levelManager.getLevel(levelNumber);
        if (level) {
            this.engine.startLevel(levelNumber);
            this.uiManager.updateLevelInfo(levelNumber, level.name);
            this.startGameTimer();
        }
    }

    onPuzzleMove() {
        this.moves++;
        this.audioManager.playPuzzleMoveSound();
        this.updateStats();
    }

    onPuzzleRotated() {
        this.moves++;
        this.audioManager.playPuzzleRotateSound();
        this.updateStats();
    }

    onMatchFound(matches) {
        const points = matches.length * 100;
        this.score += points;
        this.audioManager.playSound('move');
        this.particleSystem.createScoreEffect(points);
        this.updateStats();
        
        // Check for level completion
        const level = this.levelManager.getCurrentLevel();
        if (this.score >= level.targetScore) {
            this.completeLevel();
        }
    }

    completeLevel() {
        this.stopGameTimer();
        const stats = this.levelManager.completeLevel(
            this.levelManager.currentLevel,
            this.score,
            this.gameTime,
            this.moves
        );
        
        document.getElementById('final-score').textContent = stats.score;
        document.getElementById('final-moves').textContent = stats.moves;
        document.getElementById('final-time').textContent = this.formatTime(stats.time);
        
        this.uiManager.showScreen('level-complete');
        this.audioManager.playVictorySequence();
        this.particleSystem.createCompletionEffect();
    }

    nextLevel() {
        if (this.levelManager.advanceToNextLevel()) {
            this.startGame();
        } else {
            this.uiManager.showNotification('All levels completed!', 'success');
            this.returnToMenu();
        }
    }

    restartLevel() {
        this.startGame();
    }

    pauseGame() {
        this.isPaused = true;
        this.uiManager.showScreen('pause-menu');
        this.audioManager.pauseMusic();
    }

    resumeGame() {
        this.isPaused = false;
        this.uiManager.showScreen('game-ui');
        this.audioManager.resumeMusic();
    }

    returnToMenu() {
        this.stopGameTimer();
        if (this.engine) this.engine.stop();
        this.uiManager.showScreen('main-menu');
        this.audioManager.playMusic('menu');
        this.particleSystem.stopBackgroundParticles();
    }

    showHint() {
        this.engine.showHint();
        this.audioManager.playHintSound();
    }

    resetGameStats() {
        this.score = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.updateStats();
    }

    updateStats() {
        this.uiManager.updateGameStats({
            score: this.score,
            moves: this.moves,
            time: this.formatTime(this.gameTime)
        });
    }

    startGameTimer() {
        this.stopGameTimer();
        this.gameTimer = setInterval(() => {
            if (!this.isPaused) {
                this.gameTime++;
                this.updateStats();
            }
        }, 1000);
    }

    stopGameTimer() {
        if (this.gameTimer) clearInterval(this.gameTimer);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    window.puzzleBitGame = new PuzzleBitGame();
});
