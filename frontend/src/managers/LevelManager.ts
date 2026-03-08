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

// frontend/src/managers/AudioManager.ts
import { Howl } from 'howler';

export class AudioManager {
    sounds: { [key: string]: Howl } = {};

    constructor() {
        this.sounds = {
            click: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-simple-click-630.mp3'] }),
            success: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'] }),
            bonus: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-shiny-objects-2016.mp3'] })
        };
    }

    playSound(name: string) {
        if (this.sounds[name]) this.sounds[name].play();
    }
}
