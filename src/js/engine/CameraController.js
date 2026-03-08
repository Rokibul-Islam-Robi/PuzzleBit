import * as THREE from 'three';
import { gsap } from 'gsap';

export class CameraController {
    constructor(camera) {
        this.camera = camera;
        this.currentLevel = 1;
        this.isAnimating = false;
    }

    moveToLevelView(levelNumber) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentLevel = levelNumber;
        
        const positions = this.getLevelCameraPosition(levelNumber);
        
        gsap.to(this.camera.position, {
            x: positions.x,
            y: positions.y,
            z: positions.z,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
        
        // Animate camera look at
        gsap.to(this.camera.lookAt, {
            x: positions.lookAt.x,
            y: positions.lookAt.y,
            z: positions.lookAt.z,
            duration: 1.5,
            ease: "power2.inOut"
        });
    }

    getLevelCameraPosition(levelNumber) {
        const positions = {
            1: {
                x: 0, y: 6, z: 6,
                lookAt: { x: 0, y: 0, z: 0 }
            },
            2: {
                x: 2, y: 7, z: 7,
                lookAt: { x: 0, y: 0, z: 0 }
            },
            3: {
                x: -2, y: 8, z: 8,
                lookAt: { x: 0, y: 0, z: 0 }
            },
            4: {
                x: 0, y: 10, z: 10,
                lookAt: { x: 0, y: 0, z: 0 }
            },
            5: {
                x: 3, y: 12, z: 12,
                lookAt: { x: 0, y: 0, z: 0 }
            }
        };
        
        return positions[levelNumber] || positions[1];
    }

    zoomIn() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const currentPos = this.camera.position.clone();
        const targetPos = currentPos.clone().multiplyScalar(0.7);
        
        gsap.to(this.camera.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
    }

    zoomOut() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const currentPos = this.camera.position.clone();
        const targetPos = currentPos.clone().multiplyScalar(1.3);
        
        gsap.to(this.camera.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
    }

    orbitAround(angle) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const currentPos = this.camera.position.clone();
        const radius = Math.sqrt(currentPos.x * currentPos.x + currentPos.z * currentPos.z);
        const currentAngle = Math.atan2(currentPos.z, currentPos.x);
        const newAngle = currentAngle + angle;
        
        gsap.to(this.camera.position, {
            x: radius * Math.cos(newAngle),
            z: radius * Math.sin(newAngle),
            duration: 1.0,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
    }

    focusOnPiece(piecePosition) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const targetPos = piecePosition.clone().add(new THREE.Vector3(2, 3, 2));
        
        gsap.to(this.camera.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
        
        gsap.to(this.camera.lookAt, {
            x: piecePosition.x,
            y: piecePosition.y,
            z: piecePosition.z,
            duration: 0.8,
            ease: "power2.inOut"
        });
    }

    shake(duration = 0.3, intensity = 0.1) {
        if (this.isAnimating) return;
        
        const originalPos = this.camera.position.clone();
        const shakeCount = 10;
        const shakeInterval = duration / shakeCount;
        
        for (let i = 0; i < shakeCount; i++) {
            setTimeout(() => {
                this.camera.position.x = originalPos.x + (Math.random() - 0.5) * intensity;
                this.camera.position.y = originalPos.y + (Math.random() - 0.5) * intensity;
                this.camera.position.z = originalPos.z + (Math.random() - 0.5) * intensity;
            }, i * shakeInterval);
        }
        
        // Return to original position
        setTimeout(() => {
            gsap.to(this.camera.position, {
                x: originalPos.x,
                y: originalPos.y,
                z: originalPos.z,
                duration: 0.2,
                ease: "power2.out"
            });
        }, duration);
    }

    cinematicIntro() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startPos = new THREE.Vector3(0, 15, 15);
        const endPos = this.getLevelCameraPosition(this.currentLevel);
        
        this.camera.position.copy(startPos);
        
        gsap.to(this.camera.position, {
            x: endPos.x,
            y: endPos.y,
            z: endPos.z,
            duration: 2.5,
            ease: "power3.out",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
        
        gsap.to(this.camera.lookAt, {
            x: endPos.lookAt.x,
            y: endPos.lookAt.y,
            z: endPos.lookAt.z,
            duration: 2.5,
            ease: "power3.out"
        });
    }

    victoryAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const originalPos = this.camera.position.clone();
        
        // Move camera up and back
        gsap.to(this.camera.position, {
            y: originalPos.y + 3,
            z: originalPos.z + 2,
            duration: 1.5,
            ease: "power2.inOut"
        });
        
        // Rotate camera slightly
        gsap.to(this.camera.rotation, {
            y: this.camera.rotation.y + 0.2,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
                // Return to original position
                gsap.to(this.camera.position, {
                    x: originalPos.x,
                    y: originalPos.y,
                    z: originalPos.z,
                    duration: 1.0,
                    ease: "power2.inOut"
                });
                
                gsap.to(this.camera.rotation, {
                    y: this.camera.rotation.y - 0.2,
                    duration: 1.0,
                    ease: "power2.inOut",
                    onComplete: () => {
                        this.isAnimating = false;
                    }
                });
            }
        });
    }

    resetToDefault() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const defaultPos = this.getLevelCameraPosition(this.currentLevel);
        
        gsap.to(this.camera.position, {
            x: defaultPos.x,
            y: defaultPos.y,
            z: defaultPos.z,
            duration: 1.0,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
        
        gsap.to(this.camera.lookAt, {
            x: defaultPos.lookAt.x,
            y: defaultPos.lookAt.y,
            z: defaultPos.lookAt.z,
            duration: 1.0,
            ease: "power2.inOut"
        });
    }
} 