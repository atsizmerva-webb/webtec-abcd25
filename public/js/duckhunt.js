"use strict"

const backgroundInput = document.getElementById("background")
const durationSelect = document.getElementById("duration")
const speedSelect = document.getElementById("speed")

const startButton = document.getElementById("start-button")
const restartButton = document.getElementById("restart-button")

const setupSection = document.getElementById ("setup")
const gameSection = document.getElementById("game")
const resultSection = document.getElementById("result")

const loading = document.getElementById("loading")
const gameArea = document.getElementById("game-area")
const duck = document.getElementById("duck")

const timeDisplay = document.getElementById("time")
const scoreDisplay = document.getElementById("score")
const finalScoreDisplay = document.getElementById("final-score")

const game = {
  duration: 10,
  speed: 1,
  score: 0,
  timeLeft: 10,
  running: false,
  duckImage: null,
  backgroundImage: null,
  moveTimer: null,
  countdownTimer: null

}

async function setupGame() {
  const requestedBackground = Number(backgroundInput.value)

  if (
    !Number.isInteger(requestedBackground) || 
    requestedBackground < 0 ||
    requestedBackground > 5

  ) {
    
    alert("Välj en bakgrund mellan 0 och 5.")
    return false
  }

  game.duration = Number(durationSelect.value)
  game.speed = Number(speedSelect.value)

  game.background = requestedBackground === 0
    ? Math.floor(Math.random() * 5) + 1
    : requestedBackground

  loading.hidden = false
  startButton.disabled = true

  try {
    const duckUrl = "https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom06/duck/duck.png" 

    const backgroundUrl = 
    `https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom06/backgrounds/${game.background}.jpg`

    const [duckResponse, backgroundResponse] = await Promise.all ([
      fetch(duckUrl),
      fetch(backgroundUrl)

    ])

    if (!duckResponse.ok || !backgroundResponse.ok) {
      throw new Error ("Bilderna kunde inte hämtas.")

    }

    const [duckBlob, backgroundBlob] = await Promise.all ([
      duckResponse.blob(),
      backgroundResponse.blob()
    ])

    game.duckImage = URL.createObjectURL(duckBlob)
    game.backgroundImage = URL.createObjectURL(backgroundBlob)

    duck.src = game.duckImage
    gameArea.style.backgroundImage = 
        `url("${game.backgroundImage}")`

    return true

  } catch (error) {
    console.error(error)
    alert("Det gick inte att ladda bilderna. Försök igen.")
    return false
  } finally {
    loading.hidden = true
    startButton.disabled = false

  }
  
}

function startGame() {
  game.score = 0
  game.timeLeft = game.duration
  game.running = true

  scoreDisplay.textContent = game.score
  timeDisplay.textContent = game.timeLeft

  setupSection.hidden = true
  resultSection.hidden = true
  gameSection.hidden = false

  moveDuck()

  game.moveTimer = setInterval(moveDuck, game.speed * 1000)

  game.countdownTimer = setInterval(() => {
    game.timeLeft--
    timeDisplay.textContent = game.timeLeft

    if (game.timeLeft <= 0) {
      endGame()

    }

  }, 1000)
  
}

function moveDuck() {
  const maxX = Math.max(0, gameArea.clientWidth - duck.offsetWidth)
  const maxY = Math.max(0, gameArea.clientHeight - duck.offsetHeight)

  const x = Math.random()* maxX
  const y = Math.random()* maxY

  duck.style.left = `${x}px`
  duck.style.top = `${y}px`

}

function endGame() {
  game.running = false

  clearInterval(game.moveTimer)
  clearInterval(game.countdownTimer)

  finalScoreDisplay.textContent = game.score

  gameSection.hidden = true
  resultSection.hidden = false
  
}

duck.addEventListener("click", () => {
  if (!game.running) {
    return

  }

  game.score++
  scoreDisplay.textContent = game.score

})

startButton.addEventListener("click", async () => {
  const ready = await setupGame()

  if (ready) {
    startGame()
  }

})

restartButton.addEventListener("click", () => {
  resultSection.hidden = true
  setupSection.hidden = false

})

backgroundInput.addEventListener("change", () => {
  const value = Number(backgroundInput.value)

  if (!Number.isInteger(value) || value < 0 || value > 5) {
    backgroundInput.value = 0
    
  }
})