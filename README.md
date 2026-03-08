# PuzzleBit - 3D Animated Puzzle Game

A modern, addictive 3D puzzle game built with Three.js, featuring smooth graphics, animated interfaces, and engaging gameplay mechanics.

## 🎮 Game Features

### Core Gameplay
- **3D Puzzle Mechanics**: Rotate, move, and arrange 3D puzzle pieces
- **Multiple Puzzle Types**: Crystals, gems, orbs, prisms, stars, and diamonds
- **Progressive Difficulty**: 5 unique levels with increasing complexity
- **Smooth Animations**: GSAP-powered animations for fluid interactions
- **Real-time Physics**: Realistic piece movement and collision detection

### Visual & Audio
- **Stunning 3D Graphics**: High-quality Three.js rendering with shadows and lighting
- **Dynamic Lighting System**: Level-specific lighting effects and atmospheric ambiance
- **Particle Effects**: Score effects, completion celebrations, and background particles
- **Smooth Camera Controls**: Orbit controls with cinematic transitions
- **Immersive Audio**: Dynamic background music and sound effects

### User Interface
- **Modern UI Design**: Clean, responsive interface with smooth transitions
- **Animated Menus**: Beautiful loading screens and menu transitions
- **Real-time Statistics**: Score, moves, and timer tracking
- **Hint System**: Visual hints to guide players through difficult puzzles
- **Progress Tracking**: Level completion and achievement system

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Touch Controls**: Full touch support for mobile gameplay
- **Keyboard Shortcuts**: Arrow keys for movement, space for rotation
- **Performance Optimized**: Efficient rendering and memory management
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/puzzlebit.git
   cd puzzlebit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 How to Play

### Controls
- **Mouse/Touch**: Click and drag puzzle pieces
- **Arrow Keys**: Move selected pieces
- **Spacebar**: Rotate selected pieces
- **Escape**: Pause game

### Gameplay
1. **Select Pieces**: Click on puzzle pieces to select them
2. **Arrange Grid**: Move pieces to their correct positions
3. **Match Patterns**: Align pieces to complete the puzzle
4. **Score Points**: Earn points for efficient solutions
5. **Progress**: Unlock new levels by completing puzzles

### Level Progression
- **Level 1**: Crystal Cave (3x3 grid) - Introduction to basic mechanics
- **Level 2**: Gem Mine (4x4 grid) - Added complexity with time pressure
- **Level 3**: Orb Sanctuary (4x4 grid) - Floating pieces and new elements
- **Level 4**: Prism Temple (5x5 grid) - Rotation-locked pieces
- **Level 5**: Star Nexus (5x5 grid) - Ultimate challenge with all mechanics

## 🛠️ Development

### Project Structure
```
puzzlebit/
├── src/
│   ├── js/
│   │   ├── engine/          # 3D game engine components
│   │   ├── ui/             # User interface management
│   │   ├── audio/          # Audio system
│   │   ├── levels/         # Level management
│   │   └── effects/        # Particle and visual effects
│   └── styles/             # CSS styles and animations
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Build configuration
└── README.md              # This file
```

### Key Technologies
- **Three.js**: 3D graphics and rendering
- **GSAP**: Animation library for smooth transitions
- **Howler.js**: Audio management
- **Vite**: Build tool and development server
- **ES6 Modules**: Modern JavaScript architecture

### Architecture
- **Modular Design**: Separated concerns with clear component boundaries
- **Event-Driven**: Clean communication between game systems
- **Performance Focused**: Optimized rendering and memory usage
- **Extensible**: Easy to add new levels, pieces, and features

## 🎨 Customization

### Adding New Levels
1. Edit `src/js/levels/LevelManager.js`
2. Add level configuration to `initializeLevels()`
3. Create level-specific effects in `GameEngine.js`

### Adding New Puzzle Pieces
1. Edit `src/js/engine/PuzzlePiece.js`
2. Add new piece type to `createMesh()`
3. Update level configurations to include new piece types

### Customizing Visual Effects
1. Edit `src/js/effects/ParticleSystem.js`
2. Modify `src/js/engine/LightingSystem.js` for lighting changes
3. Update CSS animations in `src/styles/main.css`

## 🐛 Troubleshooting

### Common Issues

**Game doesn't load**
- Check browser console for errors
- Ensure all dependencies are installed
- Verify WebGL support in your browser

**Performance issues**
- Reduce particle count in ParticleSystem.js
- Lower shadow map resolution in LightingSystem.js
- Disable some visual effects for mobile devices

**Audio not working**
- Check browser autoplay policies
- Ensure user interaction before audio plays
- Verify audio context initialization

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎯 Roadmap

### Planned Features
- [ ] Multiplayer support
- [ ] Level editor
- [ ] More puzzle types
- [ ] Advanced lighting effects
- [ ] Mobile app version
- [ ] Leaderboards
- [ ] Custom themes
- [ ] VR support

### Performance Optimizations
- [ ] WebGL 2.0 features
- [ ] Instanced rendering
- [ ] Level-of-detail system
- [ ] Texture compression
- [ ] Audio streaming

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review browser compatibility

## 🙏 Acknowledgments

- Three.js community for the amazing 3D library
- GSAP team for smooth animations
- Howler.js for audio management
- All contributors and testers

---

**Enjoy playing PuzzleBit! 🎮✨** 