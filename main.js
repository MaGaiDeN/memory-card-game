// Variables globales
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let gameStarted = false;
let moves = 0;
let timeLeft = 60;
let timerId = null;

// Elementos del DOM
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const cardElements = document.querySelectorAll('.container__info__card__start');
const moveCountElement = document.getElementById('moveCount');
const timeLeftElement = document.getElementById('timeLeft');

// Agregar variables para el popup
const winPopup = document.getElementById('winPopup');
const closePopupButton = document.getElementById('closePopup');
const finalMovesSpan = document.getElementById('finalMoves');
const finalTimeSpan = document.getElementById('finalTime');

// Array de cartas
const cardImages = [
    '1.png', '1r.png',
    '2.png', '2r.png',
    '3.png', '3r.png',
    '4.png', '4r.png',
    '5.png', '5r.png',
    '6.png', '6r.png',
    '7.png', '7r.png',
    '8.png', '8r.png'
];

function shuffleCards() {
    return [...cardImages].sort(() => Math.random() - 0.5);
}

function startTimer() {
    clearInterval(timerId);
    timeLeft = 60;
    timeLeftElement.textContent = timeLeft;
    
    timerId = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    clearInterval(timerId);
    alert('¡Se acabó el tiempo! Has perdido.');
    resetGame();
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        matchedPairs = 0;
        flippedCards = [];
        canFlip = true;
        moves = 0;
        moveCountElement.textContent = '0';
        
        const shuffledCards = shuffleCards();
        cardElements.forEach((card, index) => {
            card.setAttribute('data-image', shuffledCards[index]);
            card.style.backgroundImage = '';
            card.classList.remove('flipped', 'matched');
        });
        
        startTimer();
    }
}

function flipCard(card) {
    if (!gameStarted || !canFlip || card.classList.contains('matched') || card.classList.contains('flipped')) {
        return;
    }

    const cardImage = card.getAttribute('data-image');
    card.style.backgroundImage = `url('./images/${cardImage}')`;
    card.classList.add('flipped');

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    moves++;
    moveCountElement.textContent = moves;
    
    const [card1, card2] = flippedCards;
    const image1 = card1.getAttribute('data-image').split('.')[0].replace('r', '');
    const image2 = card2.getAttribute('data-image').split('.')[0].replace('r', '');
    
    if (image1 === image2) {
        matchedPairs++;
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        if (matchedPairs === 8) {
            clearInterval(timerId);
            showWinPopup();
        }
    } else {
        setTimeout(() => {
            card1.style.backgroundImage = '';
            card2.style.backgroundImage = '';
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 500);
    }

    flippedCards = [];
    canFlip = true;
}

function resetGame() {
    gameStarted = false;
    matchedPairs = 0;
    flippedCards = [];
    moves = 0;
    moveCountElement.textContent = '0';
    timeLeft = 60;
    timeLeftElement.textContent = timeLeft;
    clearInterval(timerId);
    
    cardElements.forEach(card => {
        card.style.backgroundImage = '';
        card.classList.remove('flipped', 'matched');
    });
}

// Función para mostrar el popup
function showWinPopup() {
    finalMovesSpan.textContent = moves;
    finalTimeSpan.textContent = timeLeft;
    winPopup.style.display = 'flex';
}

// Event listener para cerrar el popup
closePopupButton.addEventListener('click', () => {
    winPopup.style.display = 'none';
    resetGame();
});

// Event Listeners
startButton.addEventListener('click', startGame);

resetButton.addEventListener('click', resetGame);

cardElements.forEach(card => {
    card.addEventListener('click', () => flipCard(card));
});

// Agregar estilos CSS necesarios
const style = document.createElement('style');
style.textContent = `
    .container__info__card__start {
        background-size: cover;
        background-position: center;
    }
    .matched {
        opacity: 0.7;
    }
`;
document.head.appendChild(style);
