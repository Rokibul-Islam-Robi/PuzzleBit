import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PuzzlePiece } from './PuzzlePiece.js';
import { PuzzleBoard } from './PuzzleBoard.js';
import { CameraController } from './CameraController.js';
import { LightingSystem } from './LightingSystem.js';
import { gsap } from 'gsap';

export class GameEngine {
    constructor(game) {
        this.game = game;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.cameraController = null;
        this.lightingSystem = null;
        
        this.puzzleBoard = null;
        this.puzzlePieces = [];
        this.selectedPiece = null;
        this.isAnimating = false;
        
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLighting();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f0f23);
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x0f0f23, 10, 50);
        
        // Add ambient particles
        this.addAmbientParticles();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 8);
        
        this.cameraController = new CameraController(this.camera);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('game-canvas'),
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupLighting() {
        this.lightingSystem = new LightingSystem(this.scene);
    }

    setupEventListeners() {
        // Mouse events
        this.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // Touch events for mobile
        this.renderer.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.renderer.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.renderer.domElement.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }

    addAmbientParticles() {
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            
            colors[i * 3] = 0.3 + Math.random() * 0.7;
            colors[i * 3 + 1] = 0.3 + Math.random() * 0.7;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        // Animate particles
        gsap.to(particleSystem.rotation, {
            y: Math.PI * 2,
            duration: 20,
            repeat: -1,
            ease: "none"
        });
    }

    startLevel(levelNumber) {
        this.clearLevel();
        
        // Create puzzle board
        this.puzzleBoard = new PuzzleBoard(levelNumber);
        this.scene.add(this.puzzleBoard.mesh);
        
        // Create puzzle pieces
        this.createPuzzlePieces(levelNumber);
        
        // Position camera for level
        this.cameraController.moveToLevelView(levelNumber);
        
        // Add level-specific effects
        this.addLevelEffects(levelNumber);
    }

    createPuzzlePieces(levelNumber) {
        const levelConfig = this.getLevelConfig(levelNumber);
        const { rows, cols, pieceTypes } = levelConfig;
        
        this.puzzlePieces = [];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const piece = new PuzzlePiece(
                    row, col, 
                    pieceTypes[Math.floor(Math.random() * pieceTypes.length)],
                    this
                );
                
                this.puzzlePieces.push(piece);
                this.scene.add(piece.mesh);
                
                // Animate piece entrance
                gsap.from(piece.mesh.position, {
                    y: 10,
                    duration: 0.8,
                    delay: (row + col) * 0.1,
                    ease: "back.out(1.7)"
                });
            }
        }
    }

    getLevelConfig(levelNumber) {
        const configs = {
            1: { rows: 3, cols: 3, pieceTypes: ['crystal', 'gem'] },
            2: { rows: 4, cols: 4, pieceTypes: ['crystal', 'gem', 'orb'] },
            3: { rows: 4, cols: 4, pieceTypes: ['crystal', 'gem', 'orb', 'prism'] },
            4: { rows: 5, cols: 5, pieceTypes: ['crystal', 'gem', 'orb', 'prism', 'star'] },
            5: { rows: 5, cols: 5, pieceTypes: ['crystal', 'gem', 'orb', 'prism', 'star', 'diamond'] }
        };
        
        return configs[levelNumber] || configs[1];
    }

    addLevelEffects(levelNumber) {
        // Add level-specific background elements
        const levelEffects = {
            1: () => this.addCrystalCaveEffects(),
            2: () => this.addGemMineEffects(),
            3: () => this.addOrbSanctuaryEffects(),
            4: () => this.addPrismTempleEffects(),
            5: () => this.addStarNexusEffects()
        };
        
        if (levelEffects[levelNumber]) {
            levelEffects[levelNumber]();
        }
    }

    addCrystalCaveEffects() {
        // Add floating crystals
        for (let i = 0; i < 8; i++) {
            const crystal = this.createCrystal();
            crystal.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 10 + 5,
                (Math.random() - 0.5) * 20
            );
            this.scene.add(crystal);
            
            // Animate floating
            gsap.to(crystal.position, {
                y: crystal.position.y + 2,
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }

    createCrystal() {
        const geometry = new THREE.OctahedronGeometry(0.5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x4ecdc4,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        return new THREE.Mesh(geometry, material);
    }

    addGemMineEffects() {
        // Add gem clusters
        for (let i = 0; i < 6; i++) {
            const gemCluster = this.createGemCluster();
            gemCluster.position.set(
                (Math.random() - 0.5) * 15,
                Math.random() * 8 + 3,
                (Math.random() - 0.5) * 15
            );
            this.scene.add(gemCluster);
        }
    }

    createGemCluster() {
        const group = new THREE.Group();
        const gemCount = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < gemCount; i++) {
            const gem = this.createCrystal();
            gem.position.set(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            gem.material.color.setHex(0xff6b6b);
            group.add(gem);
        }
        
        return group;
    }

    addOrbSanctuaryEffects() {
        // Add floating orbs
        for (let i = 0; i < 5; i++) {
            const orb = this.createOrb();
            orb.position.set(
                (Math.random() - 0.5) * 18,
                Math.random() * 12 + 4,
                (Math.random() - 0.5) * 18
            );
            this.scene.add(orb);
            
            // Rotate orbs
            gsap.to(orb.rotation, {
                y: Math.PI * 2,
                duration: 8 + Math.random() * 4,
                repeat: -1,
                ease: "none"
            });
        }
    }

    createOrb() {
        const geometry = new THREE.SphereGeometry(0.8, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x45b7d1,
            transparent: true,
            opacity: 0.7,
            shininess: 80
        });
        return new THREE.Mesh(geometry, material);
    }

    addPrismTempleEffects() {
        // Add prism structures
        for (let i = 0; i < 4; i++) {
            const prism = this.createPrism();
            prism.position.set(
                (Math.random() - 0.5) * 16,
                Math.random() * 6 + 2,
                (Math.random() - 0.5) * 16
            );
            this.scene.add(prism);
        }
    }

    createPrism() {
        const geometry = new THREE.ConeGeometry(0.6, 2, 6);
        const material = new THREE.MeshPhongMaterial({
            color: 0x96ceb4,
            transparent: true,
            opacity: 0.9,
            shininess: 120
        });
        return new THREE.Mesh(geometry, material);
    }

    addStarNexusEffects() {
        // Add star formations
        for (let i = 0; i < 3; i++) {
            const star = this.createStar();
            star.position.set(
                (Math.random() - 0.5) * 14,
                Math.random() * 10 + 5,
                (Math.random() - 0.5) * 14
            );
            this.scene.add(star);
            
            // Pulse stars
            gsap.to(star.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }

    createStar() {
        const group = new THREE.Group();
        const starGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const starMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.8,
            shininess: 150
        });
        
        for (let i = 0; i < 8; i++) {
            const starPiece = new THREE.Mesh(starGeometry, starMaterial);
            starPiece.position.set(
                Math.cos(i * Math.PI / 4) * 1.5,
                Math.sin(i * Math.PI / 4) * 1.5,
                0
            );
            group.add(starPiece);
        }
        
        return group;
    }

    clearLevel() {
        // Remove puzzle pieces
        this.puzzlePieces.forEach(piece => {
            this.scene.remove(piece.mesh);
        });
        this.puzzlePieces = [];
        
        // Remove puzzle board
        if (this.puzzleBoard) {
            this.scene.remove(this.puzzleBoard.mesh);
            this.puzzleBoard = null;
        }
        
        // Clear level effects (simplified - in a full implementation you'd track these)
        this.scene.children = this.scene.children.filter(child => 
            child.type === 'Points' || child.type === 'DirectionalLight' || 
            child.type === 'AmbientLight' || child.type === 'PointLight'
        );
    }

    restartLevel() {
        this.startLevel(this.game.currentLevel);
    }

    stop() {
        // Stop all animations
        gsap.killTweensOf(this.scene);
        this.puzzlePieces.forEach(piece => {
            gsap.killTweensOf(piece.mesh);
        });
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Mouse and touch event handlers
    onMouseDown(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.puzzlePieces.map(p => p.mesh));
        
        if (intersects.length > 0) {
            this.selectedPiece = this.puzzlePieces.find(p => p.mesh === intersects[0].object);
            if (this.selectedPiece) {
                this.selectedPiece.onSelect();
            }
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        if (this.selectedPiece) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(this.puzzleBoard.mesh);
            
            if (intersects.length > 0) {
                this.selectedPiece.onDrag(intersects[0].point);
            }
        }
    }

    onMouseUp(event) {
        if (this.selectedPiece) {
            this.selectedPiece.onRelease();
            this.selectedPiece = null;
        }
    }

    onTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.onMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
    }

    onTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }

    onTouchEnd(event) {
        event.preventDefault();
        this.onMouseUp(event);
    }

    // Game mechanics
    movePuzzle(direction) {
        if (this.isAnimating) return;
        
        // Implement puzzle movement logic
        console.log('Moving puzzle:', direction);
        this.game.onPuzzleMove();
    }

    rotatePuzzle() {
        if (this.isAnimating) return;
        
        // Implement puzzle rotation logic
        console.log('Rotating puzzle');
        this.game.onPuzzleRotated();
    }

    showHint() {
        // Implement hint system
        console.log('Showing hint');
        
        // Highlight possible moves
        this.puzzlePieces.forEach(piece => {
            if (piece.canMove()) {
                gsap.to(piece.mesh.material, {
                    emissiveIntensity: 0.5,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Update controls
        this.controls.update();
        
        // Update puzzle pieces
        this.puzzlePieces.forEach(piece => piece.update(delta));
        
        // Update lighting
        this.lightingSystem.update(delta);
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
} 