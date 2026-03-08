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
