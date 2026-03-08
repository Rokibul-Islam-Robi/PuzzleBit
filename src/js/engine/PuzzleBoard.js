import * as THREE from 'three';
import { gsap } from 'gsap';

export class PuzzleBoard {
    constructor(levelNumber) {
        this.levelNumber = levelNumber;
        this.gridSize = this.getGridSize(levelNumber);
        this.mesh = this.createBoard();
        this.gridPositions = this.calculateGridPositions();
    }

    getGridSize(levelNumber) {
        const sizes = {
            1: { rows: 3, cols: 3 },
            2: { rows: 4, cols: 4 },
            3: { rows: 4, cols: 4 },
            4: { rows: 5, cols: 5 },
            5: { rows: 5, cols: 5 }
        };
        
        return sizes[levelNumber] || sizes[1];
    }

    createBoard() {
        const group = new THREE.Group();
        
        // Create base platform
        const baseGeometry = new THREE.BoxGeometry(
            this.gridSize.cols * 1.5,
            0.2,
            this.gridSize.rows * 1.5
        );
        
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a1a3a,
            transparent: true,
            opacity: 0.8,
            shininess: 50
        });
        
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        baseMesh.position.y = -0.1;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);
        
        // Create grid lines
        this.createGridLines(group);
        
        // Create border
        this.createBorder(group);
        
        // Create ambient glow
        this.createAmbientGlow(group);
        
        return group;
    }

    createGridLines(group) {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x4ecdc4,
            transparent: true,
            opacity: 0.3
        });
        
        const spacing = 1.2;
        const halfWidth = (this.gridSize.cols - 1) * spacing / 2;
        const halfHeight = (this.gridSize.rows - 1) * spacing / 2;
        
        // Vertical lines
        for (let i = 0; i <= this.gridSize.cols; i++) {
            const x = (i - this.gridSize.cols / 2) * spacing;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, 0.1, -halfHeight),
                new THREE.Vector3(x, 0.1, halfHeight)
            ]);
            const line = new THREE.Line(geometry, lineMaterial);
            group.add(line);
        }
        
        // Horizontal lines
        for (let i = 0; i <= this.gridSize.rows; i++) {
            const z = (i - this.gridSize.rows / 2) * spacing;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-halfWidth, 0.1, z),
                new THREE.Vector3(halfWidth, 0.1, z)
            ]);
            const line = new THREE.Line(geometry, lineMaterial);
            group.add(line);
        }
    }

    createBorder(group) {
        const borderGeometry = new THREE.BoxGeometry(
            this.gridSize.cols * 1.5 + 0.2,
            0.3,
            this.gridSize.rows * 1.5 + 0.2
        );
        
        const borderMaterial = new THREE.MeshPhongMaterial({
            color: 0x4ecdc4,
            transparent: true,
            opacity: 0.6,
            emissive: 0x1a4a47,
            emissiveIntensity: 0.2
        });
        
        const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
        borderMesh.position.y = -0.25;
        group.add(borderMesh);
        
        // Animate border glow
        gsap.to(borderMaterial, {
            emissiveIntensity: 0.4,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    createAmbientGlow(group) {
        // Create ambient light source
        const ambientLight = new THREE.PointLight(0x4ecdc4, 0.3, 10);
        ambientLight.position.set(0, 2, 0);
        group.add(ambientLight);
        
        // Animate ambient light
        gsap.to(ambientLight, {
            intensity: 0.6,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    calculateGridPositions() {
        const positions = [];
        const spacing = 1.2;
        
        for (let row = 0; row < this.gridSize.rows; row++) {
            positions[row] = [];
            for (let col = 0; col < this.gridSize.cols; col++) {
                positions[row][col] = new THREE.Vector3(
                    (col - (this.gridSize.cols - 1) / 2) * spacing,
                    0.5,
                    (row - (this.gridSize.rows - 1) / 2) * spacing
                );
            }
        }
        
        return positions;
    }

    getGridPosition(row, col) {
        if (row >= 0 && row < this.gridSize.rows && 
            col >= 0 && col < this.gridSize.cols) {
            return this.gridPositions[row][col];
        }
        return null;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < this.gridSize.rows && 
               col >= 0 && col < this.gridSize.cols;
    }

    getNearestGridPosition(worldPosition) {
        let nearestRow = 0;
        let nearestCol = 0;
        let minDistance = Infinity;
        
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                const gridPos = this.gridPositions[row][col];
                const distance = worldPosition.distanceTo(gridPos);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestRow = row;
                    nearestCol = col;
                }
            }
        }
        
        return { row: nearestRow, col: nearestCol };
    }

    highlightGridPosition(row, col, color = 0x4ecdc4) {
        if (!this.isValidPosition(row, col)) return;
        
        const position = this.gridPositions[row][col];
        
        // Create highlight effect
        const highlightGeometry = new THREE.CircleGeometry(0.3, 16);
        const highlightMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        
        const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        highlight.position.copy(position);
        highlight.position.y = 0.15;
        highlight.rotation.x = -Math.PI / 2;
        
        this.mesh.add(highlight);
        
        // Animate highlight
        gsap.to(highlight.material, {
            opacity: 0.8,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.mesh.remove(highlight);
            }
        });
    }

    createSnapEffect(position) {
        // Create snap effect particles
        const particleCount = 8;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 0.5;
            
            positions[i * 3] = position.x + Math.cos(angle) * radius;
            positions[i * 3 + 1] = position.y + 0.5;
            positions[i * 3 + 2] = position.z + Math.sin(angle) * radius;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x4ecdc4,
            size: 0.1,
            transparent: true,
            opacity: 1
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.mesh.add(particleSystem);
        
        // Animate particles
        gsap.to(particleSystem.material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.mesh.remove(particleSystem);
            }
        });
        
        gsap.to(particleSystem.scale, {
            x: 2,
            y: 2,
            z: 2,
            duration: 0.5
        });
    }

    addLevelSpecificEffects() {
        switch (this.levelNumber) {
            case 1:
                this.addCrystalCaveEffects();
                break;
            case 2:
                this.addGemMineEffects();
                break;
            case 3:
                this.addOrbSanctuaryEffects();
                break;
            case 4:
                this.addPrismTempleEffects();
                break;
            case 5:
                this.addStarNexusEffects();
                break;
        }
    }

    addCrystalCaveEffects() {
        // Add crystal formations around the board
        for (let i = 0; i < 4; i++) {
            const crystal = this.createCrystalFormation();
            const angle = (i / 4) * Math.PI * 2;
            const radius = 8;
            
            crystal.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            
            this.mesh.add(crystal);
        }
    }

    createCrystalFormation() {
        const group = new THREE.Group();
        const crystalCount = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < crystalCount; i++) {
            const geometry = new THREE.OctahedronGeometry(0.3);
            const material = new THREE.MeshPhongMaterial({
                color: 0x4ecdc4,
                transparent: true,
                opacity: 0.7
            });
            
            const crystal = new THREE.Mesh(geometry, material);
            crystal.position.set(
                (Math.random() - 0.5) * 2,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
            );
            
            group.add(crystal);
        }
        
        return group;
    }

    addGemMineEffects() {
        // Add gem deposits
        for (let i = 0; i < 6; i++) {
            const gemDeposit = this.createGemDeposit();
            const angle = (i / 6) * Math.PI * 2;
            const radius = 6;
            
            gemDeposit.position.set(
                Math.cos(angle) * radius,
                -0.5,
                Math.sin(angle) * radius
            );
            
            this.mesh.add(gemDeposit);
        }
    }

    createGemDeposit() {
        const group = new THREE.Group();
        const gemCount = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < gemCount; i++) {
            const geometry = new THREE.DodecahedronGeometry(0.2);
            const material = new THREE.MeshPhongMaterial({
                color: 0xff6b6b,
                transparent: true,
                opacity: 0.8
            });
            
            const gem = new THREE.Mesh(geometry, material);
            gem.position.set(
                (Math.random() - 0.5) * 3,
                Math.random() * 1,
                (Math.random() - 0.5) * 3
            );
            
            group.add(gem);
        }
        
        return group;
    }

    addOrbSanctuaryEffects() {
        // Add floating orbs around the board
        for (let i = 0; i < 5; i++) {
            const orb = this.createOrb();
            const angle = (i / 5) * Math.PI * 2;
            const radius = 7;
            
            orb.position.set(
                Math.cos(angle) * radius,
                Math.random() * 3 + 2,
                Math.sin(angle) * radius
            );
            
            this.mesh.add(orb);
            
            // Animate orb floating
            gsap.to(orb.position, {
                y: orb.position.y + 1,
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }

    createOrb() {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x45b7d1,
            transparent: true,
            opacity: 0.6
        });
        
        return new THREE.Mesh(geometry, material);
    }

    addPrismTempleEffects() {
        // Add prism pillars
        for (let i = 0; i < 4; i++) {
            const prism = this.createPrismPillar();
            const angle = (i / 4) * Math.PI * 2;
            const radius = 6;
            
            prism.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            
            this.mesh.add(prism);
        }
    }

    createPrismPillar() {
        const geometry = new THREE.ConeGeometry(0.4, 3, 6);
        const material = new THREE.MeshPhongMaterial({
            color: 0x96ceb4,
            transparent: true,
            opacity: 0.8
        });
        
        const prism = new THREE.Mesh(geometry, material);
        prism.position.y = 1.5;
        
        return prism;
    }

    addStarNexusEffects() {
        // Add star formations
        for (let i = 0; i < 3; i++) {
            const star = this.createStarFormation();
            const angle = (i / 3) * Math.PI * 2;
            const radius = 5;
            
            star.position.set(
                Math.cos(angle) * radius,
                Math.random() * 2 + 1,
                Math.sin(angle) * radius
            );
            
            this.mesh.add(star);
        }
    }

    createStarFormation() {
        const group = new THREE.Group();
        const starGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const starMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.8
        });
        
        for (let i = 0; i < 6; i++) {
            const starPiece = new THREE.Mesh(starGeometry, starMaterial);
            const angle = (i / 6) * Math.PI * 2;
            const radius = 1;
            
            starPiece.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
            
            group.add(starPiece);
        }
        
        return group;
    }

    destroy() {
        // Clean up animations
        gsap.killTweensOf(this.mesh);
        
        // Remove from scene
        if (this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
    }
} 