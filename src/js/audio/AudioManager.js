import { Howl, Howler } from 'howler';

export class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.isMuted = false;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        
        this.initializeAudio();
    }

    initializeAudio() {
        // Initialize sound effects
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
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
                volume: this.sfxVolume
            })
        };

        // Initialize background music
        this.music = {
            'menu': this.createMenuMusic(),
            'gameplay': this.createGameplayMusic(),
            'victory': this.createVictoryMusic()
        };

        // Set up audio context for better control
        this.setupAudioContext();
    }

    createMenuMusic() {
        // Create ambient menu music using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
    }

    createGameplayMusic() {
        // Create dynamic gameplay music
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
    }

    createVictoryMusic() {
        // Create celebratory victory music
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
    }

    setupAudioContext() {
        // Resume audio context on user interaction
        document.addEventListener('click', () => {
            Object.values(this.music).forEach(music => {
                if (music.context && music.context.state === 'suspended') {
                    music.context.resume();
                }
            });
        }, { once: true });
    }

    playMusic(trackName) {
        if (this.isMuted) return;
        
        // Stop current music
        this.stopMusic();
        
        const music = this.music[trackName];
        if (music && !music.isPlaying) {
            try {
                music.oscillator.start();
                music.isPlaying = true;
                this.currentMusic = trackName;
                
                // Set volume
                music.gainNode.gain.setValueAtTime(this.musicVolume, music.context.currentTime);
                
                // Create ambient loop for menu music
                if (trackName === 'menu') {
                    this.createMenuLoop(music);
                }
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
            
            const frequency = frequencies[currentIndex];
            music.oscillator.frequency.setValueAtTime(frequency, music.context.currentTime);
            
            currentIndex = (currentIndex + 1) % frequencies.length;
            
            setTimeout(playNote, 2000);
        };
        
        setTimeout(playNote, 2000);
    }

    stopMusic() {
        if (this.currentMusic) {
            const music = this.music[this.currentMusic];
            if (music && music.isPlaying) {
                try {
                    music.oscillator.stop();
                    music.isPlaying = false;
                } catch (error) {
                    console.warn('Could not stop music:', error);
                }
            }
            this.currentMusic = null;
        }
    }

    pauseMusic() {
        if (this.currentMusic) {
            const music = this.music[this.currentMusic];
            if (music && music.isPlaying) {
                music.gainNode.gain.setValueAtTime(0, music.context.currentTime);
            }
        }
    }

    resumeMusic() {
        if (this.currentMusic) {
            const music = this.music[this.currentMusic];
            if (music && music.isPlaying) {
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
            } catch (error) {
                console.warn('Could not play sound:', error);
            }
        }
    }

    playVictorySequence() {
        if (this.isMuted) return;
        
        // Play victory music
        this.playMusic('victory');
        
        // Play victory sound after a delay
        setTimeout(() => {
            this.playSound('victory');
        }, 500);
        
        // Stop victory music after 5 seconds
        setTimeout(() => {
            this.stopMusic();
        }, 5000);
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.currentMusic) {
            const music = this.music[this.currentMusic];
            if (music && music.isPlaying) {
                music.gainNode.gain.setValueAtTime(this.musicVolume, music.context.currentTime);
            }
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        
        // Update all sound volumes
        Object.values(this.sounds).forEach(sound => {
            sound.volume(this.sfxVolume);
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopMusic();
        } else {
            // Resume music if it was playing
            if (this.currentMusic) {
                this.playMusic(this.currentMusic);
            }
        }
        
        return this.isMuted;
    }

    createPitchShiftedSound(baseSound, pitchRatio) {
        // Create a pitch-shifted version of a sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440 * pitchRatio, audioContext.currentTime);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        
        return { oscillator, gainNode };
    }

    playPuzzleMoveSound() {
        // Create a satisfying puzzle move sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    playPuzzleRotateSound() {
        // Create a rotation sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
    }

    playHintSound() {
        // Create a hint sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.1, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    destroy() {
        // Stop all music
        this.stopMusic();
        
        // Stop all sounds
        Object.values(this.sounds).forEach(sound => {
            sound.stop();
        });
        
        // Close audio contexts
        Object.values(this.music).forEach(music => {
            if (music.context) {
                music.context.close();
            }
        });
    }
} 