# 🚀 Quick Reference - Paws & Preferences

## Commands
```bash
npm install          # Install dependencies
npm run build        # Compile SASS & TypeScript
npm run watch        # Auto-compile on changes
```

## File Structure
```
├── index.html       # Main app
├── styles.scss      # SASS source → styles.css
├── app.ts          # TypeScript source → app.js
├── tsconfig.json   # TS config
├── package.json    # npm config
└── images/         # cat1.png - cat10.png
```

## Key Classes & Methods

### PawsAndPreferences (Main Class)
```typescript
// Core state
cats: Cat[]              // All cat data
currentIndex: number     // Current card position
likedCats: Cat[]        // User's liked cats
undoState: UndoState    // Last action for undo

// Key methods
renderCards()           // Render card stack
handleDragStart()       // Start swipe
handleDragMove()        // Track swipe
handleDragEnd()         // Complete swipe
swipeCard(liked)        // Programmatic swipe
handleUndo()            // Undo last action
showResults()           // Display results screen
```

## Interfaces
```typescript
interface Cat {
    id: number
    imagePath: string
    liked: boolean | null
}

interface UndoState {
    cat: Cat
    timestamp: number
    timeout: number
}

interface Position {
    x: number
    y: number
}
```

## SASS Variables
```scss
// Colors
$color-primary: #007AFF    // iOS blue
$color-like: #34C759       // Green
$color-dislike: #FF3B30    // Red
$color-bg: #F2F2F7         // Gray

// Spacing
$spacing-xs: 8px
$spacing-sm: 12px
$spacing-md: 16px
$spacing-lg: 24px
$spacing-xl: 32px

// Transitions
$transition-fast: 0.2s ease
$transition-medium: 0.3s ease
$transition-slow: 0.5s ease
```

## Key Animations
```scss
@keyframes swipeRight    // Card swipes right
@keyframes swipeLeft     // Card swipes left
@keyframes cardEnter     // New card appears
@keyframes popIn         // Results cards appear
@keyframes undoTimer     // Undo countdown
```

## Event Listeners
- `mousedown/touchstart` → Start drag
- `mousemove/touchmove` → Track drag
- `mouseup/touchend` → End drag
- `click` (buttons) → Programmatic swipe
- `keydown` → Keyboard shortcuts

## Constants
```typescript
SWIPE_THRESHOLD = 100           // px to trigger swipe
ROTATION_MULTIPLIER = 0.1       // Rotation per px
UNDO_TIMEOUT = 5000             // 5 seconds
```

## Keyboard Shortcuts
- `→` Right Arrow = Like
- `←` Left Arrow = Dislike
- `Ctrl/Cmd + Z` = Undo

## DOM Elements (IDs)
- `#cardStack` - Card container
- `#progressFill` - Progress bar
- `#progressText` - Progress counter
- `#swipeScreen` - Main swipe view
- `#resultsScreen` - Results view
- `#resultsGrid` - Liked cats grid
- `#undoContainer` - Undo button wrapper
- `#likeBtn` / `#dislikeBtn` - Action buttons
- `#restartBtn` - Restart button

## CSS Classes
- `.cat-card` - Individual cat card
- `.swipe-overlay` - Like/dislike overlay
- `.like-overlay` / `.dislike-overlay` - Specific overlays
- `.result-card` - Results grid item
- `.active` - Active overlay state
- `.visible` - Show undo button
- `.hidden` - Hide element
- `.swipe-right` / `.swipe-left` - Swipe animations

## Customization Points

### Add More Images
1. Add images to `/images/` folder
2. Update loop in constructor: `for (let i = 1; i <= 15; i++)`
3. Update HTML progress: `${this.cats.length}`

### Change Colors
Edit SASS variables in `styles.scss`:
```scss
$color-primary: #YOUR_COLOR
$color-like: #YOUR_COLOR
$color-dislike: #YOUR_COLOR
```

### Modify Messages
Update in `showResults()` method:
```typescript
if (count === 0) {
    this.resultsTitle.textContent = "Your message"
}
```

### Change Swipe Threshold
```typescript
private readonly SWIPE_THRESHOLD = 150; // More sensitive
```

### Adjust Undo Time
```typescript
private readonly UNDO_TIMEOUT = 10000; // 10 seconds
```

## Responsive Breakpoints
- `480px` - Mobile optimizations
- `360px` - Extra small devices

## Browser DevTools Tips
- Console: Check for errors
- Network: Verify image loading
- Elements: Inspect card transformations
- Performance: Monitor animation smoothness

## Common Modifications

### Add Sound Effects
```typescript
private likeSound = new Audio('sounds/like.mp3')
// In completeSwipe()
if (liked) this.likeSound.play()
```

### Save to localStorage
```typescript
// Save after each swipe
localStorage.setItem('likedCats', JSON.stringify(this.likedCats))

// Load on init
const saved = localStorage.getItem('likedCats')
if (saved) this.likedCats = JSON.parse(saved)
```

### Add Animation Speed Control
```typescript
private animationSpeed = 1 // 1 = normal, 2 = 2x faster
// Then multiply all animation durations
```

## Troubleshooting Quick Fixes

**Cards not swiping?**
```typescript
// Check if isDragging is being set
console.log('Drag start:', this.isDragging)
```

**Undo not working?**
```typescript
// Check undo state
console.log('Undo state:', this.undoState)
```

**Styles not loading?**
```bash
# Rebuild SASS
npm run build
```

**Images not loading?**
```typescript
// Check paths
console.log(this.cats.map(c => c.imagePath))
```

## Performance Tips
- Use CSS transforms for animations (GPU-accelerated)
- Limit active event listeners
- Use passive listeners for scroll events
- Lazy load images if many cats
- Debounce frequent events

## Testing Checklist
- [ ] Swipe right (mouse)
- [ ] Swipe left (mouse)
- [ ] Swipe right (touch)
- [ ] Swipe left (touch)
- [ ] Click like button
- [ ] Click dislike button
- [ ] Press right arrow
- [ ] Press left arrow
- [ ] Undo within 5 seconds
- [ ] Undo after 5 seconds (should fail)
- [ ] Complete all 10 cats
- [ ] View results screen
- [ ] Hover result cards
- [ ] Click restart
- [ ] Test on mobile
- [ ] Test on tablet
- [ ] Test on desktop

---

**Made with ❤️ and TypeScript**
