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

const selectors = {
    gameGrid: document.querySelector<HTMLDivElement | null>('.js-game-grid'),
    moves: document.querySelector<HTMLDivElement | null>('.js-game-moves'),
    matches: document.querySelector<HTMLDivElement | null>('.js-game-matches'),
    timer: document.querySelector<HTMLDivElement | null>('.js-game-timer'),
    gameBtn: document.querySelector<HTMLButtonElement | null>('.js-game-btn'),
}

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

const updateMoves = () => {
    state.totalMoves++
    selectors.moves.innerText = `${state.totalMoves}`
}

const updateMatches = () => {
    state.totalMatches++
    selectors.matches.innerText = `${state.totalMatches}`
}

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

const checkWin = () => {
    const notFlipped = document.querySelectorAll('.js-game-card:not(.flipped)')

    return (!notFlipped.length)
}

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
            alert('Gratulācijas!!! Tu uzvarēji!')
            clearInterval(state.timer)
        }
    }
}

const initializeGame = () => {
    state = {...initState}

    document.querySelector('.js-game-btn').textContent = 'Reset'

    clearInterval(state.timer)

    drawBoard()
}

selectors.gameBtn.addEventListener('click', initializeGame)

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