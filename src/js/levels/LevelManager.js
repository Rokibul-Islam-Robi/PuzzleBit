export class LevelManager {
    constructor() {
        this.levels = this.initializeLevels();
        this.currentLevel = 1;
        this.unlockedLevels = 1;
        this.completedLevels = new Set();
    }

    initializeLevels() {
        return {
            1: {
                name: "Crystal Cave",
                description: "Begin your journey in the mystical crystal cave",
                gridSize: { rows: 3, cols: 3 },
                pieceTypes: ['crystal', 'gem'],
                targetScore: 500,
                timeLimit: 300, // 5 minutes
                hints: 3,
                background: 'crystal-cave',
                music: 'crystal-cave-theme',
                difficulty: 1,
                specialRules: []
            },
            2: {
                name: "Gem Mine",
                description: "Delve deeper into the gem-filled mines",
                gridSize: { rows: 4, cols: 4 },
                pieceTypes: ['crystal', 'gem', 'orb'],
                targetScore: 800,
                timeLimit: 420, // 7 minutes
                hints: 2,
                background: 'gem-mine',
                music: 'gem-mine-theme',
                difficulty: 2,
                specialRules: ['time-pressure']
            },
            3: {
                name: "Orb Sanctuary",
                description: "Navigate the floating orbs of the sanctuary",
                gridSize: { rows: 4, cols: 4 },
                pieceTypes: ['crystal', 'gem', 'orb', 'prism'],
                targetScore: 1200,
                timeLimit: 480, // 8 minutes
                hints: 2,
                background: 'orb-sanctuary',
                music: 'orb-sanctuary-theme',
                difficulty: 3,
                specialRules: ['floating-pieces']
            },
            4: {
                name: "Prism Temple",
                description: "Solve the ancient puzzles of the prism temple",
                gridSize: { rows: 5, cols: 5 },
                pieceTypes: ['crystal', 'gem', 'orb', 'prism', 'star'],
                targetScore: 1800,
                timeLimit: 600, // 10 minutes
                hints: 1,
                background: 'prism-temple',
                music: 'prism-temple-theme',
                difficulty: 4,
                specialRules: ['rotation-locked', 'time-pressure']
            },
            5: {
                name: "Star Nexus",
                description: "Master the ultimate challenge at the star nexus",
                gridSize: { rows: 5, cols: 5 },
                pieceTypes: ['crystal', 'gem', 'orb', 'prism', 'star', 'diamond'],
                targetScore: 2500,
                timeLimit: 720, // 12 minutes
                hints: 0,
                background: 'star-nexus',
                music: 'star-nexus-theme',
                difficulty: 5,
                specialRules: ['rotation-locked', 'time-pressure', 'no-hints']
            }
        };
    }

    getLevel(levelNumber) {
        return this.levels[levelNumber] || null;
    }

    getCurrentLevel() {
        return this.getLevel(this.currentLevel);
    }

    setCurrentLevel(levelNumber) {
        if (this.levels[levelNumber]) {
            this.currentLevel = levelNumber;
            return true;
        }
        return false;
    }

    unlockLevel(levelNumber) {
        if (this.levels[levelNumber] && levelNumber <= this.unlockedLevels + 1) {
            this.unlockedLevels = Math.max(this.unlockedLevels, levelNumber);
            return true;
        }
        return false;
    }

    completeLevel(levelNumber, score, time, moves) {
        if (this.levels[levelNumber]) {
            this.completedLevels.add(levelNumber);
            
            // Unlock next level if completed successfully
            if (score >= this.levels[levelNumber].targetScore) {
                this.unlockLevel(levelNumber + 1);
            }
            
            return {
                level: levelNumber,
                score: score,
                time: time,
                moves: moves,
                stars: this.calculateStars(levelNumber, score, time, moves),
                isPerfect: this.isPerfectCompletion(levelNumber, score, time, moves)
            };
        }
        return null;
    }

    calculateStars(levelNumber, score, time, moves) {
        const level = this.levels[levelNumber];
        if (!level) return 0;
        
        let stars = 0;
        
        // Score-based stars
        if (score >= level.targetScore) stars++;
        if (score >= level.targetScore * 1.5) stars++;
        if (score >= level.targetScore * 2) stars++;
        
        // Time-based bonus star
        if (time <= level.timeLimit * 0.7) stars++;
        
        // Move efficiency bonus star
        const expectedMoves = level.gridSize.rows * level.gridSize.cols * 2;
        if (moves <= expectedMoves * 0.8) stars++;
        
        return Math.min(stars, 5);
    }

    isPerfectCompletion(levelNumber, score, time, moves) {
        const level = this.levels[levelNumber];
        if (!level) return false;
        
        return score >= level.targetScore * 2 && 
               time <= level.timeLimit * 0.5 && 
               moves <= (level.gridSize.rows * level.gridSize.cols * 1.5);
    }

    getLevelProgress() {
        const totalLevels = Object.keys(this.levels).length;
        const completedCount = this.completedLevels.size;
        
        return {
            total: totalLevels,
            completed: completedCount,
            unlocked: this.unlockedLevels,
            current: this.currentLevel,
            percentage: Math.round((completedCount / totalLevels) * 100)
        };
    }

    getNextLevel() {
        const nextLevelNumber = this.currentLevel + 1;
        if (this.levels[nextLevelNumber] && this.unlockedLevels >= nextLevelNumber) {
            return nextLevelNumber;
        }
        return null;
    }

    getPreviousLevel() {
        const prevLevelNumber = this.currentLevel - 1;
        if (this.levels[prevLevelNumber]) {
            return prevLevelNumber;
        }
        return null;
    }

    isLevelUnlocked(levelNumber) {
        return levelNumber <= this.unlockedLevels;
    }

    isLevelCompleted(levelNumber) {
        return this.completedLevels.has(levelNumber);
    }

    getLevelStatistics(levelNumber) {
        // This would typically load from localStorage or a database
        return {
            bestScore: 0,
            bestTime: null,
            bestMoves: null,
            attempts: 0,
            completions: 0,
            stars: 0
        };
    }

    getLevelPuzzleConfiguration(levelNumber) {
        const level = this.getLevel(levelNumber);
        if (!level) return null;
        
        const { gridSize, pieceTypes } = level;
        const puzzleConfig = {
            gridSize: gridSize,
            pieces: [],
            solution: []
        };
        
        // Generate puzzle pieces
        for (let row = 0; row < gridSize.rows; row++) {
            puzzleConfig.pieces[row] = [];
            puzzleConfig.solution[row] = [];
            
            for (let col = 0; col < gridSize.cols; col++) {
                const pieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
                puzzleConfig.pieces[row][col] = {
                    type: pieceType,
                    position: { row, col },
                    rotation: Math.floor(Math.random() * 4) * 90
                };
                
                // Solution is the same as initial pieces (for now)
                puzzleConfig.solution[row][col] = {
                    type: pieceType,
                    position: { row, col },
                    rotation: 0 // Solved state has no rotation
                };
            }
        }
        
        return puzzleConfig;
    }

    getLevelBackground(levelNumber) {
        const level = this.getLevel(levelNumber);
        return level ? level.background : 'default';
    }

    getLevelMusic(levelNumber) {
        const level = this.getLevel(levelNumber);
        return level ? level.music : 'default';
    }

    getLevelSpecialRules(levelNumber) {
        const level = this.getLevel(levelNumber);
        return level ? level.specialRules : [];
    }

    getLevelDifficulty(levelNumber) {
        const level = this.getLevel(levelNumber);
        return level ? level.difficulty : 1;
    }

    getLevelTimeLimit(levelNumber) {
        const level = this.getLevel(levelNumber);
        return level ? level.timeLimit : 300;
    }

    getLevelTargetScore(levelNumber) {
        const level = this.getLevel(levelNumber);
        return level ? level.targetScore : 500;
    }

    getLevelHints(levelNumber) {
        const level = this.getLevel(levelNumber);
        return level ? level.hints : 3;
    }

    // Level progression methods
    advanceToNextLevel() {
        const nextLevel = this.getNextLevel();
        if (nextLevel) {
            this.currentLevel = nextLevel;
            return true;
        }
        return false;
    }

    resetProgress() {
        this.currentLevel = 1;
        this.unlockedLevels = 1;
        this.completedLevels.clear();
    }

    // Save/Load progress
    saveProgress() {
        const progress = {
            currentLevel: this.currentLevel,
            unlockedLevels: this.unlockedLevels,
            completedLevels: Array.from(this.completedLevels)
        };
        
        try {
            localStorage.setItem('puzzlebit-progress', JSON.stringify(progress));
            return true;
        } catch (error) {
            console.error('Failed to save progress:', error);
            return false;
        }
    }

    loadProgress() {
        try {
            const savedProgress = localStorage.getItem('puzzlebit-progress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                this.currentLevel = progress.currentLevel || 1;
                this.unlockedLevels = progress.unlockedLevels || 1;
                this.completedLevels = new Set(progress.completedLevels || []);
                return true;
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        }
        return false;
    }

    // Level validation
    validateLevelCompletion(levelNumber, score, time, moves) {
        const level = this.getLevel(levelNumber);
        if (!level) return false;
        
        return score >= level.targetScore && 
               time <= level.timeLimit && 
               moves > 0;
    }

    // Get level recommendations
    getRecommendedLevel() {
        // Find the highest unlocked level that hasn't been completed
        for (let i = this.unlockedLevels; i >= 1; i--) {
            if (!this.completedLevels.has(i)) {
                return i;
            }
        }
        
        // If all unlocked levels are completed, suggest the next level
        if (this.unlockedLevels < Object.keys(this.levels).length) {
            return this.unlockedLevels + 1;
        }
        
        return 1; // Default to first level
    }

    // Get level achievements
    getLevelAchievements(levelNumber) {
        const level = this.getLevel(levelNumber);
        if (!level) return [];
        
        const achievements = [];
        
        // Speed demon achievement
        if (level.timeLimit) {
            achievements.push({
                id: 'speed-demon',
                name: 'Speed Demon',
                description: `Complete level ${levelNumber} in under ${Math.floor(level.timeLimit * 0.5)} seconds`,
                unlocked: false
            });
        }
        
        // Move master achievement
        const expectedMoves = level.gridSize.rows * level.gridSize.cols * 2;
        achievements.push({
            id: 'move-master',
            name: 'Move Master',
            description: `Complete level ${levelNumber} in under ${Math.floor(expectedMoves * 0.7)} moves`,
            unlocked: false
        });
        
        // Perfect score achievement
        achievements.push({
            id: 'perfect-score',
            name: 'Perfect Score',
            description: `Get ${level.targetScore * 2} points on level ${levelNumber}`,
            unlocked: false
        });
        
        return achievements;
    }
} 