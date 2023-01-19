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
    'LightPink',
    'HoneyDew',
    'Gold',
    'DarkSlateBlue'
]


//  selectors object
const selectors = {
    gameGrid: document.querySelector<HTMLDivElement | null>('.js-game-grid'),
    moves: document.querySelector<HTMLDivElement | null>('.js-game-moves'),
    matches: document.querySelector<HTMLDivElement | null>('.js-game-matches'),
    timer: document.querySelector<HTMLDivElement | null>('.js-game-timer'),
    gameBtn: document.querySelector<HTMLButtonElement | null>('.js-game-btn'),
}


//  init state object
const initState = {
    gameStarted: false,
    totalMatches: 0,
    totalMoves: 0,
    totalTime: 0,
    timer: <NodeJS.Timer | null> null,
    cardOne: <HTMLDivElement | null> null,
    cardTwo: <HTMLDivElement | null> null,
    isCardFlipped: false,
    lockBoard: false,
    gridLength: 8,
}


let state = {...initState}


//  picks cards colors from array randomly
const pickRandomCards = (colors: string[], items: number) => {
    const colorsCopy = [...colors]
    const randomPicks: string[] = []

    for(let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * colorsCopy.length)

        randomPicks.push(colorsCopy[randomIndex])
        colorsCopy.splice(randomIndex, 1)
    }

    return randomPicks
}


//  shuffle selected cards colors
const shuffleCards = (cards: string[]) => {
    const cardsCopy = [...cards]

    for(let i = cardsCopy.length -1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const original = cardsCopy[i]

        cardsCopy[i] = cardsCopy[randomIndex]
        cardsCopy[randomIndex] = original
    }
    
    return cardsCopy
}


//  create and append game cards
const drawBoard = () => {
    const pickedCards = pickRandomCards(colors, state.gridLength / 2)
    const shuffledCards = shuffleCards([...pickedCards, ...pickedCards])

    const cards = shuffledCards.map(name => 
        `<div class="game-card js-game-card" data-card-name="${name}">
            <div class="game-card__inner">
                <div class="game-card__front">
                    <span class="game-card__txt"></span>
                </div>
                <div class="game-card__back" style="background-color: ${name};">
                </div>
            </div>
        </div>`).join('')
    selectors.gameGrid.innerHTML = cards
}


//  moves counter
const updateMoves = () => {
    state.totalMoves++
    selectors.moves.innerText = `${state.totalMoves}`
}


//  matches counter
const updateMatches = () => {
    state.totalMatches++
    selectors.matches.innerText = `${state.totalMatches}`
}


//  check if last flipped cards match
const checkForMatch = () => {
    if(state.cardOne.dataset.cardName === state.cardTwo.dataset.cardName) {
        // state.cardOne.removeEventListener('click', cardListener)
        // state.cardTwo.removeEventListener('click', cardListener)

        updateMatches()
    } else {
        state.lockBoard = true
        setTimeout(() => {
            state.cardOne.classList.remove('flipped')
            state.cardTwo.classList.remove('flipped')

            state.lockBoard = false
        }, 700)
    }

    updateMoves()
}


//  check if found all matches
const checkWin = () => {
    const notFlipped = document.querySelectorAll('.js-game-card:not(.flipped)')

    return (!notFlipped.length)
}


//  card flip mechanism
const flipCard = (card: HTMLDivElement | null) => {
    
    if(!card) return

    if(!state.gameStarted) {
        state.gameStarted = true
        
        state.timer = setInterval(() => {
            state.totalTime++
    
            selectors.timer.innerText = `${state.totalTime} sec`
        }, 1000)
    }

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

        if(checkWin()) {

            setTimeout(() => alert('Gratulācijas!!! Tu uzvarēji!'), 800)
            
            clearInterval(state.timer)
        }
    }
}


//  reset stats and state
const resetStats = () => {
    state = {...initState}

    selectors.matches.innerHTML = '0'
    selectors.moves.innerHTML = '0'
    selectors.timer.innerHTML = ''

    clearInterval(state.timer)
}

//  init game
const initializeGame = () => {
    resetStats()

    document.querySelector('.js-game-btn').textContent = 'Reset'

    drawBoard()
}


//  game button listener for game initialization
selectors.gameBtn.addEventListener('click', initializeGame)


//  event listener for created cards
document.addEventListener("click", function(e) {
    const target = <HTMLDivElement>e.target
    
    const card = target.closest('.js-game-card')

    if(target) flipCard(<HTMLDivElement>card)
})



    // const cardListener = (event: MouseEvent) => {
    //     console.log('clicked')
    //     flipCard(<HTMLDivElement>event.currentTarget)
    // }
    
    // selectors.cards.forEach(card => card.addEventListener('click', cardListener))