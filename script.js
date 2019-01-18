const cardsArray = [{
        'name': 'Levis',
        'img': 'img/levis.png',
    },
    {
        'name': 'Adidas',
        'img': 'img/adidas.png',
    },
    {
        'name': 'Fila',
        'img': 'img/fila.png',
    },
    {
        'name': 'Guess',
        'img': 'img/guess.png',
    },
    {
        'name': 'Reebok',
        'img': 'img/reebok.png',
    },
    {
        'name': 'S.Oliver',
        'img': 'img/s.oliver.png',
    },
    {
        'name': 'Nike',
        'img': 'img/nike.png',
    },
    {
        'name': 'Lacoste',
        'img': 'img/lacoste.png',
    },
];
const game = document.querySelector('.game');
const grid = document.querySelector('section');
const scoreShow = document.querySelector('.score');
const resetBtn = document.querySelector('.button__reset');
const easyBtn = document.querySelector('.easy');
const mediumBtn = document.querySelector('.medium');
const hardBtn = document.querySelector('.hard');
const levelButtons = document.querySelectorAll('.button__level');
let winner = document.querySelector('.winner')
const gridContainer = document.querySelector('.grid')
let previousChoice = null;
let firstGuess = '';
let secondGuess = '';
let count = 0;
let moves = 0;
let cards = 8;
let gameGrid = [];
let pairs = 0;

function init() {
    setupLevelButtons();
    createCards();
    reset();
}

init();

// Watching for game 
grid.addEventListener('click', function (e) {
    let clicked = e.target;
    let delay = 600;
    if (clicked.nodeName === 'SECTION' || clicked === previousChoice || clicked.parentNode.classList.contains('selected') || clicked.parentNode.classList.contains('match')) {
        return;
    }
    // Counting cards clicked
    if (count < 2) {
        count++;
        if (count === 1) {
            firstGuess = clicked.parentNode.dataset.name;
            clicked.parentNode.classList.add('selected');
        } else {
            secondGuess = clicked.parentNode.dataset.name;
            clicked.parentNode.classList.add('selected');
        }

        // Reveling matched cards and reseting guesses
        if (firstGuess !== '' && secondGuess !== '') {
            firstGuess === secondGuess ? setTimeout(match, delay) && setTimeout(resetGuesses, delay) : setTimeout(resetGuesses, delay);
        }
        previousChoice = clicked;
        moves++;
        scoreShow.innerHTML = `Moves: ${moves}`;

    }
});

// Choosing Level Logic
function setupLevelButtons() {
    for (var i = 0; i < levelButtons.length; i++) {
        levelButtons[i].addEventListener('click', function () {
            for (var i = 0; i < levelButtons.length; i++) {
                levelButtons[i].classList.remove('button__selected');
                this.classList.add('button__selected');
                if (this.textContent === 'Easy') {
                    cards = 3;
                    gridContainer.style.maxWidth = '400px';
                } else if (this.textContent === 'Medium') {
                    cards = 4;
                    gridContainer.style.maxWidth = '600px';
                } else {
                    cards = 8;
                    gridContainer.style.maxWidth = '600px';
                }
            }
            reset();
        })
    }
}


//Creating cards
function createCards() {
    gameGrid = generateArray(cards)

    for (i = 0; i < gameGrid.length; i++) {
        let card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.dataset.name = gameGrid[i].name;

        let frontView = document.createElement('div');
        frontView.classList.add('front');

        let backView = document.createElement('div');
        backView.classList.add('back');
        backView.style.backgroundImage = `url(${gameGrid[i].img})`;

        grid.appendChild(card);
        card.appendChild(frontView);
        card.appendChild(backView);
    }
}

// Reseting Game Logic
function reset() {
    gameGrid = generateArray(cards)
    resetGuesses();
    moves = '';
    scoreShow.innerHTML = `Moves: ${moves}`;
    let card = document.querySelectorAll('.card');

    for (var i = 0; i < cardsArray.concat(cardsArray).length; i++) {
        if (gameGrid[i]) {
            card[i].style.display = 'block';
            var back = document.querySelectorAll('.back')
            card[i].dataset.name = gameGrid[i].name;
            back[i].style.backgroundImage = `url(${gameGrid[i].img})`;
            card[i].classList.remove('match');
        } else {
            card[i].style.display = 'none';
            card[i].classList.add('match');
        }
    }

    shuffle(card)
    pairs = 0;
    winner.style.transition = '0s'
    winner.style.opacity = '0';

}

// Reset guesses after two attempts
function resetGuesses() {
    firstGuess = '';
    secondGuess = '';
    count = 0;
    previousChoice = null;

    let selected = document.querySelectorAll('.selected');
    for (i = 0; i < selected.length; i++) {
        selected[i].classList.remove('selected');
    }
};


// Adding class to matched cards
function match() {
    let selected = document.querySelectorAll('.selected');
    for (i = 0; i < selected.length; i++) {
        selected[i].classList.add('match');
        pairs++;
        gameOver();
    }
};


// Shuffle divs
function shuffle(elems) {

    allElems = (function () {
        var ret = [],
            l = elems.length;
        while (l--) {
            ret[ret.length] = elems[l];
        }
        return ret;
    })();

    var shuffled = (function () {
            var l = allElems.length,
                ret = [];
            while (l--) {
                var random = Math.floor(Math.random() * allElems.length),
                    randEl = allElems[random].cloneNode(true);
                allElems.splice(random, 1);
                ret[ret.length] = randEl;
            }
            return ret;
        })(),
        l = elems.length;

    while (l--) {
        elems[l].parentNode.insertBefore(shuffled[l], elems[l].nextSibling);
        elems[l].parentNode.removeChild(elems[l]);
    }
}



function generateArray(num) {
    var arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(cardsArray[i])
    }
    return arr.concat(arr);
}

function gameOver() {
    if (pairs === gameGrid.length) {
        winner.style.transition = '2s'
        winner.style.opacity = '1';
        winner.innerHTML = 'You Win!';
    }
}