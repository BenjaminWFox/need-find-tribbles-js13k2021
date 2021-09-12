import './main.scss'
// import 'regenerator-runtime'
import { doNearStuff, signIn, signOut, claimNFT, viewNFT } from './near'
import * as UI from './docui'
import C from './constants'
import state from './state'

/**
 * Imported in `index.html` -
 * Near API: https://js13kgames.com/src/near-api-js.js
 *  - Near API JS Documentation: https://docs.near.org/docs/develop/front-end/near-api-js
 * Johannes Baagøe's Alea PRNG: https://github.com/davidbau/seedrandom
 */

const dims = 1000
const map = []
const arng = new alea('hello.')
const opts = [0, 50, 100, 150, 200, 225, 250]
const l = opts.length - 1
const t = dims - l
const keyZones = {}
const gearZones = {}
const otherZones = {}
const spaceZones = {}

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
    const data = await viewNFT(tribbleId)

    if (data) {
      console.log(' - Tribble zone')
      UI.showFoundTribble()
      UI.setDetails('tribble', tribblePreview)
      UI.setTribbleData(data)

      return true
    }

    return false
  },
  getRandomGear: () => {
    const keysArr = Object.keys(C.GEAR)
    // -2 because we don't need to include the stuffed tribble.
    const i = randomIntInclusive(0, keysArr.length - 2)
    const gear = keysArr[i]

    UI.setDetails('gear', UI.getGearUrl(gear))

    if (!C.GEAR[gear]) {
      window.localStorage.setItem(gear, 'true')

      C.GEAR[gear] = true

      UI.setGearMessage(gear, true)
    }
    else {
      UI.setGearMessage(gear, false)
    }
  },
  giveStuffedTribble: () => {
    // UI.setGearData('stuffed-tribble')
    UI.setDetails('stuffed', UI.getGearUrl('stuffed-tribble'))
    C.GEAR['stuffed-tribble'] = true
    window.localStorage.setItem('stuffed-tribble', 'true')
  },
  checkClickedPixel: async ({ x, y, key }) => {
    UI.setDataFetching(true)
    UI.setTab('sI')

    if (!C.GEAR['stuffed-tribble']) {
      util.giveStuffedTribble()
    }
    else if (gearZones[key]) {
      console.log(' - Gear zone')
      util.getRandomGear()
      UI.setAllGearEls()
    }
    else if (otherZones[key]) {
      console.log(' - Other zone')
      const cid = randomIntInclusive(1, 670)
      let content = ''

      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${cid}`)
        const result = await response.json()
        const { name, location, species, origin, image } = result

        content = `You found ${name} the ${species}.<br/><br/>`
        content += origin.name === location.name ? `Lives on ${origin?.name}.` : `Originally from ${origin?.name}, now on ${location?.name}.`
        UI.$i('otherText').innerHTML = content
        UI.setDetails('other', image)
      }
      catch (err) {
        UI.$i('otherText').innerHTML = 'Who can say, but what it once was it is now not and never will be again.'
        UI.setDetails('other', null)
      }
    }
    else if (spaceZones[key]) {
      console.log(' - Space zone')
      const query = ['planet', 'nebula', 'galaxy', 'beautiful']
      const rApi = randomIntInclusive(0, 3)
      const rPage = randomIntInclusive(1, 3)
      const response = await fetch(`https://images-api.nasa.gov/search?media_type=image&q=${query[rApi]}&page=${rPage}`)

      try {

        const result = await response.json()

        const idx = randomIntInclusive(0, result.collection.items.length - 1)
        const entry = result.collection.items[idx]
        const image = entry.links[0].href
        const { title, nasa_id } = entry.data[0]

        UI.setDetails('space', image)
        UI.$i('spaceText').innerHTML = `${title}.<br/><br/><a href="https://images-assets.nasa.gov/image/${nasa_id}/metadata.json" target="_blank">Read more from NASA<a/>!`
      }
      catch (e) {
        UI.setDetails('empty')
      }
    }
    else {
      // TESTING:
      // const found = await util.showTribble(util.getRandomKeyPoint())

      // LIVE:
      const found = await util.showTribble(key)

      if (!found) {
        console.log(' - Empty zone')
        UI.setDetails('empty')
      }
    }

    // if (keyZones[key]) {
    // }

    state.clickCheckInProgress = false
    UI.setDataFetching(false)
  },
}

const addHotCoords = (n, j, i) => {
  // if (n > 504 && n < 515) {
  //   keyZones[`${j}-${i}`] = true
  // }
  if (n > 600 && n < 700) {
    gearZones[`${j}-${i}`] = true
  }
  if (n > 800 && n < 900) {
    otherZones[`${j}-${i}`] = true
  }
  if (n > 200 && n < 500) {
    spaceZones[`${j}-${i}`] = true
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

  // const keyStr = Object.keys(keyZones).join(',')

  // If required, reenable to get filenames for all tokens:
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor(event.clientX - rect.left)
  const y = Math.floor(event.clientY - rect.top)

  return { x, y, key: `${x}-${y}` }
}

function initLocalStorage() {
  const gearArr = Object.keys(C.GEAR)

  gearArr.forEach((key) => {
    if (window.localStorage.getItem(key)) {
      C.GEAR[key] = true
    }
  })
}

window.onload = async () => {
  initLocalStorage()

  UI.modClassById(false, 'b', 'loading')
  UI.setAllGearEls()
  UI.setDetails('empty')

  await doNearStuff()
  // const viewBtn = document.getElementById('view')
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  window.fn = {
    signIn,
    signOut,
    claimNFT,
    closeOverlay: () => UI.setOverlay(false),
    setTab: UI.setTab,
    setGearImage: UI.setGearImage,
    showAbout: UI.showAbout,
    showBackTribbles: UI.showBackTribbles,
    downloadStuffedTribble: UI.downloadStuffedTribble,
  }

  canvas.width = dims
  canvas.height = dims
  canvas.addEventListener('mousedown', function (e) {
    const pos = getCursorPosition(canvas, e)

    // const p = util.getRandomKeyPoint()
    if (!state.clickCheckInProgress) {
      state.clickCheckInProgress = true
      console.log('CLICKING...')
      util.checkClickedPixel(pos)
    }
    else {
      console.log('CAN NOT CLICK')
    }
  })

  colorCanvas(ctx)

}
