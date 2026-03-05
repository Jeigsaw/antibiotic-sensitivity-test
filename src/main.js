import { randomPointInCircle } from "./util"
import { BacterialColony } from "./Bacteria"
import { Antibiotic } from "./Antibiotic"

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = Math.min(document.documentElement.clientWidth, 400)
canvas.height = canvas.width

let isSimPaused = true
let isSimComplete = false
const startBtn = document.getElementById('startBtn')
startBtn.addEventListener('click', ()=>isSimPaused = false)
const resetBtn = document.getElementById('resetBtn')
resetBtn.addEventListener('click', ()=>{
  reset()
  isSimPaused = true
})

let draggedItem = null
const draggables = document.querySelectorAll('.draggable')
draggables.forEach((el)=>{
  el.addEventListener('dragstart', (e)=>draggedItem = e.target)
  el.addEventListener('touchstart', (e)=>draggedItem = e.target)
})

canvas.addEventListener("dragover", (e)=>{
  e.preventDefault()
})

document.getElementById('closeAboutBtn').addEventListener('click', (e)=>{
  document.getElementById('aboutSection').style.display = 'none'
})
document.getElementById('showAboutBtn').addEventListener('click', (e)=>{
  document.getElementById('aboutSection').style.display = 'flex'
})

// Bacteria strain selector
const strainBtns = document.querySelectorAll('.bacterium')
strainBtns.forEach(button => {
  button.addEventListener('click', () => {
    strainBtns.forEach(btn => btn.classList.remove('selected'))
    button.classList.add('selected')
    createColony(button.id)
  })
})



// petri dish
const dishRadius = 190
const dishCenter = { x: canvas.width / 2, y: canvas.height / 2 }
function drawPetriDish() {
  ctx.beginPath()
  ctx.arc(dishCenter.x, dishCenter.y, dishRadius, 0, 2 * Math.PI)
  ctx.fillStyle = '#f6ebbaaa'
  ctx.fill()
  ctx.strokeStyle = '#9ac7af'
  ctx.lineWidth = 3
  ctx.stroke()
}

// Bacterial colony
let colonies = []
const colonyCount = 2000
function createColony(strain){
  // reset()
  colonies = []
  for (let i = 0; i < colonyCount; i++) {
    const pos = randomPointInCircle(dishCenter.x, dishCenter.y, dishRadius - 5)
    colonies.push(new BacterialColony(pos.x, pos.y, dishCenter, dishRadius, strain))
  }
}
createColony('strain1')

// Antibiotics
const antibiotics = [
  new Antibiotic(0,0, 0.7, "A"),
  new Antibiotic(0,0, 0.6, "B"),
  new Antibiotic(0,0, 0.8, "C")
];

function reset(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPetriDish()
  colonies.forEach((bacteria)=>{
    const pos = randomPointInCircle(dishCenter.x, dishCenter.y, dishRadius - 5)
    bacteria.x = pos.x
    bacteria.y = pos.y
    bacteria.radius = 0.5
    bacteria.draw(ctx)
  })

  // add antibiotics
  antibiotics.forEach((ab)=>{ab.x = 0, ab.y = 0})
}

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPetriDish()

  antibiotics.forEach(ab => ab.draw(ctx))

  // clip the bacterial colony outside petri-dish
  ctx.save()
  ctx.beginPath()
  ctx.arc(dishCenter.x, dishCenter.y, dishRadius-2, 0, 2 * Math.PI)
  ctx.clip()

  // draw bacterial colony 
  colonies.forEach(colony => {
    colony.draw(ctx)
  })
  ctx.restore()
}

function update(){
  isSimComplete = isSimCompleted()

  if(!isSimPaused && !isSimComplete){
    colonies.forEach(colony => {
      colony.grow(antibiotics)
    })
    draw()
  }
  requestAnimationFrame(update)
}

// Drag and drop events
window.addEventListener('load', ()=>{
  reset()
	requestAnimationFrame(update)

  canvas.addEventListener("drop", (event)=>{
    let antibiotic = null
    switch (draggedItem.id) {
      case 'A':
        antibiotic = antibiotics.find((ab)=>ab.type === 'A')
        antibiotic.x = event.offsetX
        antibiotic.y = event.offsetY
        antibiotic.draw(ctx)
        break
      case 'B':
        antibiotic = antibiotics.find((ab)=>ab.type === 'B')
        antibiotic.x = event.offsetX
        antibiotic.y = event.offsetY
        antibiotic.draw(ctx)
        break
      case 'C':
        antibiotic = antibiotics.find((ab)=>ab.type === 'C')
        antibiotic.x = event.offsetX
        antibiotic.y = event.offsetY
        antibiotic.draw(ctx)
        break
      default:
        break;
    }
    draggedItem = null
  })
});

function isSimCompleted(){
  return Math.max(...colonies.map(colony=>colony.radius)) >= colonies[0].maxRadius
}

