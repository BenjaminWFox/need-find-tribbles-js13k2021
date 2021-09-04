import './main.scss'
import { Person } from './person'
import { randomIntFromTuple } from './util'
import farmImg from '../src/assets/images/icons/corn.png'
import mineImg from '../src/assets/images/icons/rock.png'
import labsImg from '../src/assets/images/icons/labs.png'
import { settings, resetSettings } from './settings'

const $i = document.getElementById.bind(document)
const $s = document.querySelector.bind(document)

/* eslint-disable */
//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
const zzfx = (...t) => zzfxP(zzfxG(...t))

// zzfxP() - the sound player -- returns a AudioBufferSourceNode
const zzfxP = (...t) => { let e = zzfxX.createBufferSource(), f = zzfxX.createBuffer(t.length, t[0].length, zzfxR); t.map((d, i) => f.getChannelData(i).set(d)), e.buffer = f, e.connect(zzfxX.destination), e.start(); return e }

// zzfxG() - the sound generator -- returns an array of sample data
const zzfxG = (q = 1, k = .05, c = 220, e = 0, t = 0, u = .1, r = 0, F = 1, v = 0, z = 0, w = 0, A = 0, l = 0, B = 0, x = 0, G = 0, d = 0, y = 1, m = 0, C = 0) => { let b = 2 * Math.PI, H = v *= 500 * b / zzfxR ** 2, I = (0 < x ? 1 : -1) * b / 4, D = c *= (1 + 2 * k * Math.random() - k) * b / zzfxR, Z = [], g = 0, E = 0, a = 0, n = 1, J = 0, K = 0, f = 0, p, h; e = 99 + zzfxR * e; m *= zzfxR; t *= zzfxR; u *= zzfxR; d *= zzfxR; z *= 500 * b / zzfxR ** 3; x *= b / zzfxR; w *= b / zzfxR; A *= zzfxR; l = zzfxR * l | 0; for (h = e + m + t + u + d | 0; a < h; Z[a++] = f)++K % (100 * G | 0) || (f = r ? 1 < r ? 2 < r ? 3 < r ? Math.sin((g % b) ** 3) : Math.max(Math.min(Math.tan(g), 1), -1) : 1 - (2 * g / b % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(g / b) - g / b) : Math.sin(g), f = (l ? 1 - C + C * Math.sin(2 * Math.PI * a / l) : 1) * (0 < f ? 1 : -1) * Math.abs(f) ** F * q * zzfxV * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - y) : a < e + m + t ? y : a < h - d ? (h - a - d) / u * y : 0), f = d ? f / 2 + (d > a ? 0 : (a < h - d ? 1 : (h - a) / d) * Z[a - d | 0] / 2) : f), p = (c += v += z) * Math.sin(E * x - I), g += p - p * B * (1 - 1E9 * (Math.sin(a) + 1) % 2), E += p - p * B * (1 - 1E9 * (Math.sin(a) ** 2 + 1) % 2), n && ++n > A && (c += w, D += w, n = 0), !l || ++J % l || (c = D, v = H, n = n || 1); return Z }

// zzfxV - global volume
const zzfxV = .1

// zzfxR - global sample rate
const zzfxR = 44100

// zzfxX - the common audio context
const zzfxX = new (window.AudioContext || webkitAudioContext);
//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
const zzfxM = (n, f, t, e = 125) => { let l, o, z, r, g, h, x, a, u, c, d, i, m, p, G, M = 0, R = [], b = [], j = [], k = 0, q = 0, s = 1, v = {}, w = zzfxR / e * 60 >> 2; for (; s; k++)R = [s = a = d = m = 0], t.map((e, d) => { for (x = f[e][k] || [0, 0, 0], s |= !!f[e][k], G = m + (f[e][0].length - 2 - !a) * w, p = d == t.length - 1, o = 2, r = m; o < x.length + p; a = ++o) { for (g = x[o], u = o == x.length + p - 1 && p || c != (x[0] || 0) | g | 0, z = 0; z < w && a; z++ > w - 99 && u ? i += (i < 1) / 99 : 0)h = (1 - i) * R[M++] / 2 || 0, b[r] = (b[r] || 0) - h * q + h, j[r] = (j[r++] || 0) + h * q + h; g && (i = g % 1, q = x[1] || 0, (g |= 0) && (R = v[[c = x[M = 0] || 0, g]] = v[[c, g]] || (l = [...n[c]], l[2] *= 2 ** ((g - 12) / 12), g > 0 ? zzfxG(...l) : []))) } m = G }); return [b, j] }

const song = [[[, 0, 740, , , .15, 2, .2, -.1, -.15, 9, .02, , .1, .12, , .06], [3, 0, 43, , , .25, , , , , , , , 2], [, 0, 219, , , , , 1.1, , -.1, -50, -.05, -.01, 1], [.8, 0, 2100, , , .2, 3, 3, , , -400, , , 2]], [[[, , 1, , , , 1, 5, 8, , , , , , 5, 10, , , 10, 10, , , 10, 6, 8, , , , , , 10, , 10, , 8, 8, , 5, 3, , 1, 5, 5, , , , 12, 13, 13, , 10, 10, , 5, , , 8, 3, , , , 6, 6, , 5, 3], [, , 5, , , , 5, 8, 13, , , , , , 6, 13, , , 15, 13, , , 13, 10, 8, , , , , , 17, , 17, , 15, 15, , 13, 10, , 1, 13, 15, , , , 15, 5, 3, , 1, 1, , , , , 3, 8, , , , 5, 5, , 1, 3], [, , 1, , , , 1, 5, 8, , , , , , 5, 10, , , 10, 10, , , 10, 6, 8, , , , , , 10, , 10, , 8, 8, , 5, 3, , 1, 5, 5, , , , 12, 13, 13, , 10, 10, , 5, , , 8, 3, , , , 6, 6, , 5, 3], [, , , , 32, 29, , , , , , , 30, 27, , , , , , , , , , , , , , 30, 27, 29, , , , , , , , 25, 29, 27, , , , , , , , , , , , , , , , , , , 32, 29, 32, , , , , ,], [1, , 13, , , , , , , , 20, 10, , , , , , , 13, , , , , , , , 25, 12, , , , , , , 13, , , , , , , , 20, 10, , , , , , , 13, , , , , , , , 25, 12, , , , , , ,], [2, , , , , , , , , , , , 20, , , 13, , , , , , , 1, , , , , , 25, , , 20, , , , , , , , , , , , , 20, , , 13, , , , , , , , , , , , , 25, , , 20, , ,], [3, , , , , , , , , , , , 13, , 13, 10, , , , , , , , , , , , , 20, , 20, 5, , , , , , , , , , , , , 13, , 13, 10, , , , , , , , , , , , , 20, , 20, 5, , ,]]], [0], 104, { "title": "HorizonsV1", "instruments": ["Flute", "Bass Drum 2", "Snare 2", "Hihat Open"], "patterns": ["Pattern 0"] }]
let player

/* eslint-enable */

let RECRUIT_MOD = 1.2

let sTick = 0
let hsTick = 0
let qsTick = 0

let workingCountEl
let farmCountEl
let mineCountEl
let labsCountEl
let farmAmountEl
let mineAmountEl
let labsAmountEl
let mainButtonsEl

let villagers
let eventButtons = []
let assignments

const resetAssignments = () => {
  assignments = {
    idle: [],
    farm: [],
    mine: [],
    labs: [],
  }
}
let amounts
const resetAmounts = () => {
  amounts = {
    farm: 0,
    mine: 0,
    labs: 0,
  }
}
let images = {
  farm: new Image(),
  mine: new Image(),
  labs: new Image(),
}
const coords = {
  spawn: [100, 400],
  drop: [260, 290],
  job: [60, 116],
  homeBounds: [0, 520],
  travelBounds: [0, 270],
  jobBounds: [0, 176],
}
const regions = {
  home: '',
  travelLeft: '',
  travelRight: '',
  farm: '',
  mine: '',
  labs: '',
}
let events

const BtnEvent = function (label, fn, cost, showFn = () => false) {
  const { f = 0, m = 0, l = 0 } = cost

  this.pay = () => {
    console.log('PAY')
    if (amounts.farm < this.cost.f || amounts.mine < this.cost.m || amounts.labs < this.cost.l) {
      return false
    }

    amounts.farm -= this.cost.f
    amounts.mine -= this.cost.m
    amounts.labs -= this.cost.l

    updateResources()

    fn()

    checkEvents()

    return true
  }

  this.el = createButton(label, this.pay, cost)
  this.el.style.display = 'none'
  this.cost = { f, m, l }
  this.label = label
  this.fn = fn
  this.checkEnabled = () => {
    if (amounts.farm < this.cost.f || amounts.mine < this.cost.m || amounts.labs < this.cost.l) {
      this.el.disabled = true

      return false
    }

    this.el.disabled = false

    return true
  }
  this.checkDisplay = () => {
    showFn() ? this.el.style.display = 'block' : this.el.style.display = 'none'
    // this.el.style.display = 'block'
  }
  this.checkEnabled()
  this.checkDisplay()
}

const colonize = () => {
  const wr = $s('.wrapper')

  events.colonize.el.classList.add('hidden')
  wr.classList.add('end')
  player.playbackRate.value = 1
  settings.hasTraveled = true

  setTimeout(() => {
    villagers.forEach((v) => {
      v.canvas.parentNode.removeChild(v.canvas)
    })
    eventButtons.forEach((btn) => {
      btn.el.parentNode.removeChild(btn.el)
    })
    wr.classList.remove('end')
    wr.classList.remove('adv')
    regions.travelLeft.classList.remove('clr')
    regions.travelRight.classList.remove('brg')
    $i('hR').classList.remove('p1', 'p2', 'p3', 'p4', 'p5', 'p6')

    init()
    begin()
  }, 9000)
}

const resetEvents = () => {
  const recruitMsg = settings.hasTraveled ? '\'Make\' Villager - They grow up so fast!' : 'Recruit Villager - Do More with More!'

  events = {
    recruit: new BtnEvent(recruitMsg, recruitVillager, { f: 20 }, () => true),
    bridge: new BtnEvent('Bridge Rivers - Faster River Travel!', () => {
      settings.travelRight = 1
      events.bridge.el.classList.add('hidden')
      regions.travelRight.classList.add('brg')
    }, { m: 20, l: 20 },
      () => villagers.length >= 3),
    clear: new BtnEvent('Clear Forests - Faster Forest Travel!', () => {
      settings.travelLeft = 1
      events.clear.el.classList.add('hidden')
      regions.travelLeft.classList.add('clr')
    }, { f: 20, l: 20 },
      () => villagers.length >= 3),
    nutrition: new BtnEvent('Nutrition & Fitness - Move Faster!', () => {
      settings.moveMod += .5
      player.playbackRate.value += .05
      events.nutrition.el.classList.add('hidden')
    }, { f: 20, l: 40 },
      () => villagers.length >= 4),
    tools: new BtnEvent('Lighter, Stronger Tools - Work Faster!', () => {
      settings.workMod += 100
      player.playbackRate.value += .05
      events.tools.el.classList.add('hidden')
    }, { m: 30, l: 30 },
      () => villagers.length >= 6),
    backpacks: new BtnEvent('Ergonomic Backpacks - Carry More!', () => {
      settings.resourceMod += 5
      events.backpacks.el.classList.add('hidden')
    }, { m: 30, l: 60 },
      () => villagers.length >= 8),
    propaganda: new BtnEvent('Motivational Propaganda - Be Better, Comrade!', () => {
      settings.moveMod += .5
      settings.workMod += 50
      player.playbackRate.value += .05
      events.propaganda.el.classList.add('hidden')
    }, { f: 50, l: 100 },
      () => villagers.length >= 10),
    upgrade: new BtnEvent('Advance Society - More Efficiency! More Progress!', () => {
      settings.moveMod += .5
      settings.workMod += 50
      settings.resourceMod += 5
      settings.upgraded = true
      player.playbackRate.value += .05
      $s('.wrapper').classList.add('adv')
      events.upgrade.el.classList.add('hidden')
    },
      { f: 100, m: 100, l: 100 },
      () => settings.moveMod >= 2 && villagers.length >= 12),
    colonize: new BtnEvent('Colonize New Planet - Goodbye World, Hello World!',
      colonize,
      { f: 200, m: 200, l: 200 },
      () => settings.upgraded && villagers.length >= 14),
    // () => villagers.length >= 2),
  }
}

const updateResources = () => {
  farmAmountEl.innerHTML = amounts.farm
  mineAmountEl.innerHTML = amounts.mine
  labsAmountEl.innerHTML = amounts.labs

  checkEvents()
}

const recruitVillager = () => {
  events.recruit.cost.f = Math.round(events.recruit.cost.f * RECRUIT_MOD)
  events.recruit.el.querySelector('.fCost').innerHTML = `: ${events.recruit.cost.f}`
  updateResources()
  addVillager()
}

const createButtons = () => {
  eventButtons = []

  Object.values(events).forEach((v) => {
    eventButtons.push(v)
    mainButtonsEl.appendChild(v.el)
  })
}

const checkEvents = () => {
  eventButtons.forEach((btn) => {
    btn.checkEnabled()
    btn.checkDisplay()
  })
}

const addResource = (r) => {
  amounts[r] += 10 + settings.resourceMod

  updateResources()
  checkEvents()
}

const createButton = (text, fn, cost) => {
  const { f = 0, m = 0, l = 0 } = cost
  const btn = document.createElement('button')
  const csts = document.createElement('div')
  const cst = document.createElement('span')

  btn.addEventListener('click', fn)
  btn.classList.add('mB')
  btn.innerHTML = text
  csts.classList.add('costs')
  btn.appendChild(csts)
  cst.classList.add('cost')

  if (f) {
    const fel = cst.cloneNode()

    fel.innerHTML = `<div class="ib cr"></div><span class="fCost">: ${f}</span>`

    csts.appendChild(fel)
  }

  if (m) {
    const fel = cst.cloneNode()

    fel.innerHTML = `<div class="ib rk"></div><span class="mCost">: ${m}</span>`

    csts.appendChild(fel)
  }

  if (l) {
    const fel = cst.cloneNode()

    fel.innerHTML = `<div class="ib lb"></div><span class="lCost">: ${l}</span>`

    csts.appendChild(fel)
  }

  return btn
}

const updateWorkingCount = () => workingCountEl.innerHTML = `${assignments.farm.length + assignments.mine.length + assignments.labs.length} / ${villagers.length} working`
const updateAssignedCount = () => {
  farmCountEl.innerHTML = assignments.farm.length
  mineCountEl.innerHTML = assignments.mine.length
  labsCountEl.innerHTML = assignments.labs.length
}

const assign = (e) => {
  const [type, action] = e.target.id.split('-')

  switch (action) {
    case 'add':
      if (assignments.idle.length) {
        const v = assignments.idle.shift()
        const dest = randomIntFromTuple(coords.job)

        v.setJob(type, dest)
        assignments[type].push(v)
      }
      break
    case 'sub':
      if (assignments[type].length) {
        const v = assignments[type].shift()

        v.setJob('idle')
        assignments.idle.push(v)
      }
      break
    default:
      break
  }

  updateAssignedCount()
  updateWorkingCount()
}

const initJobButtons = () => {
  document.querySelectorAll('.aB').forEach((button) => {
    button.addEventListener('click', assign)
  })
}

const resetAll = () => {
  villagers = []
  resetAssignments()
  resetAmounts()
  resetEvents()
}

const addElements = () => {
  /* eslint-disable no-sparse-arrays */
  const tlt = [
    [5, 11],
    [240, 6],
    [30, 28, ,],
    [225, 20, ,],
    [55, 14],
    [200, 4],
    [210, 14],
    [140, 4],
    [150, 20],
    [74, 12],
    [180, 20],
    [168, 18, ,],
    [125, 27, ,],
    [40, 8],
    [50, 29, ,],
    [100, 20, ,],
    [95, 18],
  ]
  const hrh = [
    [300], // , 6
    [94], // , 0
    [350], // , 0
    [225], // , 0
    [480,], //  -1
    [145], // , 4
    [405], // , 3
  ]
  // const hrt = []
  /* eslint-enable no-sparse-arrays */

  for (let i = 0; i < tlt.length; i++) {
    const d = document.createElement('div')

    // 0=1 1=2 2=1 3=2 4=1
    d.classList.add(`tr${i % 2 + 1}`)
    d.style.left = tlt[i][0] + 'px'
    d.style.top = tlt[i][1] + 'px'
    if (tlt[i].length > 2) {
      d.classList.add('trtmp')
      d.style.zIndex = 600
    }

    regions.travelLeft.appendChild(d)
  }

  for (let i = 0; i < hrh.length; i++) {
    const d = document.createElement('div')

    d.classList.add('l', 'px', `h${i}`, `hs${i}`)
    d.style.left = hrh[i][0] + 'px'
    // d.style.top = hrh[i][1] + 'px'
    i > 0 ? d.style.opacity = 0 : ''
    regions.home.appendChild(d)
  }
}

const init = () => {
  resetSettings()
  resetAll()
  regions.home = $i('hR')

  if (settings.hasTraveled && !$i('ldbg')) {
    const lander = $i('ld').cloneNode(true)

    lander.classList.remove('space')
    lander.classList.remove('ld')
    lander.classList.add('ldbg')
    lander.id = 'ldbg'
    regions.home.appendChild(lander)
  }

  regions.travelLeft = $i('tLR')
  regions.travelRight = $i('tRR')
  regions.farm = $i('fR')
  regions.mine = $i('mR')
  regions.labs = $i('lR')
  farmCountEl = $i('fC')
  mineCountEl = $i('mC')
  labsCountEl = $i('lC')
  farmAmountEl = $i('fA')
  mineAmountEl = $i('mA')
  labsAmountEl = $i('lA')
  workingCountEl = $i('working')
  mainButtonsEl = $i('mBs')

  if (!settings.hasTraveled) {
    addElements()
  }

  images.farm.src = farmImg
  images.mine.src = mineImg
  images.labs.src = labsImg

  updateWorkingCount()
  updateAssignedCount()
  updateResources()
  createButtons()
  initJobButtons()
}

const addVillager = (pos = randomIntFromTuple(coords.homeBounds)) => {
  const v = new Person()

  v.init(coords, regions, addResource, images)
  v.setPos(pos)
  v.setRegion('home')
  v.setFaceDir(randomIntFromTuple([0, 1]) === 0 ? 'r' : 'l')
  assignments.idle.push(v)

  villagers.push(v)

  checkEvents()
  updateWorkingCount()

  if (villagers.length < 25) {
    $i('hR').classList.add(`p${Math.floor(villagers.length / 2)}`)
  }

  return v
}

const begin = () => {
  addVillager()
  addVillager()

  updateWorkingCount()
}

function play(time) {

  if (sTick + 1000 < time) {
    sTick = time
  }

  if (hsTick + 500 < time) {
    hsTick = time
  }

  if (qsTick + 250 < time) {
    qsTick = time
  }

  villagers.forEach((v) => {
    v.update(time)
  })

  // Loop
  window.requestAnimationFrame(play)
}

const startMusic = () => {
  document.removeEventListener('click', startMusic)

  player = zzfxP(...zzfxM(...song))
  player.loop = true
}

window.onload = () => {
  document.addEventListener('click', startMusic)

  const st = document.createElement('style')

  st.innerHTML = `
  .cr {
    background-image: url('${farmImg}');
    background-size: contain;
  }
  .rk {
    background-image: url('${mineImg}');
    background-size: contain;
  }
  .lb {
    background-image: url('${labsImg}');
    background-size: contain;
  }
  `
  document.head.appendChild(st)

  let initialButtonEl = $i('farm-add')

  function removeBtn() {
    initialButtonEl.style.animation = ""
    initialButtonEl.removeEventListener('click', removeBtn)
  }
  initialButtonEl.addEventListener('click', removeBtn)
  initialButtonEl.style.animation = 'gl 1s infinite alternate'
  init()
  begin()
  play()
}
