// ========================================
// TYPES & INTERFACES
// ========================================

/**
 * Represents a cat in the app
 */
interface Cat {
    id: number;
    imagePath: string;
    liked: boolean | null; // null = not swiped, true = liked, false = disliked
}

/**
 * Stores the state of the last swipe for undo functionality
 */
interface UndoState {
    cat: Cat;
    timestamp: number;
    timeout: number;
}

/**
 * Touch/Mouse position for drag calculations
 */
interface Position {
    x: number;
    y: number;
}

// ========================================
// APP STATE
// ========================================

class PawsAndPreferences {
    // Cat data
    private cats: Cat[] = [];
    private currentIndex: number = 0;
    private likedCats: Cat[] = [];

    // Undo state
    private undoState: UndoState | null = null;

    // Swipe detection
    private isDragging: boolean = false;
    private isAnimating: boolean = false; // Prevent rapid clicks causing duplicates
    private startPosition: Position = { x: 0, y: 0 };
    private currentPosition: Position = { x: 0, y: 0 };
    private currentCard: HTMLElement | null = null;

    // DOM elements
    private cardStack: HTMLElement;
    private progressFill: HTMLElement;
    private progressText: HTMLElement;
    private swipeScreen: HTMLElement;
    private resultsScreen: HTMLElement;
    private resultsGrid: HTMLElement;
    private resultsTitle: HTMLElement;
    private resultsMessage: HTMLElement;
    private resultsCount: HTMLElement;
    private undoContainer: HTMLElement;
    private undoBtn: HTMLElement;
    private likeBtn: HTMLElement;
    private dislikeBtn: HTMLElement;
    private restartBtn: HTMLElement;

    // Constants
    private readonly SWIPE_THRESHOLD = 100; // pixels
    private readonly ROTATION_MULTIPLIER = 0.1; // degrees per pixel
    private readonly UNDO_TIMEOUT = 5000; // 5 seconds

    constructor() {
        // Initialize cats (10 cat images)
        for (let i = 1; i <= 10; i++) {
            this.cats.push({
                id: i,
                imagePath: `images/cat${i}.png`,
                liked: null
            });
        }

        // Get DOM elements
        this.cardStack = document.getElementById('cardStack')!;
        this.progressFill = document.getElementById('progressFill')!;
        this.progressText = document.getElementById('progressText')!;
        this.swipeScreen = document.getElementById('swipeScreen')!;
        this.resultsScreen = document.getElementById('resultsScreen')!;
        this.resultsGrid = document.getElementById('resultsGrid')!;
        this.resultsTitle = document.getElementById('resultsTitle')!;
        this.resultsMessage = document.getElementById('resultsMessage')!;
        this.resultsCount = document.getElementById('resultsCount')!;
        this.undoContainer = document.getElementById('undoContainer')!;
        this.undoBtn = document.getElementById('undoBtn')!;
        this.likeBtn = document.getElementById('likeBtn')!;
        this.dislikeBtn = document.getElementById('dislikeBtn')!;
        this.restartBtn = document.getElementById('restartBtn')!;

        // Initialize
        this.setupEventListeners();
        this.renderCards();
        this.updateProgress();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Set up all event listeners
     */
    private setupEventListeners(): void {
        // Touch/Mouse events for swipe
        this.cardStack.addEventListener('mousedown', this.handleDragStart.bind(this));
        this.cardStack.addEventListener('touchstart', this.handleDragStart.bind(this), { passive: false });
        
        document.addEventListener('mousemove', this.handleDragMove.bind(this));
        document.addEventListener('touchmove', this.handleDragMove.bind(this), { passive: false });
        
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));
        document.addEventListener('touchend', this.handleDragEnd.bind(this));

        // Action buttons
        this.likeBtn.addEventListener('click', () => this.swipeCard(true));
        this.dislikeBtn.addEventListener('click', () => this.swipeCard(false));

        // Undo button
        this.undoBtn.addEventListener('click', this.handleUndo.bind(this));

        // Restart button
        this.restartBtn.addEventListener('click', this.handleRestart.bind(this));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.currentIndex >= this.cats.length) return;
            
            if (e.key === 'ArrowRight') this.swipeCard(true);
            if (e.key === 'ArrowLeft') this.swipeCard(false);
            if (e.key === 'z' && (e.ctrlKey || e.metaKey)) this.handleUndo();
        });
    }

    // ========================================
    // CARD RENDERING
    // ========================================

    /**
     * Render the initial card stack (show top 3 cards for depth effect)
     */
    private renderCards(): void {
        this.cardStack.innerHTML = '';

        // Render next 3 cards for stack effect
        for (let i = 0; i < Math.min(3, this.cats.length - this.currentIndex); i++) {
            const catIndex = this.currentIndex + i;
            const card = this.createCard(this.cats[catIndex], i);
            this.cardStack.appendChild(card);
        }
    }

    /**
     * Create a card element for a cat
     */
    private createCard(cat: Cat, stackIndex: number): HTMLElement {
        const card = document.createElement('div');
        card.className = 'cat-card';
        card.dataset.catId = cat.id.toString();
        
        // Only the top card should be interactive
        if (stackIndex === 0) {
            card.style.zIndex = '10';
        }

        card.innerHTML = `
            <img src="${cat.imagePath}" alt="Cat ${cat.id}" class="cat-image">
            <div class="swipe-overlay like-overlay">
                <div class="overlay-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>
                <div class="overlay-text">Like</div>
            </div>
            <div class="swipe-overlay dislike-overlay">
                <div class="overlay-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="80" height="80">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
                <div class="overlay-text">Nope</div>
            </div>
        `;

        return card;
    }

    // ========================================
    // DRAG & SWIPE HANDLERS
    // ========================================

    /**
     * Handle drag start (mouse down or touch start)
     */
    private handleDragStart(e: MouseEvent | TouchEvent): void {
        if (this.currentIndex >= this.cats.length || this.isAnimating) return;

        const target = e.target as HTMLElement;
        const card = target.closest('.cat-card') as HTMLElement;
        
        // Only allow dragging the top card
        if (!card || card !== this.cardStack.firstElementChild) return;

        this.isDragging = true;
        this.currentCard = card;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        this.startPosition = { x: clientX, y: clientY };
        this.currentPosition = { x: clientX, y: clientY };

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    /**
     * Handle drag move
     */
    private handleDragMove(e: MouseEvent | TouchEvent): void {
        if (!this.isDragging || !this.currentCard) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        this.currentPosition = { x: clientX, y: clientY };

        const deltaX = this.currentPosition.x - this.startPosition.x;
        const deltaY = this.currentPosition.y - this.startPosition.y;
        const rotation = deltaX * this.ROTATION_MULTIPLIER;

        // Transform the card
        this.currentCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;

        // Show appropriate overlay
        const likeOverlay = this.currentCard.querySelector('.like-overlay') as HTMLElement;
        const dislikeOverlay = this.currentCard.querySelector('.dislike-overlay') as HTMLElement;

        if (Math.abs(deltaX) > 30) {
            if (deltaX > 0) {
                likeOverlay.classList.add('active');
                dislikeOverlay.classList.remove('active');
            } else {
                dislikeOverlay.classList.add('active');
                likeOverlay.classList.remove('active');
            }
        } else {
            likeOverlay.classList.remove('active');
            dislikeOverlay.classList.remove('active');
        }

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    /**
     * Handle drag end
     */
    private handleDragEnd(e: MouseEvent | TouchEvent): void {
        if (!this.isDragging || !this.currentCard) return;

        const deltaX = this.currentPosition.x - this.startPosition.x;

        // Check if swipe threshold was met
        if (Math.abs(deltaX) > this.SWIPE_THRESHOLD) {
            const liked = deltaX > 0;
            this.completeSwipe(liked);
        } else {
            // Reset card position
            this.currentCard.style.transform = '';
            const likeOverlay = this.currentCard.querySelector('.like-overlay') as HTMLElement;
            const dislikeOverlay = this.currentCard.querySelector('.dislike-overlay') as HTMLElement;
            likeOverlay.classList.remove('active');
            dislikeOverlay.classList.remove('active');
        }

        this.isDragging = false;
        this.currentCard = null;
    }

    // ========================================
    // SWIPE LOGIC
    // ========================================

    /**
     * Swipe card programmatically (from buttons or keyboard)
     */
    private swipeCard(liked: boolean): void {
        if (this.currentIndex >= this.cats.length || this.isAnimating) return;

        this.isAnimating = true; // Lock to prevent duplicates
        const topCard = this.cardStack.firstElementChild as HTMLElement;
        if (!topCard) {
            this.isAnimating = false;
            return;
        }

        // Add overlay
        const overlay = liked 
            ? topCard.querySelector('.like-overlay') 
            : topCard.querySelector('.dislike-overlay');
        overlay?.classList.add('active');

        // Animate off screen
        setTimeout(() => {
            this.completeSwipe(liked);
        }, 200);
    }

    /**
     * Complete the swipe action
     */
    private completeSwipe(liked: boolean): void {
        if (this.currentIndex >= this.cats.length) {
            this.isAnimating = false;
            return;
        }

        const cat = this.cats[this.currentIndex];
        cat.liked = liked;

        if (liked) {
            this.likedCats.push(cat);
        }

        // Store for undo
        this.storeUndoState(cat);

        // Animate card off screen
        const topCard = this.cardStack.firstElementChild as HTMLElement;
        if (topCard) {
            topCard.classList.add(liked ? 'swipe-right' : 'swipe-left');
            
            setTimeout(() => {
                topCard.remove();
                this.currentIndex++;
                this.updateProgress();

                // Check if done
                if (this.currentIndex >= this.cats.length) {
                    this.isAnimating = false;
                    this.showResults();
                } else {
                    // Add next card to the stack
                    if (this.currentIndex + 2 < this.cats.length) {
                        const newCard = this.createCard(this.cats[this.currentIndex + 2], 2);
                        newCard.classList.add('card-enter');
                        this.cardStack.appendChild(newCard);
                    }
                    this.isAnimating = false; // Unlock for next swipe
                }
            }, 400);
        }
    }

    // ========================================
    // UNDO FUNCTIONALITY
    // ========================================

    /**
     * Store the current state for undo
     */
    private storeUndoState(cat: Cat): void {
        // Clear previous undo timeout
        if (this.undoState) {
            clearTimeout(this.undoState.timeout);
        }

        // Show undo button
        this.undoContainer.classList.add('visible');

        // Restart timer animation
        const timer = this.undoContainer.querySelector('.undo-timer') as HTMLElement;
        if (timer) {
            timer.style.animation = 'none';
            setTimeout(() => {
                timer.style.animation = 'undoTimer 5s linear forwards';
            }, 10);
        }

        // Set timeout to hide undo button
        const timeout = window.setTimeout(() => {
            this.undoContainer.classList.remove('visible');
            this.undoState = null;
        }, this.UNDO_TIMEOUT);

        this.undoState = {
            cat: { ...cat },
            timestamp: Date.now(),
            timeout
        };
    }

    /**
     * Handle undo action
     */
    private handleUndo(): void {
        if (!this.undoState || this.currentIndex === 0) return;

        this.isAnimating = false; // Reset animation lock

        // Clear timeout
        clearTimeout(this.undoState.timeout);
        this.undoContainer.classList.remove('visible');

        // Revert state
        const cat = this.undoState.cat;
        this.currentIndex--;
        this.cats[this.currentIndex].liked = null;

        // Remove from liked cats if it was liked
        if (cat.liked) {
            const index = this.likedCats.findIndex(c => c.id === cat.id);
            if (index !== -1) {
                this.likedCats.splice(index, 1);
            }
        }

        // Re-render cards
        this.renderCards();
        this.updateProgress();

        this.undoState = null;
    }

    // ========================================
    // PROGRESS & UI UPDATES
    // ========================================

    /**
     * Update progress bar and text
     */
    private updateProgress(): void {
        const progress = (this.currentIndex / this.cats.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `${this.currentIndex} / ${this.cats.length}`;
    }

    // ========================================
    // RESULTS SCREEN
    // ========================================

    /**
     * Show the results screen with liked cats
     */
    private showResults(): void {
        // Hide swipe screen
        this.swipeScreen.classList.add('hidden');

        // Show results screen
        this.resultsScreen.classList.remove('hidden');

        // Update results text
        const count = this.likedCats.length;
        this.resultsCount.textContent = `You liked ${count} ${count === 1 ? 'cat' : 'cats'}`;

        // Set title and message based on liked count
        if (count === 0) {
            this.resultsTitle.textContent = "Oh no!";
            this.resultsMessage.textContent = "Imagine not liking cats in 2026... couldn't be me";
        } else if (count <= 3) {
            this.resultsTitle.textContent = "Pretty Picky!";
            this.resultsMessage.textContent = "You know what you like!";
        } else if (count <= 7) {
            this.resultsTitle.textContent = "Your Purrfect Matches!";
            this.resultsMessage.textContent = "You're such a cat lover!";
        } else {
            this.resultsTitle.textContent = "Ultimate Cat Lover!";
            this.resultsMessage.textContent = "You literally love ALL the cats!";
        }

        // Render liked cats
        this.renderResults();
    }

    /**
     * Render the grid of liked cats
     */
    private renderResults(): void {
        this.resultsGrid.innerHTML = '';
        
        // Set data-count attribute for CSS styling
        this.resultsGrid.setAttribute('data-count', this.likedCats.length.toString());

        if (this.likedCats.length === 0) {
            this.resultsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="80" height="80">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                    </div>
                    <p class="empty-text">No cats liked</p>
                    <p class="empty-subtext">Give it another try!</p>
                </div>
            `;
            return;
        }

        this.likedCats.forEach((cat) => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <img src="${cat.imagePath}" alt="Cat ${cat.id}">
                <div class="result-overlay">
                    <div class="heart-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="50" height="50">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                </div>
            `;
            this.resultsGrid.appendChild(card);
        });
    }

    // ========================================
    // RESTART
    // ========================================

    /**
     * Restart the app
     */
    private handleRestart(): void {
        // Reset state
        this.currentIndex = 0;
        this.likedCats = [];
        this.undoState = null;
        this.isAnimating = false; // Reset animation lock
        
        // Reset all cats
        this.cats.forEach(cat => {
            cat.liked = null;
        });

        // Hide results, show swipe screen
        this.resultsScreen.classList.add('hidden');
        this.swipeScreen.classList.remove('hidden');

        // Re-render
        this.renderCards();
        this.updateProgress();
    }
}

// ========================================
// INITIALIZE APP
// ========================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    new PawsAndPreferences();
});
