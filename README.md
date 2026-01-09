# 🐾 Paws & Preferences

A fun, interactive single-page web app where users can swipe through cat images to indicate their preferences! Built with HTML, SASS, and TypeScript with a polished iOS-like design.

## ✨ Features

- **Swipe Interactions**: Swipe right to like, left to dislike cat images
- **Touch & Mouse Support**: Works seamlessly on both mobile and desktop
- **Undo Functionality**: Undo your last swipe within 5 seconds
- **Visual Feedback**: Smooth animations and overlay indicators during swipes
- **Progress Tracking**: See how many cats you've swiped through
- **Results Screen**: View all your liked cats in a beautiful grid layout
- **Keyboard Shortcuts**: Use arrow keys to swipe, Ctrl/Cmd+Z to undo
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Landscape Mode Support**: Optimized for both portrait and landscape orientations
- **Playful Messages**: Fun feedback based on how many cats you liked

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine
- A modern web browser

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Building the Project

Compile SASS and TypeScript files:
```bash
npm run build
```

For development with auto-compilation:
```bash
npm run watch
```

### Running the App

Simply open `index.html` in your web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server (install with: npm install -g http-server)
http-server
```

Then navigate to `http://localhost:8000` in your browser.

## 🎮 How to Use

1. **Swipe**: Drag cards left to dislike or right to like
2. **Buttons**: Click the ❌ or ❤️ buttons to vote
3. **Keyboard**: Use arrow keys (← →) to vote
4. **Undo**: Click the undo button or press Ctrl/Cmd+Z within 5 seconds
5. **Results**: After all cats, see your matches and start over!

## 📁 Project Structure

```
Paws_And_Preferences/
├── index.html          # Main HTML structure
├── styles.scss         # SASS stylesheet (source)
├── styles.css          # Compiled CSS
├── app.ts              # TypeScript logic (source)
├── app.js              # Compiled JavaScript
├── tsconfig.json       # TypeScript configuration
├── package.json        # npm configuration
├── README.md           # This file
└── images/             # Cat images (cat1.png - cat10.png)
```

## 🎨 Design Features

- **iOS-Style Aesthetic**: Clean, modern design inspired by iOS
- **Smooth Animations**: Card swipes, overlays, and transitions
- **Depth Effects**: Card stacking with scale and opacity
- **Hover States**: Interactive feedback on all buttons
- **Mobile Optimized**: Touch-friendly with proper viewport settings
- **Visual Indicators**: Clear like/dislike overlays during swipes

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **SASS**: Advanced CSS with variables, mixins, and nesting
- **TypeScript**: Type-safe JavaScript with classes and interfaces
- **Vanilla JS**: No frameworks required
- **CSS Animations**: Smooth, performant transitions

## 🎯 Key Interactions

### Swipe Detection
- Threshold-based swipe recognition
- Smooth drag transforms with rotation
- Real-time overlay feedback

### Undo System
- 5-second window to undo
- Visual timer countdown
- State preservation

### Results Display
- Dynamic messages based on preferences
- Animated card grid
- Hover effects with scale and heart icons

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎉 Fun Details

The app includes playful messages like:
- "Oh no!" (if you liked 0 cats)
- "Pretty Picky!" (if you liked a few cats)
- "Your Purrfect Matches!" (if you liked several cats)
- "Ultimate Cat Lover!" (if you liked almost all cats)

## 📝 Code Structure

### TypeScript Classes
- `PawsAndPreferences`: Main app class handling all logic
- Type-safe interfaces for Cat, UndoState, and Position
- Modular methods for each feature

### SASS Organization
- Variables for colors, spacing, and transitions
- Mixins for reusable styles
- Mobile-first responsive design
- Keyframe animations for smooth effects

## 🤝 Contributing

Feel free to fork, modify, and improve this project! Some ideas:
- Add more cat images
- Implement localStorage to save preferences
- Add sound effects
- Create themed versions (dogs, food, etc.)

## 🤖 GenAI Declaration

This project was developed with assistance from Claude Sonnet 4.5 for reference and idea generation.

## 📄 License

ISC License - feel free to use this project however you'd like!

## 🐱 Enjoy!

Have fun swiping through cute cat pictures! Made with ❤️ and lots of cat appreciation.
