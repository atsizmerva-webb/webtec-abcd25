"use strict"

const backgroundInput = document.getElementById("background")
const difficultySelect = document.getElementById("difficulty")


const startButton = document.getElementById("start-button")
const restartButton = document.getElementById("restart-button")

const setupSection = document.getElementById ("setup")
const gameSection = document.getElementById("game")
const resultSection = document.getElementById("result")

const loading = document.getElementById("loading")
const gameArea = document.getElementById("game-area")
const duck = document.getElementById("duck")
const duck2 = document.getElementById("duck2")

const timeDisplay = document.getElementById("time")
const scoreDisplay = document.getElementById("score")
const finalScoreDisplay = document.getElementById("final-score")
const highscoreBody = document.getElementById("highscore-body")
const highscoreList = []

const game = {
  duration: 10,
  speed: 1,
  score: 0,
  timeLeft: 10,
  running: false,
  duckImage: null,
  duck2Image: null,
  backgroundImage: null,
  moveTimer: null,
  moveTimer2: null,
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


  game.background = requestedBackground === 0
    ? Math.floor(Math.random() * 5) + 1
    : requestedBackground

  loading.hidden = false
  startButton.disabled = true

  try {

    const config = await loadConfig()
    game.duration = config.duration
    game.speed = config.speed

    const duckUrl = "img/ducky_3_spritesheet.png"
    const duckUrl2 = "img/ducky-idle.png"

    const backgrounds = {
      1: "img/bakgrundsbilder/bg_cave.png",
      2: "img/bakgrundsbilder/bg_desert.png",
      3: "img/bakgrundsbilder/bg_night_forest.png",
      4: "img/bakgrundsbilder/bg_sky.png",
      5: "img/bakgrundsbilder/bg_snowfield.png"
    }
    const backgroundUrl = backgrounds[game.background]

    const [duckResponse, duck2Response, backgroundResponse] = await Promise.all ([
      fetch(duckUrl),
      fetch(duckUrl2),
      fetch(backgroundUrl)

    ])

    if (
      !duckResponse.ok || 
      !duck2Response.ok || 
      !backgroundResponse.ok
    ){
      throw new Error ("Bilderna kunde inte hämtas.")

    }

    const [duckBlob, duck2Blob, backgroundBlob] = await Promise.all ([
      duckResponse.blob(),
      duck2Response.blob(),
      backgroundResponse.blob()
    ])

    game.duckImage = URL.createObjectURL(duckBlob)
    game.duck2Image = URL.createObjectURL(duck2Blob)
    game.backgroundImage = URL.createObjectURL(backgroundBlob)

    duck.src = game.duckImage
    duck2.src = game.duck2Image

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
  moveDuck2()

  game.moveTimer = setInterval(moveDuck, game.speed * 1000)
  game.moveTimer2 = setInterval(moveDuck2, (game.speed + 0.5) * 1000)

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
function moveDuck2() {
  console.log("moveDuck2 körs")
  const maxX = Math.max(0, gameArea.clientWidth - duck2.offsetWidth)
  const maxY = Math.max(0, gameArea.clientHeight - duck2.offsetHeight)

  const x = Math.random()* maxX
  const y = Math.random()* maxY

  duck2.style.left = `${x}px`
  duck2.style.top = `${y}px`
}

function endGame() {
  game.running = false

  clearInterval(game.moveTimer)
  clearInterval(game.moveTimer2)
  clearInterval(game.countdownTimer)

  finalScoreDisplay.textContent = game.score

  saveHighscore()

  gameSection.hidden = true
  resultSection.hidden = false
  
}

function saveHighscore() {
  highscoreList.push({
    score:game.score,
    difficulty: difficultySelect.value
  })
  
  highscoreList.sort((a, b) => b.score - a.score)

  showHighscore()

}

function showHighscore() {
  highscoreBody.replaceChildren()

  highscoreList.forEach((entry, index) => {
    const row = document.createElement("tr")

    const positionCell = document.createElement("td")
    const scoreCell = document.createElement("td")
    const difficultyCell = document.createElement("td")

    positionCell.textContent = index + 1
    scoreCell.textContent = entry.score
    difficultyCell.textContent = entry.difficulty

    row.append(positionCell, scoreCell, difficultyCell)
    highscoreBody.appendChild(row)
  })
  
}

duck.addEventListener("click", () => {
  if (!game.running) {
    return

  }

  game.score++
  scoreDisplay.textContent = game.score

})

duck2.addEventListener("click", () => {
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

async function loadConfig() {
  const difficulty = difficultySelect.value
  const response = await fetch(`config/${difficulty}.json`)

  if (!response.ok) {
    throw new Error ("Kunde inte läsa spelinställningarna.")
  }
  return await response.json()
  
}

/**
 * Enable a responsive navbar toggle.
 */
console.log('Hello navbar')

// Get the hamburger menu button element by its ID
const menuToggle = document.getElementById('menu-toggle')

// Get the navigation links container by its ID
const navLinks = document.getElementById('nav-links')

// Add a click event listener to the menu button
menuToggle.addEventListener('click', () => {
  // Toggle the 'show' class on the nav links to show/hide the menu
  navLinks.classList.toggle('show')
})

