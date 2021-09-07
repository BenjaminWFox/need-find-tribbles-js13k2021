import './main.scss'
import 'regenerator-runtime'
/**
 * Imported in `index.html` - https://js13kgames.com/src/near-api-js.js
 * Near API JS Documentation: https://docs.near.org/docs/develop/front-end/near-api-js
 *
 */

/* eslint-disable */
/**
 * Johannes Baagøe's Alea PRNG:
 */
!function(n,t,e){function u(n){var t=this,e=function(){var s=4022871197;return function(n){n=String(n);for(var t=0;t<n.length;t++){var e=.02519603282416938*(s+=n.charCodeAt(t));e-=s=e>>>0,s=(e*=s)>>>0,s+=4294967296*(e-=s)}return 2.3283064365386963e-10*(s>>>0)}}();t.next=function(){var n=2091639*t.s0+2.3283064365386963e-10*t.c;return t.s0=t.s1,t.s1=t.s2,t.s2=n-(t.c=0|n)},t.c=1,t.s0=e(" "),t.s1=e(" "),t.s2=e(" "),t.s0-=e(n),t.s0<0&&(t.s0+=1),t.s1-=e(n),t.s1<0&&(t.s1+=1),t.s2-=e(n),t.s2<0&&(t.s2+=1),e=null}function o(n,t){return t.c=n.c,t.s0=n.s0,t.s1=n.s1,t.s2=n.s2,t}function s(n,t){var e=new u(n),s=t&&t.state,r=e.next;return r.int32=function(){return 4294967296*e.next()|0},r.double=function(){return r()+11102230246251565e-32*(2097152*r()|0)},r.quick=r,s&&("object"==typeof s&&o(s,e),r.state=function(){return o(e,{})}),r}t&&t.exports?t.exports=s:e&&e.amd?e(function(){return s}):window.alea=s}(0,"object"==typeof module&&module,"function"==typeof define&&define);
/* eslint-enable */

export function randomIntInclusive(min, max) { // min and max included
  return Math.floor((Math.random() * (max - min + 1)) + min)
}

export function randomIntFromTuple(arr) { // min and max included
  return Math.floor((Math.random() * (arr[1] - arr[0] + 1)) + arr[0])
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
  if (n > 500 && n < 511) {
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

let nearConfig
let near
let walletConnection
let accountId
let contract

function signInNear(wallet) {
  walletConnection.requestSignIn(nearConfig.contractName)
}

function signOutNear(wallet) {
  walletConnection.signOut()

  window.location.replace(window.location.origin + window.location.pathname)
}

async function configureNear() {
  nearConfig = {
    networkId: 'testnet',
    contractName: 'bwf-js13k-2021.testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  }

  // connect to NEAR
  near = await nearApi.connect(Object.assign({ deps: { keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  walletConnection = new nearApi.WalletConnection(near)

  accountId = walletConnection.getAccountId()

  contract = await new nearApi.Contract(window.walletConnection.accountId(), nearConfig.contractName, {
    viewMethods: [],
    changeMethods: ['nft_mint'],
  })

  console.log('NEAR Done:', near, wallet)
}

window.onload = () => {
  console.log(window.nearApi)

  const loginBtn = document.getElementById('login')
  const logoutBtn = document.getElementById('logout')
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = dims
  canvas.height = dims
  canvas.addEventListener('mousedown', function (e) {
    getCursorPosition(canvas, e)
  })
  loginBtn.addEventListener('click', signInNear)
  logoutBtn.addEventListener('click', signOutNear)

  colorCanvas(ctx)

  console.log('Complete', keyZones, Object.keys(gearZones).length, Object.keys(otherZones).length)

  configureNear()
}
