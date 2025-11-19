// Tarot Card Data
const tarotCards = [
    {
        id: 1,
        name: "The Star",
        symbol: "⭐",
        text: "Hope illuminates the darkest paths",
        keywords: ["hope", "renewal", "inspiration"]
    },
    {
        id: 2,
        name: "The Moon",
        symbol: "🌙",
        text: "Mysteries unfold in the quiet night",
        keywords: ["intuition", "mystery", "dreams"]
    },
    {
        id: 3,
        name: "The Sun",
        symbol: "☀️",
        text: "Joy radiates through every moment",
        keywords: ["joy", "success", "vitality"]
    },
    {
        id: 4,
        name: "The Tower",
        symbol: "🗼",
        text: "From chaos emerges transformation",
        keywords: ["change", "revelation", "awakening"]
    },
    {
        id: 5,
        name: "The Wheel",
        symbol: "☸️",
        text: "Destiny turns with endless grace",
        keywords: ["fate", "cycles", "fortune"]
    },
    {
        id: 6,
        name: "The Heart",
        symbol: "💜",
        text: "Love weaves through all existence",
        keywords: ["love", "compassion", "connection"]
    }
];

// State
let slots = {
    past: null,
    present: null,
    future: null
};

let swapMode = false;
let firstSwapCard = null;
let usedCardIds = new Set();
let selectedDeck = null;

// Audio Context for sound effects
let audioContext;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    setupDeckSelection();
});

// Setup Deck Selection
function setupDeckSelection() {
    const deckOptions = document.querySelectorAll('.deck-option');

    deckOptions.forEach(option => {
        option.addEventListener('click', () => {
            const deckType = option.dataset.deck;
            selectDeck(deckType);
        });
    });
}

// Select a deck and start the game
function selectDeck(deckType) {
    selectedDeck = deckType;

    // Apply theme to body
    document.body.className = `theme-${deckType}`;

    // Play selection sound
    playSelectionSound();

    // Fade out selection screen
    const selectionScreen = document.getElementById('deckSelectionScreen');
    selectionScreen.classList.add('fade-out');

    // Show game container after fade out
    setTimeout(() => {
        selectionScreen.style.display = 'none';
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.style.display = 'block';

        // Initialize game
        createDeck();
        setupSwapControls();

        // Animate game container in
        setTimeout(() => {
            gameContainer.style.opacity = '0';
            gameContainer.style.animation = 'fadeIn 1s ease-out forwards';
        }, 50);
    }, 800);
}

// Initialize Audio Context
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Create the deck of cards
function createDeck() {
    const deck = document.getElementById('deck');

    tarotCards.forEach(card => {
        const cardElement = createCardElement(card);
        deck.appendChild(cardElement);
    });
}

// Create a card element
function createCardElement(cardData, isPlaced = false) {
    const card = document.createElement('div');
    card.className = 'card';
    if (isPlaced) {
        card.classList.add('placed');
    }
    card.draggable = true;
    card.dataset.cardId = cardData.id;

    // Card Back
    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';

    // Card Front
    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';

    const symbol = document.createElement('div');
    symbol.className = 'card-symbol';
    symbol.textContent = cardData.symbol;

    const name = document.createElement('div');
    name.className = 'card-name';
    name.textContent = cardData.name;

    const text = document.createElement('div');
    text.className = 'card-text';
    text.textContent = cardData.text;

    cardFront.appendChild(symbol);
    cardFront.appendChild(name);
    cardFront.appendChild(text);

    card.appendChild(cardBack);
    card.appendChild(cardFront);

    // Event Listeners
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    if (isPlaced) {
        card.addEventListener('click', handleCardClick);
    }

    return card;
}

// Drag and Drop Handlers
function handleDragStart(e) {
    if (swapMode) {
        e.preventDefault();
        return;
    }

    const cardId = e.target.dataset.cardId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', cardId);
    e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

// Setup slot areas for drag and drop
document.addEventListener('DOMContentLoaded', () => {
    const slotAreas = document.querySelectorAll('.slot-area');

    slotAreas.forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('dragleave', handleDragLeave);
        area.addEventListener('drop', handleDrop);
    });
});

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    e.currentTarget.classList.remove('drag-over');

    const cardId = parseInt(e.dataTransfer.getData('text/html'));
    const slotName = e.currentTarget.dataset.slotName;

    // Check if slot is already filled
    if (slots[slotName] !== null) {
        return false;
    }

    // Check if card is already used
    if (usedCardIds.has(cardId)) {
        return false;
    }

    // Place the card
    placeCard(cardId, slotName, e.currentTarget);

    return false;
}

// Place a card in a slot
function placeCard(cardId, slotName, slotArea) {
    const cardData = tarotCards.find(c => c.id === cardId);

    // Remove card from deck
    const deckCard = document.querySelector(`.deck .card[data-card-id="${cardId}"]`);
    if (deckCard) {
        deckCard.remove();
    }

    // Create placed card
    const placedCard = createCardElement(cardData, true);
    slotArea.appendChild(placedCard);

    // Update state
    slots[slotName] = cardData;
    usedCardIds.add(cardId);

    // Mark slot as filled
    slotArea.classList.add('filled');

    // Animate flip
    setTimeout(() => {
        placedCard.classList.add('flipping');
        playBellSound();
        createLightEffect(slotArea);

        setTimeout(() => {
            placedCard.classList.remove('flipping');
        }, 800);
    }, 100);

    // Check if all slots are filled
    setTimeout(() => {
        checkAllSlotsFilled();
    }, 1000);
}

// Check if all slots are filled
function checkAllSlotsFilled() {
    if (slots.past && slots.present && slots.future) {
        displayResult();
        showSwapControls();
    }
}

// Display the result
function displayResult() {
    const resultPanel = document.getElementById('resultPanel');
    const selectedCards = document.getElementById('selectedCards');
    const fateSentence = document.getElementById('fateSentence');

    // Clear previous content
    selectedCards.innerHTML = '';
    fateSentence.innerHTML = '';

    // Display selected cards
    ['past', 'present', 'future'].forEach(slot => {
        const card = slots[slot];
        const cardItem = document.createElement('div');
        cardItem.className = 'selected-card-item';

        const symbol = document.createElement('div');
        symbol.className = 'selected-card-symbol';
        symbol.textContent = card.symbol;

        const name = document.createElement('div');
        name.className = 'selected-card-name';
        name.textContent = `${slot.charAt(0).toUpperCase() + slot.slice(1)}: ${card.name}`;

        cardItem.appendChild(symbol);
        cardItem.appendChild(name);
        selectedCards.appendChild(cardItem);
    });

    // Generate fate sentence
    const sentence = generateFateSentence();
    fateSentence.textContent = sentence;

    // Apply theme
    const theme = determineTheme();
    resultPanel.className = `result-panel visible ${theme}`;

    // Show result panel
    setTimeout(() => {
        resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
}

// Generate fate sentence
function generateFateSentence() {
    const past = slots.past.text;
    const present = slots.present.text;
    const future = slots.future.text;

    // Create connecting phrases
    const connectors = [
        { start: "Where once", middle: ", now", end: ", and soon" },
        { start: "From", middle: ", through", end: ", toward" },
        { start: "In your past", middle: ", in your present", end: ", in your future" }
    ];

    const connector = connectors[Math.floor(Math.random() * connectors.length)];

    // Modify card texts to fit into sentence
    const pastPhrase = past.toLowerCase().replace(/\.$/, '');
    const presentPhrase = present.toLowerCase().replace(/\.$/, '');
    const futurePhrase = future.toLowerCase().replace(/\.$/, '');

    return `${connector.start} ${pastPhrase}${connector.middle} ${presentPhrase}${connector.end} ${futurePhrase}.`;
}

// Determine theme based on card keywords
function determineTheme() {
    const allKeywords = [
        ...slots.past.keywords,
        ...slots.present.keywords,
        ...slots.future.keywords
    ];

    const warmKeywords = ['joy', 'love', 'success', 'hope', 'vitality', 'connection'];
    const coolKeywords = ['intuition', 'mystery', 'dreams', 'fate'];
    const mysteriousKeywords = ['change', 'revelation', 'awakening', 'transformation'];

    let warmCount = 0, coolCount = 0, mysteriousCount = 0;

    allKeywords.forEach(keyword => {
        if (warmKeywords.includes(keyword)) warmCount++;
        if (coolKeywords.includes(keyword)) coolCount++;
        if (mysteriousKeywords.includes(keyword)) mysteriousCount++;
    });

    if (warmCount > coolCount && warmCount > mysteriousCount) return 'warm';
    if (coolCount > warmCount && coolCount > mysteriousCount) return 'cool';
    return 'mysterious';
}

// Show swap controls
function showSwapControls() {
    const swapControls = document.getElementById('swapControls');
    swapControls.classList.add('visible');
}

// Setup swap controls
function setupSwapControls() {
    const swapBtn = document.getElementById('swapBtn');
    swapBtn.addEventListener('click', toggleSwapMode);
}

// Toggle swap mode
function toggleSwapMode() {
    swapMode = !swapMode;
    const swapBtn = document.getElementById('swapBtn');
    const swapInstruction = document.getElementById('swapInstruction');

    if (swapMode) {
        swapBtn.classList.add('active');
        swapBtn.textContent = 'Cancel Swap';
        swapInstruction.textContent = 'Click on two cards to swap them';
        firstSwapCard = null;
    } else {
        swapBtn.classList.remove('active');
        swapBtn.textContent = 'Swap Two Cards';
        swapInstruction.textContent = '';
        firstSwapCard = null;

        // Remove selection from any selected card
        document.querySelectorAll('.card.selected').forEach(card => {
            card.classList.remove('selected');
        });
    }
}

// Handle card click for swapping
function handleCardClick(e) {
    if (!swapMode) return;

    const card = e.currentTarget;

    if (!firstSwapCard) {
        // Select first card
        firstSwapCard = card;
        card.style.transform = 'rotateY(180deg) scale(1.1)';
        card.classList.add('selected');
        document.getElementById('swapInstruction').textContent = 'Now click on another card to swap';
    } else if (firstSwapCard === card) {
        // Deselect if clicking the same card
        firstSwapCard.style.transform = 'rotateY(180deg)';
        firstSwapCard.classList.remove('selected');
        firstSwapCard = null;
        document.getElementById('swapInstruction').textContent = 'Click on two cards to swap them';
    } else {
        // Swap the two cards
        swapCards(firstSwapCard, card);
        firstSwapCard.style.transform = 'rotateY(180deg)';
        firstSwapCard.classList.remove('selected');
        firstSwapCard = null;
        toggleSwapMode();
    }
}

// Swap two cards
function swapCards(card1, card2) {
    const slot1 = card1.parentElement.dataset.slotName;
    const slot2 = card2.parentElement.dataset.slotName;

    // Swap animation
    card1.classList.add('swapping');
    card2.classList.add('swapping');

    // Play vibration effect (visual)
    createSwapEffect(card1.parentElement);
    createSwapEffect(card2.parentElement);

    // Play sound
    playSwapSound();

    setTimeout(() => {
        // Swap in state
        const temp = slots[slot1];
        slots[slot1] = slots[slot2];
        slots[slot2] = temp;

        // Swap DOM elements
        const parent1 = card1.parentElement;
        const parent2 = card2.parentElement;

        parent1.removeChild(card1);
        parent2.removeChild(card2);

        parent1.appendChild(card2);
        parent2.appendChild(card1);

        card1.classList.remove('swapping');
        card2.classList.remove('swapping');

        // Update result
        displayResult();
    }, 500);
}

// Sound Effects
function playBellSound() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.6);
}

function playSwapSound() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playSelectionSound() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Visual Effects
function createLightEffect(element) {
    const light = document.createElement('div');
    light.style.position = 'absolute';
    light.style.top = '50%';
    light.style.left = '50%';
    light.style.transform = 'translate(-50%, -50%)';
    light.style.width = '20px';
    light.style.height = '20px';
    light.style.borderRadius = '50%';
    light.style.background = 'radial-gradient(circle, rgba(212,175,55,1) 0%, rgba(212,175,55,0) 70%)';
    light.style.animation = 'expandLight 0.8s ease-out forwards';
    light.style.pointerEvents = 'none';
    light.style.zIndex = '10';

    element.style.position = 'relative';
    element.appendChild(light);

    setTimeout(() => {
        light.remove();
    }, 800);
}

function createSwapEffect(element) {
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = 'rgba(212, 175, 55, 0.5)';
    flash.style.borderRadius = '15px';
    flash.style.animation = 'flashEffect 0.5s ease-out forwards';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '10';

    element.style.position = 'relative';
    element.appendChild(flash);

    setTimeout(() => {
        flash.remove();
    }, 500);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes expandLight {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }

    @keyframes flashEffect {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
