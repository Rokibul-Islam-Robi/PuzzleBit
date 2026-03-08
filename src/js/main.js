import { UIManager } from './ui/UIManager.js';
import { AudioManager } from './audio/AudioManager.js';
import { LevelManager } from './levels/LevelManager.js';
import { ParticleSystem } from './effects/ParticleSystem.js';
import { gsap } from 'gsap';

class PuzzleBitGame {
    constructor() {
        this.levelManager = new LevelManager();
        this.uiManager = new UIManager(this);
        this.audioManager = new AudioManager();
        this.particleSystem = new ParticleSystem();
        
        this.score = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.isPaused = false;
        this.isAnimating = false;
        
        this.grid = [];
        this.selectedTile = null;
        this.gridSize = 8;
        
        this.colors = [
            '#FF6B6B', // Red
            '#4ECDC4', // Teal
            '#45B7D1', // Blue
            '#96CEB4', // Green
            '#FFEAA7', // Yellow
            '#DDA0DD', // Purple
            '#FF8C42'  // Orange
        ];

        this.init();
    }

    init() {
        console.log('✨ Initializing Beautiful 2D PuzzleBit...');
        this.createAnimatedBackground();
        this.setupEventListeners();
        this.startLoadingSequence();
    }

    createAnimatedBackground() {
        const bg = document.createElement('div');
        bg.className = 'puzzle-bg';
        document.body.appendChild(bg);

        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            shape.className = 'bg-shape';
            const size = 50 + Math.random() * 100;
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.animationDelay = `${Math.random() * 20}s`;
            shape.style.animationDuration = `${15 + Math.random() * 10}s`;
            bg.appendChild(shape);
        }
    }

    async startLoadingSequence() {
        this.uiManager.showScreen('loading-screen');
        const steps = ['Loading assets...', 'Generating puzzles...', 'Ready!'];
        
        for (let i = 0; i < steps.length; i++) {
            this.uiManager.showLoadingProgress((i + 1) * 33, steps[i]);
            await new Promise(r => setTimeout(r, 600));
        }

        this.uiManager.showScreen('main-menu');
        this.audioManager.playMusic('menu');
    }

    setupEventListeners() {
        document.getElementById('play-btn')?.addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn')?.addEventListener('click', () => this.uiManager.showScreen('instructions-screen'));
        document.getElementById('back-to-menu-btn')?.addEventListener('click', () => this.uiManager.showScreen('main-menu'));
        
        document.getElementById('resume-btn')?.addEventListener('click', () => this.resumeGame());
        document.getElementById('restart-level-btn')?.addEventListener('click', () => this.startGame());
        document.getElementById('main-menu-btn')?.addEventListener('click', () => this.returnToMenu());

        document.getElementById('next-level-btn')?.addEventListener('click', () => this.nextLevel());
        document.getElementById('replay-level-btn')?.addEventListener('click', () => this.startGame());
        document.getElementById('main-menu-complete-btn')?.addEventListener('click', () => this.returnToMenu());
    }

    startGame() {
        this.uiManager.showScreen('game-ui');
        this.resetGameStats();
        this.createGrid();
        this.audioManager.playMusic('gameplay');
    }

    createGrid() {
        const level = this.levelManager.getCurrentLevel();
        this.gridSize = level.gridSize.rows;
        const container = document.querySelector('.puzzle-grid') || this.setupGridContainer();
        
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        this.grid = [];

        for (let r = 0; r < this.gridSize; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.gridSize; c++) {
                const tile = this.createTile(r, c);
                this.grid[r][c] = tile;
                container.appendChild(tile.element);
            }
        }

        // Ensure no initial matches
        this.resolveInitialMatches();
        this.animateGridEntrance();
    }

    setupGridContainer() {
        const container = document.createElement('div');
        container.className = 'puzzle-grid';
        document.getElementById('game-ui').appendChild(container);
        
        // Header
        const header = document.createElement('div');
        header.className = 'game-header';
        header.innerHTML = `
            <div class="stat-box">⭐ <span id="score">0</span></div>
            <div class="stat-box">💎 <span id="total-points">${this.totalPoints}</span></div>
            <div class="stat-box">🎯 Lvl <span id="level-num">1</span></div>
        `;
        document.getElementById('game-ui').prepend(header);

        // Power-ups Bar
        const powerUps = document.createElement('div');
        powerUps.className = 'power-ups-bar';
        powerUps.innerHTML = `
            <button class="power-up-btn" id="hint-benefit-btn">💡 Hint (200)</button>
            <button class="power-up-btn" id="shuffle-benefit-btn">🔀 Shuffle (500)</button>
        `;
        document.getElementById('game-ui').appendChild(powerUps);

        document.getElementById('hint-benefit-btn')?.addEventListener('click', () => this.buyHint());
        document.getElementById('shuffle-benefit-btn')?.addEventListener('click', () => this.buyShuffle());

        return container;
    }

    buyHint() {
        if (this.usePoints(200)) {
            this.showHint();
        }
    }

    buyShuffle() {
        if (this.usePoints(500)) {
            this.shuffleBoard();
        }
    }

    async shuffleBoard() {
        this.isAnimating = true;
        const tiles = this.grid.flat();
        
        // Animate out
        await gsap.to(tiles.map(t => t.element), { scale: 0, rotation: 180, duration: 0.5, stagger: 0.01 });
        
        // Logic shuffle
        tiles.forEach(t => {
            t.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            t.element.style.backgroundColor = t.color;
        });
        this.resolveInitialMatches();
        
        // Animate in
        await gsap.to(tiles.map(t => t.element), { scale: 1, rotation: 0, duration: 0.5, stagger: 0.01 });
        this.isAnimating = false;
    }

    showHint() {
        const possibleMoves = this.findPossibleMoves();
        if (possibleMoves.length > 0) {
            const move = possibleMoves[0];
            const t1 = this.grid[move.r1][move.c1].element;
            const t2 = this.grid[move.r2][move.c2].element;
            gsap.to([t1, t2], { scale: 1.2, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" });
        }
    }

    findPossibleMoves() {
        const moves = [];
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                // Check Horizontal Swap
                if (c < this.gridSize - 1) {
                    this.tempSwap(r, c, r, c + 1);
                    if (this.findMatches().length > 0) moves.push({ r1: r, c1: c, r2: r, c2: c + 1 });
                    this.tempSwap(r, c, r, c + 1);
                }
                // Check Vertical Swap
                if (r < this.gridSize - 1) {
                    this.tempSwap(r, c, r + 1, c);
                    if (this.findMatches().length > 0) moves.push({ r1: r, c1: c, r2: r + 1, c2: c });
                    this.tempSwap(r, c, r + 1, c);
                }
            }
        }
        return moves;
    }

    tempSwap(r1, c1, r2, c2) {
        const temp = this.grid[r1][c1].color;
        this.grid[r1][c1].color = this.grid[r2][c2].color;
        this.grid[r2][c2].color = temp;
    }

    createTile(r, c) {
        const element = document.createElement('div');
        element.className = 'puzzle-tile';
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        element.style.backgroundColor = color;
        
        element.addEventListener('click', () => this.handleTileClick(r, c));

        return { r, c, color, element };
    }

    handleTileClick(r, c) {
        if (this.isAnimating || this.isPaused) return;

        const clickedTile = this.grid[r][c];

        if (!this.selectedTile) {
            this.selectedTile = clickedTile;
            clickedTile.element.classList.add('selected');
        } else {
            const prev = this.selectedTile;
            const dist = Math.abs(r - prev.r) + Math.abs(c - prev.c);

            if (dist === 1) {
                this.swapTiles(prev, clickedTile);
            } else {
                prev.element.classList.remove('selected');
                this.selectedTile = clickedTile;
                clickedTile.element.classList.add('selected');
            }
        }
    }

    async swapTiles(t1, t2) {
        this.isAnimating = true;
        t1.element.classList.remove('selected');
        this.selectedTile = null;

        // Visual Swap
        const rect1 = t1.element.getBoundingClientRect();
        const rect2 = t2.element.getBoundingClientRect();

        await Promise.all([
            gsap.to(t1.element, { x: rect2.left - rect1.left, y: rect2.top - rect1.top, duration: 0.3 }),
            gsap.to(t2.element, { x: rect1.left - rect2.left, y: rect1.top - rect2.top, duration: 0.3 })
        ]);

        // Logic Swap
        const tempColor = t1.color;
        t1.color = t2.color;
        t2.color = tempColor;

        t1.element.style.backgroundColor = t1.color;
        t2.element.style.backgroundColor = t2.color;
        gsap.set([t1.element, t2.element], { x: 0, y: 0 });

        if (!this.checkMatches()) {
            // Swap back if no match
            await Promise.all([
                gsap.to(t1.element, { x: rect2.left - rect1.left, y: rect2.top - rect1.top, duration: 0.2, yoyo: true, repeat: 1 }),
                gsap.to(t2.element, { x: rect1.left - rect2.left, y: rect1.top - rect2.top, duration: 0.2, yoyo: true, repeat: 1 })
            ]);
            t2.color = t1.color;
            t1.color = tempColor;
            t1.element.style.backgroundColor = t1.color;
            t2.element.style.backgroundColor = t2.color;
            this.isAnimating = false;
        } else {
            this.moves++;
            this.updateStats();
            this.audioManager.playPuzzleMoveSound();
            await this.handleMatches();
        }
    }

    checkMatches() {
        const matches = this.findMatches();
        return matches.length > 0;
    }

    findMatches() {
        let matched = new Set();

        // Horizontal
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize - 2; c++) {
                if (this.grid[r][c].color === this.grid[r][c+1].color && 
                    this.grid[r][c].color === this.grid[r][c+2].color) {
                    matched.add(this.grid[r][c]);
                    matched.add(this.grid[r][c+1]);
                    matched.add(this.grid[r][c+2]);
                }
            }
        }

        // Vertical
        for (let c = 0; c < this.gridSize; c++) {
            for (let r = 0; r < this.gridSize - 2; r++) {
                if (this.grid[r][c].color === this.grid[r+1][c].color && 
                    this.grid[r][c].color === this.grid[r+2][c].color) {
                    matched.add(this.grid[r][c]);
                    matched.add(this.grid[r+1][c]);
                    matched.add(this.grid[r+2][c]);
                }
            }
        }

        return Array.from(matched);
    }

    async handleMatches() {
        const matches = this.findMatches();
        if (matches.length === 0) {
            this.isAnimating = false;
            return;
        }

        this.score += matches.length * 100;
        this.updateStats();

        // Animate Out
        await gsap.to(matches.map(m => m.element), { scale: 0, opacity: 0, duration: 0.3, stagger: 0.05 });

        // Replace and Drop
        matches.forEach(m => {
            m.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            m.element.style.backgroundColor = m.color;
        });

        await gsap.to(matches.map(m => m.element), { scale: 1, opacity: 1, duration: 0.3 });
        
        // Chain matches
        await this.handleMatches();
        
        // Check level completion
        if (this.score >= this.levelManager.getCurrentLevel().targetScore) {
            this.completeLevel();
        }
    }

    resolveInitialMatches() {
        while (this.findMatches().length > 0) {
            this.findMatches().forEach(m => {
                m.color = this.colors[Math.floor(Math.random() * this.colors.length)];
                m.element.style.backgroundColor = m.color;
            });
        }
    }

    animateGridEntrance() {
        const elements = this.grid.flat().map(t => t.element);
        gsap.from(elements, { 
            scale: 0, 
            y: -50, 
            opacity: 0, 
            duration: 0.5, 
            stagger: { each: 0.02, from: "center" },
            ease: "back.out(1.7)"
        });
    }

    completeLevel() {
        const stats = this.levelManager.completeLevel(
            this.levelManager.currentLevel,
            this.score,
            this.gameTime,
            this.moves
        );
        this.addPoints(stats.rewardPoints);
        this.uiManager.showScreen('level-complete');
        document.getElementById('final-score').innerText = stats.score;
        this.audioManager.playVictorySequence();
    }

    resetGameStats() {
        this.score = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.updateStats();
    }

    updateStats() {
        const scoreEl = document.getElementById('score');
        const pointsEl = document.getElementById('total-points');
        const levelEl = document.getElementById('level-num');
        
        if (scoreEl) scoreEl.innerText = this.score;
        if (pointsEl) pointsEl.innerText = this.totalPoints;
        if (levelEl) levelEl.innerText = this.levelManager.currentLevel;
    }

    returnToMenu() {
        this.uiManager.showScreen('main-menu');
        this.audioManager.playMusic('menu');
    }

    pauseGame() {
        this.isPaused = true;
        this.uiManager.showScreen('pause-menu');
    }

    resumeGame() {
        this.isPaused = false;
        this.uiManager.showScreen('game-ui');
    }

    nextLevel() {
        this.levelManager.advanceToNextLevel();
        this.startGame();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new PuzzleBitGame();
});
