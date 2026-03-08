import * as THREE from 'three';
import { gsap } from 'gsap';

export class LightingSystem {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
        this.isAnimating = false;
        
        this.setupLighting();
    }

    setupLighting() {
        // Ambient light for overall illumination
        this.lights.ambient = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(this.lights.ambient);
        
        // Main directional light
        this.lights.main = new THREE.DirectionalLight(0xffffff, 0.8);
        this.lights.main.position.set(10, 10, 5);
        this.lights.main.castShadow = true;
        this.lights.main.shadow.mapSize.width = 2048;
        this.lights.main.shadow.mapSize.height = 2048;
        this.lights.main.shadow.camera.near = 0.5;
        this.lights.main.shadow.camera.far = 50;
        this.lights.main.shadow.camera.left = -10;
        this.lights.main.shadow.camera.right = 10;
        this.lights.main.shadow.camera.top = 10;
        this.lights.main.shadow.camera.bottom = -10;
        this.scene.add(this.lights.main);
        
        // Fill light for softer shadows
        this.lights.fill = new THREE.DirectionalLight(0x4ecdc4, 0.3);
        this.lights.fill.position.set(-5, 5, -5);
        this.scene.add(this.lights.fill);
        
        // Rim light for dramatic effect
        this.lights.rim = new THREE.DirectionalLight(0xff6b6b, 0.2);
        this.lights.rim.position.set(0, 5, -10);
        this.scene.add(this.lights.rim);
        
        // Point lights for atmospheric effect
        this.createAtmosphericLights();
        
        // Start ambient animations
        this.startAmbientAnimations();
    }

    createAtmosphericLights() {
        // Create multiple point lights for atmospheric effect
        const lightColors = [0x4ecdc4, 0xff6b6b, 0x45b7d1, 0x96ceb4];
        const lightPositions = [
            { x: 8, y: 3, z: 8 },
            { x: -8, y: 4, z: -8 },
            { x: 8, y: 5, z: -8 },
            { x: -8, y: 3, z: 8 }
        ];
        
        lightColors.forEach((color, index) => {
            const light = new THREE.PointLight(color, 0.4, 15);
            light.position.set(
                lightPositions[index].x,
                lightPositions[index].y,
                lightPositions[index].z
            );
            light.castShadow = true;
            light.shadow.mapSize.width = 512;
            light.shadow.mapSize.height = 512;
            
            this.lights[`atmospheric_${index}`] = light;
            this.scene.add(light);
        });
    }

    startAmbientAnimations() {
        // Animate main light
        gsap.to(this.lights.main.position, {
            x: 12,
            y: 12,
            z: 7,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Animate atmospheric lights
        Object.keys(this.lights).forEach(key => {
            if (key.startsWith('atmospheric_')) {
                const light = this.lights[key];
                gsap.to(light.position, {
                    y: light.position.y + 2,
                    duration: 4 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
                
                gsap.to(light, {
                    intensity: 0.6,
                    duration: 3 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        });
    }

    setLevelLighting(levelNumber) {
        const lightingConfigs = {
            1: { // Crystal Cave
                ambient: { color: 0x4ecdc4, intensity: 0.4 },
                main: { color: 0x4ecdc4, intensity: 0.9 },
                fill: { color: 0x45b7d1, intensity: 0.4 },
                rim: { color: 0x4ecdc4, intensity: 0.3 }
            },
            2: { // Gem Mine
                ambient: { color: 0xff6b6b, intensity: 0.3 },
                main: { color: 0xff6b6b, intensity: 0.8 },
                fill: { color: 0xe91e63, intensity: 0.3 },
                rim: { color: 0xff6b6b, intensity: 0.2 }
            },
            3: { // Orb Sanctuary
                ambient: { color: 0x45b7d1, intensity: 0.5 },
                main: { color: 0x45b7d1, intensity: 0.9 },
                fill: { color: 0x2196f3, intensity: 0.4 },
                rim: { color: 0x45b7d1, intensity: 0.3 }
            },
            4: { // Prism Temple
                ambient: { color: 0x96ceb4, intensity: 0.4 },
                main: { color: 0x96ceb4, intensity: 0.8 },
                fill: { color: 0x4caf50, intensity: 0.3 },
                rim: { color: 0x96ceb4, intensity: 0.2 }
            },
            5: { // Star Nexus
                ambient: { color: 0xffd700, intensity: 0.5 },
                main: { color: 0xffd700, intensity: 1.0 },
                fill: { color: 0xff9800, intensity: 0.4 },
                rim: { color: 0xffd700, intensity: 0.3 }
            }
        };
        
        const config = lightingConfigs[levelNumber] || lightingConfigs[1];
        
        // Animate lighting transition
        gsap.to(this.lights.ambient, {
            color: config.ambient.color,
            intensity: config.ambient.intensity,
            duration: 2.0,
            ease: "power2.inOut"
        });
        
        gsap.to(this.lights.main, {
            color: config.main.color,
            intensity: config.main.intensity,
            duration: 2.0,
            ease: "power2.inOut"
        });
        
        gsap.to(this.lights.fill, {
            color: config.fill.color,
            intensity: config.fill.intensity,
            duration: 2.0,
            ease: "power2.inOut"
        });
        
        gsap.to(this.lights.rim, {
            color: config.rim.color,
            intensity: config.rim.intensity,
            duration: 2.0,
            ease: "power2.inOut"
        });
    }

    createSpotlight(position, target, color = 0xffffff, intensity = 1.0) {
        const spotlight = new THREE.SpotLight(color, intensity, 20, Math.PI / 6, 0.5, 1);
        spotlight.position.copy(position);
        spotlight.target.position.copy(target);
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 1024;
        spotlight.shadow.mapSize.height = 1024;
        
        this.scene.add(spotlight);
        this.scene.add(spotlight.target);
        
        return spotlight;
    }

    createPulseEffect(duration = 0.5) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Pulse all lights
        Object.values(this.lights).forEach(light => {
            if (light.intensity !== undefined) {
                const originalIntensity = light.intensity;
                
                gsap.to(light, {
                    intensity: originalIntensity * 2,
                    duration: duration / 2,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(light, {
                            intensity: originalIntensity,
                            duration: duration / 2,
                            ease: "power2.in"
                        });
                    }
                });
            }
        });
        
        setTimeout(() => {
            this.isAnimating = false;
        }, duration);
    }

    createVictoryLighting() {
        // Create dramatic victory lighting
        const victoryColors = [0xffd700, 0xff6b6b, 0x4ecdc4, 0x45b7d1];
        let colorIndex = 0;
        
        const colorCycle = setInterval(() => {
            const color = victoryColors[colorIndex];
            
            gsap.to(this.lights.main, {
                color: color,
                intensity: 1.2,
                duration: 0.3,
                ease: "power2.inOut"
            });
            
            gsap.to(this.lights.ambient, {
                color: color,
                intensity: 0.6,
                duration: 0.3,
                ease: "power2.inOut"
            });
            
            colorIndex = (colorIndex + 1) % victoryColors.length;
        }, 200);
        
        // Stop color cycling after 3 seconds
        setTimeout(() => {
            clearInterval(colorCycle);
            this.resetToDefault();
        }, 3000);
    }

    createHintLighting(targetPosition) {
        // Create a spotlight on the hint target
        const spotlight = this.createSpotlight(
            targetPosition.clone().add(new THREE.Vector3(0, 5, 0)),
            targetPosition,
            0x4ecdc4,
            2.0
        );
        
        // Animate spotlight
        gsap.to(spotlight, {
            intensity: 0,
            duration: 2.0,
            ease: "power2.out",
            onComplete: () => {
                this.scene.remove(spotlight);
                this.scene.remove(spotlight.target);
            }
        });
    }

    createDramaticLighting() {
        // Reduce ambient light
        gsap.to(this.lights.ambient, {
            intensity: 0.1,
            duration: 1.0,
            ease: "power2.inOut"
        });
        
        // Increase main light intensity
        gsap.to(this.lights.main, {
            intensity: 1.2,
            duration: 1.0,
            ease: "power2.inOut"
        });
        
        // Add dramatic rim lighting
        gsap.to(this.lights.rim, {
            intensity: 0.5,
            duration: 1.0,
            ease: "power2.inOut"
        });
    }

    resetToDefault() {
        gsap.to(this.lights.ambient, {
            color: 0x404040,
            intensity: 0.3,
            duration: 1.0,
            ease: "power2.inOut"
        });
        
        gsap.to(this.lights.main, {
            color: 0xffffff,
            intensity: 0.8,
            duration: 1.0,
            ease: "power2.inOut"
        });
        
        gsap.to(this.lights.fill, {
            color: 0x4ecdc4,
            intensity: 0.3,
            duration: 1.0,
            ease: "power2.inOut"
        });
        
        gsap.to(this.lights.rim, {
            color: 0xff6b6b,
            intensity: 0.2,
            duration: 1.0,
            ease: "power2.inOut"
        });
    }

    update(delta) {
        // Update any dynamic lighting effects
        if (this.lights.main && this.lights.main.position) {
            // Subtle movement for dynamic feel
            this.lights.main.position.x += Math.sin(Date.now() * 0.001) * 0.01;
            this.lights.main.position.z += Math.cos(Date.now() * 0.001) * 0.01;
        }
    }

    destroy() {
        // Clean up all lights
        Object.values(this.lights).forEach(light => {
            if (light.parent) {
                light.parent.remove(light);
            }
        });
        
        // Stop animations
        gsap.killTweensOf(this.lights);
    }
} 