import * as THREE from 'three';
import { gsap } from 'gsap';

export class PuzzlePiece {
    constructor(row, col, type, gameEngine) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.gameEngine = gameEngine;
        this.isSelected = false;
        this.isDragging = false;
        this.originalPosition = null;
        this.targetPosition = null;
        
        this.mesh = this.createMesh();
        this.setupPosition();
    }

    createMesh() {
        let geometry, material;
        
        switch (this.type) {
            case 'crystal':
                geometry = new THREE.OctahedronGeometry(0.4);
                material = new THREE.MeshPhongMaterial({
                    color: 0x4ecdc4,
                    transparent: true,
                    opacity: 0.9,
                    shininess: 100,
                    emissive: 0x1a4a47,
                    emissiveIntensity: 0.1
                });
                break;
                
            case 'gem':
                geometry = new THREE.DodecahedronGeometry(0.4);
                material = new THREE.MeshPhongMaterial({
                    color: 0xff6b6b,
                    transparent: true,
                    opacity: 0.9,
                    shininess: 120,
                    emissive: 0x4a1a1a,
                    emissiveIntensity: 0.1
                });
                break;
                
            case 'orb':
                geometry = new THREE.SphereGeometry(0.4, 16, 16);
                material = new THREE.MeshPhongMaterial({
                    color: 0x45b7d1,
                    transparent: true,
                    opacity: 0.8,
                    shininess: 80,
                    emissive: 0x1a3a4a,
                    emissiveIntensity: 0.1
                });
                break;
                
            case 'prism':
                geometry = new THREE.ConeGeometry(0.3, 0.8, 6);
                material = new THREE.MeshPhongMaterial({
                    color: 0x96ceb4,
                    transparent: true,
                    opacity: 0.9,
                    shininess: 120,
                    emissive: 0x1a4a3a,
                    emissiveIntensity: 0.1
                });
                break;
                
            case 'star':
                geometry = new THREE.TetrahedronGeometry(0.4);
                material = new THREE.MeshPhongMaterial({
                    color: 0xffd700,
                    transparent: true,
                    opacity: 0.9,
                    shininess: 150,
                    emissive: 0x4a4a1a,
                    emissiveIntensity: 0.2
                });
                break;
                
            case 'diamond':
                geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
                material = new THREE.MeshPhongMaterial({
                    color: 0xe91e63,
                    transparent: true,
                    opacity: 0.9,
                    shininess: 200,
                    emissive: 0x4a1a2a,
                    emissiveIntensity: 0.15
                });
                break;
                
            default:
                geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
                material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
        }
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Add glow effect
        this.addGlowEffect(mesh);
        
        return mesh;
    }

    addGlowEffect(mesh) {
        const glowGeometry = mesh.geometry.clone();
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: mesh.material.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.scale.multiplyScalar(1.2);
        mesh.add(glowMesh);
        
        // Animate glow
        gsap.to(glowMesh.material, {
            opacity: 0.6,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    setupPosition() {
        const spacing = 1.2;
        this.originalPosition = new THREE.Vector3(
            (this.col - 1) * spacing,
            0.5,
            (this.row - 1) * spacing
        );
        
        this.mesh.position.copy(this.originalPosition);
        
        // Add floating animation
        this.addFloatingAnimation();
    }

    addFloatingAnimation() {
        gsap.to(this.mesh.position, {
            y: this.originalPosition.y + 0.1,
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Add rotation animation
        gsap.to(this.mesh.rotation, {
            y: Math.PI * 2,
            duration: 8 + Math.random() * 4,
            repeat: -1,
            ease: "none"
        });
    }

    onSelect() {
        this.isSelected = true;
        
        // Visual feedback
        gsap.to(this.mesh.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 0.2,
            ease: "back.out(1.7)"
        });
        
        gsap.to(this.mesh.material, {
            emissiveIntensity: 0.5,
            duration: 0.2
        });
        
        // Add selection glow
        this.addSelectionGlow();
    }

    onDrag(point) {
        if (!this.isSelected) return;
        
        this.isDragging = true;
        
        // Move piece to mouse position
        gsap.to(this.mesh.position, {
            x: point.x,
            y: point.y + 0.5,
            z: point.z,
            duration: 0.1,
            ease: "power2.out"
        });
    }

    onRelease() {
        this.isSelected = false;
        this.isDragging = false;
        
        // Return to original scale
        gsap.to(this.mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.2,
            ease: "back.out(1.7)"
        });
        
        gsap.to(this.mesh.material, {
            emissiveIntensity: 0.1,
            duration: 0.2
        });
        
        // Return to original position
        gsap.to(this.mesh.position, {
            x: this.originalPosition.x,
            y: this.originalPosition.y,
            z: this.originalPosition.z,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
        
        // Remove selection glow
        this.removeSelectionGlow();
        
        // Check if puzzle is solved
        this.checkPuzzleSolved();
    }

    addSelectionGlow() {
        if (this.selectionGlow) return;
        
        const glowGeometry = this.mesh.geometry.clone();
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4,
            side: THREE.BackSide
        });
        
        this.selectionGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.selectionGlow.scale.multiplyScalar(1.5);
        this.mesh.add(this.selectionGlow);
        
        // Animate selection glow
        gsap.to(this.selectionGlow.material, {
            opacity: 0.8,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    removeSelectionGlow() {
        if (this.selectionGlow) {
            this.mesh.remove(this.selectionGlow);
            this.selectionGlow = null;
        }
    }

    canMove() {
        // Implement movement validation logic
        return true;
    }

    checkPuzzleSolved() {
        // Check if all pieces are in correct positions
        const allCorrect = this.gameEngine.puzzlePieces.every(piece => 
            piece.isInCorrectPosition()
        );
        
        if (allCorrect) {
            this.gameEngine.game.onPuzzleSolved();
        }
    }

    isInCorrectPosition() {
        const tolerance = 0.1;
        const currentPos = this.mesh.position;
        const targetPos = this.originalPosition;
        
        return Math.abs(currentPos.x - targetPos.x) < tolerance &&
               Math.abs(currentPos.y - targetPos.y) < tolerance &&
               Math.abs(currentPos.z - targetPos.z) < tolerance;
    }

    moveToPosition(targetRow, targetCol, duration = 0.5) {
        const spacing = 1.2;
        const newPosition = new THREE.Vector3(
            (targetCol - 1) * spacing,
            0.5,
            (targetRow - 1) * spacing
        );
        
        gsap.to(this.mesh.position, {
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z,
            duration: duration,
            ease: "back.out(1.7)"
        });
        
        this.row = targetRow;
        this.col = targetCol;
        this.originalPosition.copy(newPosition);
    }

    swapWith(otherPiece) {
        const tempRow = this.row;
        const tempCol = this.col;
        const tempPosition = this.originalPosition.clone();
        
        this.moveToPosition(otherPiece.row, otherPiece.col);
        otherPiece.moveToPosition(tempRow, tempCol);
    }

    rotate(angle) {
        gsap.to(this.mesh.rotation, {
            y: this.mesh.rotation.y + angle,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    }

    highlight() {
        gsap.to(this.mesh.material, {
            emissiveIntensity: 0.8,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    }

    update(delta) {
        // Update any ongoing animations or effects
        if (this.mesh.userData.update) {
            this.mesh.userData.update(delta);
        }
    }

    destroy() {
        // Clean up animations
        gsap.killTweensOf(this.mesh);
        gsap.killTweensOf(this.mesh.material);
        
        // Remove from scene
        if (this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
    }
} 