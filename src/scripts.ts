const colors = [
    'HotPink',
    'DodgerBlue',
    'DarkViolet',
    'DarkGreen',
    'Aquamarine',
    'LawnGreen',
    'LightSlateGray',
    'Olive',
    'OrangeRed',
    'Tomato',
    'Yellow',
    'Purple',
    'White',
    'Purple',
    'LightPink',
    'HoneyDew',
    'Gold',
    'DarkSlateBlue'
]

const selectors = {
    cards: document.querySelectorAll<HTMLDivElement | null>('.js-game-card'),
    moves: document.querySelector<HTMLDivElement | null>('.js-game-moves'),
    matches: document.querySelector<HTMLDivElement | null>('.js-game-matches'),
    timer: document.querySelector<HTMLDivElement | null>('.js-game-timer'),
    startBtn: document.querySelector<HTMLButtonElement | null>('.js-game-start-btn'),
    resetBtn: document.querySelector<HTMLButtonElement | null>('.js-game-reset-btn'),
}

const initState = {
    gameStarted: false,
    totalMatches: 0,
    totalMoves: 0,
    totalTime: 0,
    cardOne: <HTMLDivElement | null> null,
    cardTwo: <HTMLDivElement | null> null,
    isCardFlipped: false,
    lockBoard: false,
}

const state = {...initState}


const updateMoves = () => {
    state.totalMoves++
    selectors.moves.innerHTML = `${state.totalMoves}`
}

const updateMatches = () => {
    state.totalMatches++
    selectors.matches.innerHTML = `${state.totalMatches}`
}

const checkForMatch = () => {
    if(state.cardOne.dataset.cardName === state.cardTwo.dataset.cardName) {
        state.cardOne.removeEventListener('click', cardListener)
        state.cardTwo.removeEventListener('click', cardListener)

        updateMatches()
    } else {
        state.lockBoard = true
        setTimeout(() => {
            state.cardOne.classList.remove('flipped')
            state.cardTwo.classList.remove('flipped')

            state.lockBoard = false
        }, 1200)
    }

    updateMoves()
}
const flipCard = (card: HTMLDivElement) => {
    
    const cardClass = card.classList
    
    if(cardClass.contains('flipped')) return
    if(state.lockBoard) return

    cardClass.add('flipped')

    if(!state.isCardFlipped) {
        state.isCardFlipped = true
        state.cardOne = card
    } else {
        state.isCardFlipped = false
        state.cardTwo = card

        checkForMatch()
    }
}

const cardListener = (event: MouseEvent) => {
    flipCard(<HTMLDivElement>event.currentTarget)
}

selectors.cards.forEach(card => card.addEventListener('click', cardListener))

const initializeGame = () => {
    
}