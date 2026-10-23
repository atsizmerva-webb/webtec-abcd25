"use strict"

const box = document.getElementById("box")

function centerBox() {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const boxWidth = box.offsetWidth 
  const boxHeight = box.offsetHeight
  
  const left = (windowWidth - boxWidth) / 2
  const top = (windowHeight - boxHeight) / 2

  box.style.left=`${left}px`
  box.style.top=`${top}px`
  
  console.log("Fönstrets bredd:", windowWidth)
  console.log("Fönstrets höjd:", windowHeight)
  console.log("Lådans bredd", boxWidth)
  console.log("Lådans höjd", boxHeight)
  console.log("Position", left, top)

}

window.addEventListener("resize", centerBox)
centerBox()

function toggleSelected(event) {
  event.currentTarget.classList.toggle("selected")
}

box.addEventListener("click", toggleSelected)


function doubleClick(event) {
  const element = event.currentTarget

  element.classList.add("animateSize")
  element.style.width = "2px"
  element.style.height = "2px"

  setTimeout(() => {
    element.remove()
      
  }, 2000)
}

box.addEventListener("dblclick", doubleClick)

function getSelected() {
  return document.querySelectorAll(".box.selected")
}
function keyboardPress(event) {
  const key = event.key.toLowerCase()
  const selected = getSelected()

  if (key==="e") {
    selected.forEach((element) =>{
      element.classList.toggle("circle")

    })
    
  }
  
  if (key=== "r") {
    const colors = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "indigo",
      "violet"

    ]

    selected.forEach((element) => {
      let currentColor = colors.find((color) =>
        element.classList.contains(color)
    
      )


      const oldColor = currentColor || "red"
      const index = colors.indexOf(oldColor)
      const nextColor = colors [(index + 1) % colors.length]

      element.classList.remove(...colors)
      element.classList.add(nextColor)

    })
  }


  if (key === "i") {
    document.querySelectorAll(".box").forEach((element) => {
      element.classList.add("selected")

    })
  
  }

  if (key === "u") {
    selected.forEach((element) => {
      element.classList.remove("selected")

    })
  
  }

  if (key === "y") {
    selected.forEach((element) => {
      element.remove()
  
    })

  }

  if (key === "p") {
    createBox()
  }

  if (key.startsWith("arrow")) {
    moveSelected(key)
  
  }

}

function createBox() {
  const element = document.createElement("div")

  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet"
  ]
  
  const color = colors[Math.floor(Math.random() * colors.length)]
  const isCircle = Math.random() < 0.5

  const maxLeft = Math.max(0, window.innerWidth - 200)
  const maxTop = Math.max(0, window.innerHeight - 200)

  const left = Math.floor(Math.random() * (maxLeft + 1))
  const top = Math.floor(Math.random() * (maxTop + 1))

  element.classList.add("box", color)

  if (isCircle) {
    element.classList.add("circle")
  }

  element.style.left = `${left}px`
  element.style.top = `${top}px`

  element.addEventListener("click", toggleSelected)
  element.addEventListener("dblclick", doubleClick)

  document.body.appendChild(element)
  
}

function moveSelected(key) {
  const distance = 10
  const selected = getSelected()

  selected.forEach((element) => {
    let left = element.offsetLeft
    let top = element.offsetTop

    if (key === "arrowleft") {
      left -= distance
    } else if (key === "arrowright") {
      left += distance
    } else if (key === "arrowup") {
      top -= distance
    } else if (key === "arrowdown") {
      top += distance


    } 

    const maxLeft = window.innerWidth - element.offsetWidth
    const maxTop = window.innerHeight - element.offsetHeight

    left = Math.max(0, Math.min(left, maxLeft))
    left = Math.max(0, Math.min(top, maxTop))

    element.style.left = `${left}px`
    element.style.top = `${top}px`

  })
  
}
document.addEventListener("keydown", keyboardPress)

