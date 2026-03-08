// frontend/src/managers/LevelManager.ts
export class LevelManager {
    levels: any[] = [];
    currentLevelIndex: number = 0;

    constructor() {
        this.loadLevels();
    }

    async loadLevels() {
        try {
            // In a real app, this would be an API call to your Django backend
            const response = await fetch('/levels.json');
            this.levels = await response.json();
        } catch (error) {
            console.error("Failed to load levels:", error);
            // Fallback static level
            this.levels = [{
                number: 1,
                letters: "ASTRE",
                words: ["STAR", "TEARS", "RATE"],
                coins_reward: 50,
                bg_image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
            }];
        }
    }

    getLevel(num: number) {
        return this.levels.find(l => l.number === num) || this.levels[0];
    }
}
