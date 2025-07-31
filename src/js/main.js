import { GameEngine } from './engine/GameEngine.js';
import { UIManager } from './ui/UIManager.js';
import { AudioManager } from './audio/AudioManager.js';
import { LevelManager } from './levels/LevelManager.js';
import { ParticleSystem } from './effects/ParticleSystem.js';

class PuzzleBitGame {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.isPaused = false;
        this.gameState = 'loading'; // loading, menu, playing, paused, complete
        
        this.puzzleGrid = [];
        this.gridSize = 8;
        // Vibrant colors for tiles
        this.colors = [
            '#FF6B6B', // Deep Red
            '#4ECDC4', // Deep Teal
            '#45B7D1', // Deep Blue
            '#96CEB4', // Deep Green
            '#FFEAA7', // Deep Yellow
            '#DDA0DD', // Deep Purple
            '#FF8C42', // Deep Orange
            '#FF69B4', // Deep Pink
            '#20B2AA', // Deep Sea Green
            '#9370DB', // Deep Medium Purple
            '#FF4500', // Deep Orange Red
            '#00CED1'  // Deep Dark Turquoise
        ];
        this.selectedTile = null;
        this.isAnimating = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('🎮 Initializing PuzzleBit 2D Game...');
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start loading sequence
            await this.startLoadingSequence();
            
        } catch (error) {
            console.error('❌ Game initialization failed:', error);
            this.showError('Failed to initialize game. Please refresh the page.');
            setTimeout(() => {
                this.showMainMenu();
            }, 2000);
        }
    }

    async startLoadingSequence() {
        try {
            const loadingProgress = document.querySelector('.loading-progress');
            const loadingText = document.querySelector('.loading-text');
            
            if (!loadingProgress || !loadingText) {
                console.error('❌ Loading elements not found');
                this.showMainMenu();
                return;
            }
            
            const loadingSteps = [
                { progress: 20, text: 'Loading puzzle engine...' },
                { progress: 40, text: 'Initializing game mechanics...' },
                { progress: 60, text: 'Preparing colorful backgrounds...' },
                { progress: 80, text: 'Setting up levels...' },
                { progress: 100, text: 'Ready to play!' }
            ];

            for (const step of loadingSteps) {
                await this.simulateLoading(step.progress, step.text);
            }

            console.log('✅ Loading complete, transitioning to main menu...');
            setTimeout(() => {
                this.showMainMenu();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Loading sequence failed:', error);
            setTimeout(() => {
                this.showMainMenu();
            }, 1000);
        }
    }

    async simulateLoading(progress, text) {
        return new Promise(resolve => {
            const loadingProgress = document.querySelector('.loading-progress');
            const loadingText = document.querySelector('.loading-text');
            
            if (loadingProgress) {
                loadingProgress.style.width = `${progress}%`;
            }
            
            if (loadingText) {
                loadingText.textContent = text;
            }
            
            setTimeout(resolve, 500); // Reduced from 800ms to 500ms
        });
    }

    showMainMenu() {
        console.log('🎮 Showing main menu...');
        this.gameState = 'menu';
        
        const loadingScreen = document.getElementById('loading-screen');
        const mainMenu = document.getElementById('main-menu');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
        }
        
        this.setupBasicEventListeners();
    }

    setupBasicEventListeners() {
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.startGame());
        }
        
        const instructionsBtn = document.getElementById('instructions-btn');
        if (instructionsBtn) {
            instructionsBtn.addEventListener('click', () => this.showInstructions());
        }
        
        const levelsBtn = document.getElementById('levels-btn');
        if (levelsBtn) {
            levelsBtn.addEventListener('click', () => this.showLevels());
        }
        
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }
        
        const creditsBtn = document.getElementById('credits-btn');
        if (creditsBtn) {
            creditsBtn.addEventListener('click', () => this.showCredits());
        }
    }

    showInstructions() {
        const mainMenu = document.getElementById('main-menu');
        const instructionsScreen = document.getElementById('instructions-screen');
        
        if (mainMenu) {
            mainMenu.classList.add('hidden');
        }
        
        if (instructionsScreen) {
            instructionsScreen.classList.remove('hidden');
        }
        
        // Setup back button
        const backBtn = document.getElementById('back-to-menu-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToMenu());
        }
    }

    backToMenu() {
        const instructionsScreen = document.getElementById('instructions-screen');
        const mainMenu = document.getElementById('main-menu');
        
        if (instructionsScreen) {
            instructionsScreen.classList.add('hidden');
        }
        
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.resetGameStats();
        this.showGameUI();
        this.createPuzzleGrid();
        this.startGameTimer();
        
        // Show first-time help for new players
        this.showFirstTimeHelp();
    }

    showFirstTimeHelp() {
        // Check if this is the first time playing
        const hasPlayedBefore = localStorage.getItem('puzzleBit_hasPlayed');
        
        if (!hasPlayedBefore) {
            // Show first-time help after a short delay
            setTimeout(() => {
                this.showInGameHelp();
                localStorage.setItem('puzzleBit_hasPlayed', 'true');
            }, 2000);
        }
    }

    showGameUI() {
        const mainMenu = document.getElementById('main-menu');
        const gameUI = document.getElementById('game-ui');
        
        if (mainMenu) {
            mainMenu.classList.add('hidden');
        }
        
        if (gameUI) {
            gameUI.classList.remove('hidden');
        }
        
        // Create game container
        this.createGameContainer();
    }

    createGameContainer() {
        const gameContainer = document.createElement('div');
        gameContainer.id = 'puzzle-game-container';
        gameContainer.className = 'puzzle-game-container';
        
        // Add animated background
        gameContainer.innerHTML = `
            <div class="animated-background">
                <div class="bg-layer bg-layer-1"></div>
                <div class="bg-layer bg-layer-2"></div>
                <div class="bg-layer bg-layer-3"></div>
            </div>
            <div class="game-header">
                <div class="level-info">
                    <span class="level-number">Level ${this.currentLevel}</span>
                    <span class="level-name">${this.getLevelName(this.currentLevel)}</span>
                </div>
                <div class="game-stats">
                    <span class="score">Score: ${this.score}</span>
                    <span class="moves">Moves: ${this.moves}</span>
                    <span class="timer">Time: ${this.formatTime(this.gameTime)}</span>
                </div>
                <div class="game-controls">
                    <button id="reset-btn" class="control-btn">Reset Game</button>
                    <button id="help-btn" class="control-btn">❓</button>
                    <button id="hint-btn" class="control-btn">💡</button>
                    <button id="pause-btn" class="control-btn">⏸️</button>
                    <button id="menu-btn" class="control-btn">🏠</button>
                </div>
            </div>
            <div id="puzzle-grid" class="puzzle-grid"></div>
            
            <!-- In-game help overlay -->
            <div id="help-overlay" class="help-overlay hidden">
                <div class="help-content">
                    <h3>🎮 Quick Help</h3>
                    <div class="help-tips">
                        <p><strong>Click</strong> a tile to select it</p>
                        <p><strong>Click</strong> adjacent tile to swap</p>
                        <p><strong>Match 3+</strong> same colors in a row/column</p>
                        <p><strong>Use 💡</strong> for hints when stuck</p>
                    </div>
                    <button id="close-help-btn" class="menu-btn primary">Got it!</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(gameContainer);
        
        // Setup game controls
        this.setupGameControls();
    }

    setupGameControls() {
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }
        
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showInGameHelp());
        }
        
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
        
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseGame());
        }
        
        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.returnToMenu());
        }
        
        // Setup help overlay
        const closeHelpBtn = document.getElementById('close-help-btn');
        if (closeHelpBtn) {
            closeHelpBtn.addEventListener('click', () => this.hideInGameHelp());
        }
    }

    createPuzzleGrid() {
        const gridContainer = document.getElementById('puzzle-grid');
        if (!gridContainer) return;
        
        gridContainer.innerHTML = '';
        this.puzzleGrid = [];
        
        // Create grid based on level
        this.gridSize = this.getLevelGridSize(this.currentLevel);
        gridContainer.setAttribute('data-size', this.gridSize);
        
        for (let row = 0; row < this.gridSize; row++) {
            this.puzzleGrid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                const tile = this.createTile(row, col);
                this.puzzleGrid[row][col] = tile;
                gridContainer.appendChild(tile);
            }
        }
        
        // Add entrance animation
        this.animateGridEntrance();
    }

    createTile(row, col) {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.dataset.row = row;
        tile.dataset.col = col;
        
        // Use solid deep color for each tile
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        tile.style.backgroundColor = color;
        
        // Add inner pattern for depth
        tile.innerHTML = `
            <div class="tile-pattern"></div>
            <div class="tile-highlight"></div>
        `;
        
        // Add click event
        tile.addEventListener('click', () => this.onTileClick(row, col));
        
        return tile;
    }

    onTileClick(row, col) {
        if (this.isAnimating) return;
        
        if (!this.selectedTile) {
            // Select tile
            this.selectedTile = { row, col };
            this.puzzleGrid[row][col].classList.add('selected');
        } else {
            // Check if adjacent
            const selected = this.selectedTile;
            const isAdjacent = (
                (Math.abs(row - selected.row) === 1 && col === selected.col) ||
                (Math.abs(col - selected.col) === 1 && row === selected.row)
            );
            
            if (isAdjacent) {
                this.swapTiles(selected.row, selected.col, row, col);
            } else {
                // If not adjacent, select the new tile instead
                this.puzzleGrid[selected.row][selected.col].classList.remove('selected');
                this.selectedTile = { row, col };
                this.puzzleGrid[row][col].classList.add('selected');
            }
        }
    }

    swapTiles(row1, col1, row2, col2) {
        if (this.isAnimating) return; // Prevent multiple swaps
        
        this.isAnimating = true;
        this.moves++;
        this.updateStats();
        
        const tile1 = this.puzzleGrid[row1][col1];
        const tile2 = this.puzzleGrid[row2][col2];
        
        // Clear selection
        tile1.classList.remove('selected');
        tile2.classList.remove('selected');
        this.selectedTile = null;
        
        // Swap colors
        const tempColor = tile1.style.backgroundColor;
        tile1.style.backgroundColor = tile2.style.backgroundColor;
        tile2.style.backgroundColor = tempColor;
        
        // Animate swap
        this.animateSwap(tile1, tile2, () => {
            this.isAnimating = false;
            this.checkForMatches();
        });
    }

    animateSwap(tile1, tile2, callback) {
        tile1.classList.add('swapping');
        tile2.classList.add('swapping');
        
        setTimeout(() => {
            tile1.classList.remove('swapping');
            tile2.classList.remove('swapping');
            callback();
        }, 150); // Reduced from 300ms to 150ms
    }

    checkForMatches() {
        const matches = this.findMatches();
        
        if (matches.length > 0) {
            this.score += matches.length * 100;
            this.updateStats();
            this.animateMatches(matches);
        }
    }

    findMatches() {
        const matches = [];
        
        // Check horizontal matches
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 2; col++) {
                const color1 = this.puzzleGrid[row][col].style.backgroundColor;
                const color2 = this.puzzleGrid[row][col + 1].style.backgroundColor;
                const color3 = this.puzzleGrid[row][col + 2].style.backgroundColor;
                
                if (color1 === color2 && color2 === color3) {
                    matches.push({ row, col });
                    matches.push({ row, col: col + 1 });
                    matches.push({ row, col: col + 2 });
                }
            }
        }
        
        // Check vertical matches
        for (let row = 0; row < this.gridSize - 2; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const color1 = this.puzzleGrid[row][col].style.backgroundColor;
                const color2 = this.puzzleGrid[row + 1][col].style.backgroundColor;
                const color3 = this.puzzleGrid[row + 2][col].style.backgroundColor;
                
                if (color1 === color2 && color2 === color3) {
                    matches.push({ row, col });
                    matches.push({ row: row + 1, col });
                    matches.push({ row: row + 2, col });
                }
            }
        }
        
        return matches;
    }

    animateMatches(matches) {
        // Highlight matches
        matches.forEach(match => {
            const tile = this.puzzleGrid[match.row][match.col];
            tile.classList.add('matched');
        });
        
        setTimeout(() => {
            // Remove matched tiles and create new ones
            matches.forEach(match => {
                const tile = this.puzzleGrid[match.row][match.col];
                // Create new solid color
                const newColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                tile.style.backgroundColor = newColor;
                tile.classList.remove('matched');
            });
            
            // Check for new matches
            setTimeout(() => {
                this.checkForMatches();
            }, 100); // Reduced from 200ms to 100ms
        }, 300); // Reduced from 500ms to 300ms
    }

    animateGridEntrance() {
        const tiles = document.querySelectorAll('.puzzle-tile');
        tiles.forEach((tile, index) => {
            tile.style.animationDelay = `${index * 0.03}s`; // Reduced from 0.05s to 0.03s
            tile.classList.add('entrance-animation');
        });
    }

    resetGame() {
        this.resetGameStats();
        this.createPuzzleGrid();
    }

    showHint() {
        // Find possible moves
        const possibleMoves = this.findPossibleMoves();
        if (possibleMoves.length > 0) {
            const move = possibleMoves[0];
            this.puzzleGrid[move.row1][move.col1].classList.add('hint');
            this.puzzleGrid[move.row2][move.col2].classList.add('hint');
            
            setTimeout(() => {
                this.puzzleGrid[move.row1][move.col1].classList.remove('hint');
                this.puzzleGrid[move.row2][move.col2].classList.remove('hint');
            }, 800); // Reduced from 1000ms to 800ms
        }
    }

    findPossibleMoves() {
        const moves = [];
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                // Check right swap
                if (col < this.gridSize - 1) {
                    this.swapTilesTemp(row, col, row, col + 1);
                    if (this.findMatches().length > 0) {
                        moves.push({ row1: row, col1: col, row2: row, col2: col + 1 });
                    }
                    this.swapTilesTemp(row, col, row, col + 1); // Swap back
                }
                
                // Check down swap
                if (row < this.gridSize - 1) {
                    this.swapTilesTemp(row, col, row + 1, col);
                    if (this.findMatches().length > 0) {
                        moves.push({ row1: row, col1: col, row2: row + 1, col2: col });
                    }
                    this.swapTilesTemp(row, col, row + 1, col); // Swap back
                }
            }
        }
        
        return moves;
    }

    swapTilesTemp(row1, col1, row2, col2) {
        const temp = this.puzzleGrid[row1][col1].style.backgroundColor;
        this.puzzleGrid[row1][col1].style.backgroundColor = this.puzzleGrid[row2][col2].style.backgroundColor;
        this.puzzleGrid[row2][col2].style.backgroundColor = temp;
    }

    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.isPaused = true;
            this.showPauseMenu();
        }
    }

    showPauseMenu() {
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) {
            pauseMenu.classList.remove('hidden');
        }
    }

    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.isPaused = false;
            const pauseMenu = document.getElementById('pause-menu');
            if (pauseMenu) {
                pauseMenu.classList.add('hidden');
            }
        }
    }

    returnToMenu() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        this.gameState = 'menu';
        this.isPaused = false;
        
        // Remove game container
        const gameContainer = document.getElementById('puzzle-game-container');
        if (gameContainer) {
            gameContainer.remove();
        }
        
        // Show main menu
        const gameUI = document.getElementById('game-ui');
        const mainMenu = document.getElementById('main-menu');
        
        if (gameUI) {
            gameUI.classList.add('hidden');
        }
        
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
        }
    }

    resetGameStats() {
        this.score = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.updateStats();
    }

    updateStats() {
        const scoreElement = document.querySelector('.score');
        const movesElement = document.querySelector('.moves');
        const timerElement = document.querySelector('.timer');
        
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
        }
        
        if (movesElement) {
            movesElement.textContent = `Moves: ${this.moves}`;
        }
        
        if (timerElement) {
            timerElement.textContent = `Time: ${this.formatTime(this.gameTime)}`;
        }
    }

    startGameTimer() {
        this.gameTimer = setInterval(() => {
            if (!this.isPaused && this.gameState === 'playing') {
                this.gameTime++;
                this.updateStats();
            }
        }, 1000);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    getLevelName(level) {
        const levelNames = [
            'Crystal Garden',
            'Gem Valley',
            'Orb Meadow',
            'Prism Peak',
            'Star Field'
        ];
        return levelNames[level - 1] || `Level ${level}`;
    }

    getLevelGridSize(level) {
        const sizes = [6, 7, 8, 8, 9];
        return sizes[level - 1] || 8;
    }

    showLevels() {
        alert('Level selection coming soon!');
    }

    showSettings() {
        alert('Settings coming soon!');
    }

    showCredits() {
        alert('Credits: PuzzleBit - 2D Animated Puzzle Game\n\nCreated with modern web technologies');
    }

    showError(message) {
        console.error(message);
        alert(message);
    }

    setupEventListeners() {
        // Pause menu buttons
        const resumeBtn = document.getElementById('resume-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.resumeGame());
        }
        
        const restartLevelBtn = document.getElementById('restart-level-btn');
        if (restartLevelBtn) {
            restartLevelBtn.addEventListener('click', () => this.resetGame());
        }
        
        const mainMenuBtn = document.getElementById('main-menu-btn');
        if (mainMenuBtn) {
            mainMenuBtn.addEventListener('click', () => this.returnToMenu());
        }
    }

    showInGameHelp() {
        const helpOverlay = document.getElementById('help-overlay');
        if (helpOverlay) {
            helpOverlay.classList.remove('hidden');
        }
    }

    hideInGameHelp() {
        const helpOverlay = document.getElementById('help-overlay');
        if (helpOverlay) {
            helpOverlay.classList.add('hidden');
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing PuzzleBit 2D...');
    
    // Add a fallback timeout
    const fallbackTimeout = setTimeout(() => {
        console.warn('⚠️ Game initialization taking too long, forcing main menu...');
        const loadingScreen = document.getElementById('loading-screen');
        const mainMenu = document.getElementById('main-menu');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
        }
    }, 10000);
    
    try {
        window.puzzleBitGame = new PuzzleBitGame();
        clearTimeout(fallbackTimeout);
        
    } catch (error) {
        console.error('❌ Failed to initialize game:', error);
        clearTimeout(fallbackTimeout);
        
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const mainMenu = document.getElementById('main-menu');
            
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
            
            if (mainMenu) {
                mainMenu.classList.remove('hidden');
            }
        }, 1000);
    }
}); 