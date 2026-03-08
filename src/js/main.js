import { GameEngine } from './engine/GameEngine.js';
import { UIManager } from './ui/UIManager.js';
import { AudioManager } from './audio/AudioManager.js';
import { LevelManager } from './levels/LevelManager.js';
import { ParticleSystem } from './effects/ParticleSystem.js';

class PuzzleBitGame {
    constructor() {
        console.log('🏗️ Constructing PuzzleBitGame...');
        try {
            this.levelManager = new LevelManager();
            this.uiManager = new UIManager(this);
            this.audioManager = new AudioManager();
            this.particleSystem = new ParticleSystem();
            
            this.engine = null;
            this.score = 0;
            this.moves = 0;
            this.gameTime = 0;
            this.isPaused = false;
            
            // Start initialization
            this.init();
        } catch (error) {
            console.error('❌ Critical failure in constructor:', error);
            this.forceShowMenu();
        }
    }

    async init() {
        console.log('🎮 Initializing PuzzleBit 3D Game...');
        
        // Safety timeout: force menu after 10 seconds if loading hangs
        const loadingTimeout = setTimeout(() => {
            console.warn('⚠️ Initialization timed out, forcing menu...');
            this.forceShowMenu();
        }, 10000);

        try {
            // Initialize UI
            if (this.uiManager && this.uiManager.initialize) {
                this.uiManager.initialize();
            }
            
            // Setup global event listeners
            this.setupEventListeners();
            
            // Start loading sequence
            await this.startLoadingSequence();
            
            clearTimeout(loadingTimeout);
            console.log('✅ Game fully initialized');
        } catch (error) {
            console.error('❌ Game initialization failed:', error);
            clearTimeout(loadingTimeout);
            this.forceShowMenu();
            if (this.uiManager) {
                this.uiManager.showError('Game loaded with some issues. You can still try to play!');
            }
        }
    }

    forceShowMenu() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainMenu = document.getElementById('main-menu');
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (mainMenu) mainMenu.classList.remove('hidden');
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
            console.log(`⏳ Loading: ${step.text} (${step.progress}%)`);
            if (this.uiManager) {
                this.uiManager.showLoadingProgress(step.progress, step.text);
            }
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        console.log('✅ Loading sequence complete');
        if (this.uiManager) {
            this.uiManager.showScreen('main-menu');
        } else {
            this.forceShowMenu();
        }
        
        if (this.audioManager) {
            this.audioManager.playMusic('menu');
        }
    }

    setupEventListeners() {
        console.log('🎧 Setting up event listeners...');
        // Main Menu Buttons
        document.getElementById('play-btn')?.addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn')?.addEventListener('click', () => this.uiManager?.showScreen('instructions-screen'));
        document.getElementById('back-to-menu-btn')?.addEventListener('click', () => this.uiManager?.showScreen('main-menu'));
        
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
        this.uiManager?.showScreen('game-ui');
        
        this.ensureCanvas();
        
        try {
            if (!this.engine) {
                this.engine = new GameEngine(this);
            }
            
            this.resetGameStats();
            this.loadLevel(this.levelManager.currentLevel);
            
            this.audioManager?.playMusic('gameplay');
            this.particleSystem?.startBackgroundParticles();
        } catch (error) {
            console.error('❌ Failed to start game engine:', error);
            alert('Sorry, your browser might not support the 3D features of this game.');
            this.returnToMenu();
        }
    }

    ensureCanvas() {
        if (!document.getElementById('game-canvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'game-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '-1';
            const container = document.getElementById('game-container') || document.body;
            container.appendChild(canvas);
        }
    }

    loadLevel(levelNumber) {
        const level = this.levelManager.getLevel(levelNumber);
        if (level && this.engine) {
            this.engine.startLevel(levelNumber);
            this.uiManager?.updateLevelInfo(levelNumber, level.name);
            this.startGameTimer();
        }
    }

    onPuzzleMove() {
        this.moves++;
        this.audioManager?.playPuzzleMoveSound();
        this.updateStats();
    }

    onPuzzleRotated() {
        this.moves++;
        this.audioManager?.playPuzzleRotateSound();
        this.updateStats();
    }

    onMatchFound(matches) {
        const points = matches.length * 100;
        this.score += points;
        this.audioManager?.playSound('move');
        this.particleSystem?.createScoreEffect(points);
        this.updateStats();
        
        const level = this.levelManager.getCurrentLevel();
        if (level && this.score >= level.targetScore) {
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
        
        const scoreEl = document.getElementById('final-score');
        const movesEl = document.getElementById('final-moves');
        const timeEl = document.getElementById('final-time');
        
        if (scoreEl) scoreEl.textContent = stats.score;
        if (movesEl) movesEl.textContent = stats.moves;
        if (timeEl) timeEl.textContent = this.formatTime(stats.time);
        
        this.uiManager?.showScreen('level-complete');
        this.audioManager?.playVictorySequence();
        this.particleSystem?.createCompletionEffect();
    }

    nextLevel() {
        if (this.levelManager.advanceToNextLevel()) {
            this.startGame();
        } else {
            this.uiManager?.showNotification('All levels completed!', 'success');
            this.returnToMenu();
        }
    }

    restartLevel() {
        this.startGame();
    }

    pauseGame() {
        this.isPaused = true;
        this.uiManager?.showScreen('pause-menu');
        this.audioManager?.pauseMusic();
    }

    resumeGame() {
        this.isPaused = false;
        this.uiManager?.showScreen('game-ui');
        this.audioManager?.resumeMusic();
    }

    returnToMenu() {
        this.stopGameTimer();
        if (this.engine) this.engine.stop();
        this.uiManager?.showScreen('main-menu');
        this.audioManager?.playMusic('menu');
        this.particleSystem?.stopBackgroundParticles();
    }

    showHint() {
        if (this.engine) {
            this.engine.showHint();
            this.audioManager?.playHintSound();
        }
    }

    resetGameStats() {
        this.score = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.updateStats();
    }

    updateStats() {
        if (this.uiManager) {
            this.uiManager.updateGameStats({
                score: this.score,
                moves: this.moves,
                time: this.formatTime(this.gameTime)
            });
        }
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
    try {
        window.puzzleBitGame = new PuzzleBitGame();
    } catch (e) {
        console.error('Fatal error during game startup:', e);
    }
});
