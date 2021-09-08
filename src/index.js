import './main.scss'
// import 'regenerator-runtime'
import { doNearStuff, signIn, signOut, claimNFT, viewNFT } from './near'
import C from './constants'

/**
 * Imported in `index.html` -
 * Near API: https://js13kgames.com/src/near-api-js.js
 *  - Near API JS Documentation: https://docs.near.org/docs/develop/front-end/near-api-js
 * Johannes Baagøe's Alea PRNG: https://github.com/davidbau/seedrandom
 */

function randomIntInclusive(min, max) { // min and max included
  return Math.floor((Math.random() * (max - min + 1)) + min)
}
// function randomIntFromTuple(arr) { // min and max included
//   return Math.floor((Math.random() * (arr[1] - arr[0] + 1)) + arr[0])
// }

/**
 * EVENTS
 */
const util = {
  getRandomKeyPoint: () => {
    const zoneKeys = Object.keys(keyZones)

    const i = randomIntInclusive(0, zoneKeys.length)

    return zoneKeys[i]
  },
  getTribbleId: (keyPoints) => {
    return `${C.TRIBBLE_PREFIX}${keyPoints}`
  },
  getTribblePreview: (keyPoints) => {
    return `${C.TRIBBLE_PREVIEW_URL}${C.TRIBBLE_PREFIX}${keyPoints}${C.TRIBBLE_SUFFIX}`
  },
  showTribble: async (keyPoints) => {
    const tribbleId = util.getTribbleId(keyPoints)
    const tribblePreview = util.getTribblePreview(keyPoints)

    document.getElementById('display').innerHTML = `<img src="${tribblePreview}" />`

    // const tResponse = await fetch('https://rest.nearapi.org/view_nft', {
    //   method: 'POST',
    //   body: {
    //     token_id: tribbleId,
    //     contract: 'need-find-tribbles-js13k.testnet',
    //   },
    //   headers: { 'Content-Type': 'application/json' },
    // })
    const data = await viewNFT(tribbleId)

    console.log(data)
  },
}
const dims = 1000
const map = []
const arng = new alea('hello.')
const opts = [0, 50, 100, 150, 200, 225, 250]
const l = opts.length - 1
const t = dims - l
const keyZones = {}
const gearZones = {}
const otherZones = {}

const addHotCoords = (n, j, i) => {
  if (n > 504 && n < 515) {
    keyZones[`${j}-${i}`] = true
  }
  if (n > 600 && n < 700) {
    gearZones[`${j}-${i}`] = true
  }
  if (n > 800 && n < 900) {
    otherZones[`${j}-${i}`] = true
  }
}

const getColor = (a, b) => {
  const prn = arng()
  const r = parseInt(prn * dims, 10)

  addHotCoords(r, a, b)

  if (r < t) {
    return opts[0]
  }

  const v = opts[dims - r]

  return v
}

const colorCanvas = (ctx) => {
  for (let i = 0; i < dims; i += 1) {
    const row = []

    for (let j = 0; j < dims; j += 1) {
      const c = getColor(j, i)

      row.push(c)
      ctx.fillStyle = `rgb(${c}, ${c}, ${c})`
      ctx.fillRect(j, i, 1, 1)
    }

    map.push(row)
  }

  const keyStr = Object.keys(keyZones).join(',')

  console.log('Key Zones', Object.keys(keyZones).length) // 10048
  console.log('Gear Zones', Object.keys(gearZones).length) // 98464
  console.log('Other Zones', Object.keys(otherZones).length) // 99027

  // If required, reenable to get filenames for all tokens:
  // console.log(keyStr)
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  if (keyZones[`${x}-${y}`]) {
    console.log('!!KEY ZONE!!', x, y)
  }
  else if (gearZones[`${x}-${y}`]) {
    console.log('Gear Zone', x, y)
  }
  else if (otherZones[`${x}-${y}`]) {
    console.log('Other Zone', x, y)
  }
  else {
    console.log(`x: ${ x } y: ${ y}`)
  }
}

window.onload = async () => {
  console.log('NEARAPI', window.nearApi)

  await doNearStuff()
  // const viewBtn = document.getElementById('view')
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  window._fn = {
    signIn,
    signOut,
    claimNFT,
  }

  canvas.width = dims
  canvas.height = dims
  canvas.addEventListener('mousedown', function (e) {
    getCursorPosition(canvas, e)
    const p = util.getRandomKeyPoint()

    util.showTribble(p)
  })

  colorCanvas(ctx)

  console.log('Complete', keyZones, Object.keys(gearZones).length, Object.keys(otherZones).length)
}
