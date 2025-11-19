# Digital Tarot Cards

An elegant and mystical digital Tarot card reading experience with smooth animations, soothing sounds, and a ritual-like atmosphere.

## Features

### Deck Selection
- **Three Mystical Decks**: Choose from three beautifully themed Tarot decks before your reading
  - 🌸 **Rose Dreams** (Pink) - For matters of the heart and gentle guidance
  - 🌊 **Ocean Wisdom** (Blue) - For clarity, intuition, and deep insight
  - 🌿 **Forest Mysteries** (Green) - For growth, renewal, and natural wisdom
- **Dynamic Theming**: Each deck features its own unique color palette that transforms the entire experience
- **Smooth Transitions**: Elegant fade animations when selecting your deck

### Visual Experience
- **Elegant Design**: Mystical gradients with deck-specific color schemes
- **Smooth Animations**: Fluid card flipping, dragging, and placement effects
- **Glowing Effects**: Soft light animations when cards are placed and slots are filled
- **Responsive Layout**: Works beautifully on desktop and mobile devices

### Interactive Elements
- **Drag & Drop**: Intuitively drag cards from the deck to the Past, Present, and Future slots
- **Card Flipping**: Cards elegantly flip to reveal their symbols and poetic messages
- **Card Swapping**: Exchange any two placed cards to explore different fate combinations
- **Visual Feedback**: Glowing halos around filled slots, flash effects during swaps

### Audio Experience
- **Selection Chimes**: Harmonious tones when choosing your deck
- **Bell Sounds**: Soft, pleasant bell tones when cards are revealed
- **Swap Sounds**: Gentle audio feedback when exchanging cards
- **Web Audio API**: All sounds generated in real-time using the Web Audio API

### The Reading
- **Six Unique Cards**:
  - ⭐ The Star - "Hope illuminates the darkest paths"
  - 🌙 The Moon - "Mysteries unfold in the quiet night"
  - ☀️ The Sun - "Joy radiates through every moment"
  - 🗼 The Tower - "From chaos emerges transformation"
  - ☸️ The Wheel - "Destiny turns with endless grace"
  - 💜 The Heart - "Love weaves through all existence"

- **Three-Card Reading**: Select cards for Past, Present, and Future
- **Fate Sentence**: Your three cards combine into a unique poetic message
- **Dynamic Themes**: The result panel changes color based on your cards (warm, cool, or mysterious)

## How to Use

1. **Open the Application**: Open `index.html` in a modern web browser
2. **Choose Your Deck**: Select from three mystical decks (Pink, Blue, or Green)
3. **Drag Cards**: Click and drag any card from the bottom deck to one of the three slots (Past, Present, Future)
4. **Watch the Magic**: Each card will flip with a soft light effect and gentle bell sound
5. **Read Your Fate**: Once all three slots are filled, your fate sentence appears
6. **Swap Cards** (Optional): Click the "Swap Two Cards" button, then click two cards to exchange them

## Technical Details

### Files
- `index.html` - Main HTML structure
- `styles.css` - All styling and animations
- `script.js` - Interactive functionality and game logic

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Advanced animations and transitions
- **Vanilla JavaScript** - No dependencies required
- **Web Audio API** - Real-time sound generation
- **Drag and Drop API** - Native browser drag and drop

### Key Features Implementation
- **Deck Selection**: Interactive deck choice with theme application
- **Dynamic Theming**: CSS theme classes applied to body element for deck-specific colors
- **Card Flipping**: CSS 3D transforms with `rotateY(180deg)`
- **Drag & Drop**: HTML5 Drag and Drop API
- **Glow Effects**: CSS animations with `box-shadow` and `@keyframes`
- **Sound**: Web Audio API with oscillators for bell tones
- **Fate Generation**: Dynamic text composition based on card combinations
- **Theme Detection**: Keyword analysis to determine emotional tone
- **Smooth Transitions**: Fade in/out animations between screens

## Browser Compatibility

Works best in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Design Philosophy

The application emphasizes:
- **Elegance**: Refined typography, sophisticated color palette
- **Tranquility**: Gentle animations, soothing sounds
- **Ritual**: Ceremonial feeling through pacing and visual effects
- **Simplicity**: Clean interface, intuitive interactions

## Future Enhancements

Potential additions:
- More tarot cards (full 78-card deck)
- Save and share readings
- Different reading spreads (Celtic Cross, etc.)
- Customizable themes
- Card interpretation details
- Reading history

## License

Free to use and modify for personal projects.

---

**Enjoy your mystical journey through the cards!**
