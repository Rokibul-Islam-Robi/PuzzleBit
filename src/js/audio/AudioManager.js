import { Howl, Howler } from 'howler';

export class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.isMuted = false;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        
        try {
            this.initializeAudio();
        } catch (error) {
            console.warn('⚠️ Audio initialization failed, continuing without sound:', error);
        }
    }

    initializeAudio() {
        // Initialize sound effects
        try {
            this.sounds = {
                'move': new Howl({
                    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
                    volume: this.sfxVolume
                }),
                'rotate': new Howl({
                    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
                    volume: this.sfxVolume
                }),
                'hint': new Howl({
                    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
                    volume: this.sfxVolume
                }),
                'level-complete': new Howl({
                    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
                    volume: this.sfxVolume
                }),
                'victory': new Howl({
                    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
                    volume: this.sfxVolume
                }),
                'error': new Howl({
                    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9|... rest of data ...'],
                    volume: this.sfxVolume
                })
            };
        } catch (e) { console.warn('Sound initialization failed'); }

        // Initialize background music
        try {
            this.music = {
                'menu': this.createMenuMusic(),
                'gameplay': this.createGameplayMusic(),
                'victory': this.createVictoryMusic()
            };
        } catch (e) { console.warn('Music initialization failed'); }

        // Set up audio context for better control
        this.setupAudioContext();
    }

    createMenuMusic() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return { isPlaying: false };
            
            const audioContext = new AudioCtx();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            
            return {
                context: audioContext,
                oscillator: oscillator,
                gainNode: gainNode,
                isPlaying: false
            };
        } catch (e) {
            return { isPlaying: false };
        }
    }

    createGameplayMusic() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return { isPlaying: false };

            const audioContext = new AudioCtx();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            
            return {
                context: audioContext,
                oscillator: oscillator,
                gainNode: gainNode,
                isPlaying: false
            };
        } catch (e) {
            return { isPlaying: false };
        }
    }

    createVictoryMusic() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return { isPlaying: false };

            const audioContext = new AudioCtx();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
            
            return {
                context: audioContext,
                oscillator: oscillator,
                gainNode: gainNode,
                isPlaying: false
            };
        } catch (e) {
            return { isPlaying: false };
        }
    }

    setupAudioContext() {
        document.addEventListener('click', () => {
            Object.values(this.music).forEach(music => {
                if (music && music.context && music.context.state === 'suspended') {
                    music.context.resume();
                }
            });
        }, { once: true });
    }

    playMusic(trackName) {
        if (this.isMuted) return;
        
        this.stopMusic();
        
        const music = this.music[trackName];
        if (music && !music.isPlaying && music.oscillator) {
            try {
                music.oscillator.start();
                music.isPlaying = true;
                this.currentMusic = trackName;
                music.gainNode.gain.setValueAtTime(this.musicVolume, music.context.currentTime);
                if (trackName === 'menu') this.createMenuLoop(music);
            } catch (error) {
                console.warn('Could not play music:', error);
            }
        }
    }

    createMenuLoop(music) {
        const frequencies = [440, 554, 659, 554];
        let currentIndex = 0;
        
        const playNote = () => {
            if (!music.isPlaying) return;
            music.oscillator.frequency.setValueAtTime(frequencies[currentIndex], music.context.currentTime);
            currentIndex = (currentIndex + 1) % frequencies.length;
            setTimeout(playNote, 2000);
        };
        setTimeout(playNote, 2000);
    }

    stopMusic() {
        if (this.currentMusic) {
            const music = this.music[this.currentMusic];
            if (music && music.isPlaying && music.oscillator) {
                try {
                    music.oscillator.stop();
                    music.isPlaying = false;
                } catch (error) { console.warn('Could not stop music:', error); }
            }
            this.currentMusic = null;
        }
    }

    pauseMusic() {
        if (this.currentMusic) {
            const music = this.music[this.currentMusic];
            if (music && music.isPlaying && music.gainNode) {
                music.gainNode.gain.setValueAtTime(0, music.context.currentTime);
            }
        }
    }

    resumeMusic() {
        if (this.currentMusic) {
            const music = this.music[this.currentMusic];
            if (music && music.isPlaying && music.gainNode) {
                music.gainNode.gain.setValueAtTime(this.musicVolume, music.context.currentTime);
            }
        }
    }

    playSound(soundName) {
        if (this.isMuted) return;
        const sound = this.sounds[soundName];
        if (sound) {
            try {
                sound.volume(this.sfxVolume);
                sound.play();
            } catch (error) { console.warn('Could not play sound:', error); }
        }
    }

    playVictorySequence() {
        if (this.isMuted) return;
        this.playMusic('victory');
        setTimeout(() => this.playSound('victory'), 500);
        setTimeout(() => this.stopMusic(), 5000);
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            const music = this.music[this.currentMusic];
            if (music && music.isPlaying && music.gainNode) {
                music.gainNode.gain.setValueAtTime(this.musicVolume, music.context.currentTime);
            }
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.volume) sound.volume(this.sfxVolume);
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) this.stopMusic();
        else if (this.currentMusic) this.playMusic(this.currentMusic);
        return this.isMuted;
    }

    playPuzzleMoveSound() { this.playSoundEffect(800, 400, 0.1, 0.2); }
    playPuzzleRotateSound() { this.playSoundEffect(600, 300, 0.15, 0.15, 'triangle'); }
    playHintSound() { this.playSoundEffect(1000, 1200, 0.3, 0.1); }

    playSoundEffect(startFreq, endFreq, duration, volume, type = 'sine') {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = type;
            osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
            gain.gain.setValueAtTime(volume * this.sfxVolume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    }

    destroy() {
        this.stopMusic();
        Object.values(this.sounds).forEach(s => s && s.stop && s.stop());
        Object.values(this.music).forEach(m => m && m.context && m.context.close && m.context.close());
    }
}
