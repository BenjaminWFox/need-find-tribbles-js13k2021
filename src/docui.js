import C from './constants'
import state from './state'
export const $i = document.getElementById.bind(document)

// const tweens = []

// function Tween(el, to, from, time, prop, suf = '') {
//   el.style[prop] = from

//   this.dir = from - to > 0 ? -1 : 1
//   this.run = () => {
//     if ()
//   }
// }

// const loop = () => {

//   window.requestAnimationFrame(loop)
// }

// loop()

const getGearDetail = (gearStr) => {
  const [category, id] = gearStr.split('-')
  const friendly = id.split('_').join(' ')

  return { category, id, friendly }
}

export const setGearMessage = (gearStr, isNew) => {
  const { category, id, friendly } = getGearDetail(gearStr)

  $i('gearType').innerHTML = `You found ${friendly}. It's for the ${category}!`

  if (isNew) {
    $i('gearExtra').innerHTML = 'Something new and fun! Your stuffed tribble will love it!'
  }
  else {
    $i('gearExtra').innerHTML = 'You already have one of these. Oh well, maybe someone else will find it someday!'
  }
}

const getGearEls = (id, name, category) => {
  const li = document.createElement('li')
  const input = document.createElement('input')
  const label = document.createElement('label')

  input.type = 'radio'
  input.id = id
  input.onclick = function () {
    setGearImage(this.id, this.parentNode.parentNode.id)
  }
  input.name = category
  label.htmlFor = id
  label.innerHTML = name

  li.appendChild(input)
  li.appendChild(label)

  return li
}

export const setGearImage = (id, pId) => {
  console.log('setGearImage', id, pId)

  if (id === 'None') {
    state.gearContent.drawn[pId] = ''
    drawStuffedTribble()
  }
  else {
    const i = new Image()

    console.log('Setting for images...')

    i.crossOrigin = 'anonymous'
    i.src = getGearUrl(`${pId}-${id}`)
    console.log(i)
    state.gearContent.drawn[pId] = i
    i.addEventListener('load', drawStuffedTribble)
  }
}

export const drawStuffedTribble = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.id = 'stuffedTribbleCanvas'
  canvas.width = 240
  canvas.height = 240

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(state.gearContent.tribble, 0, 0)

  const gearImgKeys = Object.keys(state.gearContent.drawn)

  console.log('State', state, gearImgKeys)

  gearImgKeys.forEach((key) => {
    if (state.gearContent.drawn[key]) {
      console.log('Drawing for', key, state.gearContent.drawn[key])
      ctx.drawImage(state.gearContent.drawn[key], 0, 0)
    }
  })

  $i('display').innerHTML = ''
  $i('display').appendChild(canvas)
}

export const downloadStuffedTribble = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = 300
  canvas.height = 280

  ctx.drawImage(document.getElementById('stuffedTribbleCanvas'), 20, 20)
  const url = canvas.toDataURL('image/png')
  const w = window.open('')

  w.document.write('<title>Tribble!</title>')
  w.document.write(`<img src="${url}"/>`)
  w.document.close()
}

export const setAllGearEls = () => {
  Object.entries(C.GEAR).forEach(([k, v]) => {
    if (v && k !== 'stuffed-tribble') {
      const { category, id, friendly } = getGearDetail(k)

      if (!$i(id)) {
        const gearEl = getGearEls(id, friendly, category)

        $i(category).appendChild(gearEl)
      }
    }
  })
}

export const setClassById = (id, str) => {
  $i(id).className = str
}
export const modClassById = (doAdd, id, classStrOrArr) => {
  if (doAdd) {
    $i(id).classList.add(classStrOrArr)
  }
  else {
    if (typeof classStrOrArr !== 'string') {
      $i(id).classList.remove(...classStrOrArr)
      // classStrOrArr.forEach((str) => {
      //   $i(id).classList.remove(str)
      // })
    }
    else {
      $i(id).classList.remove(classStrOrArr)
    }
  }
}

export const setTab = (tabId) => {
  modClassById(false, 'sI', 'sel')
  modClassById(false, 'tabContent', 'sI')
  modClassById(false, 'tG', 'sel')
  modClassById(false, 'tabContent', 'tG')
  modClassById(true, tabId, 'sel')
  modClassById(true, 'tabContent', tabId)
  if (tabId === 'tG') {
    if (C.GEAR['stuffed-tribble']) {
      drawStuffedTribble()
    }
    $i('download').style.display = 'block'
  }
  if (tabId === 'sI') {
    setDisplay(state.searchContent.type, state.searchContent.displayImage)
    $i('download').style.display = 'none'
  }
}

/**
 *
 * @param {Enum} content clear | empty | other | gear | tribble | stuffed
 */
export const setDetails = (type, content) => {
  console.log('Update content', type, content)
  // modClassById(false, 'details', ['clear', 'empty', 'other', 'gear', 'tribble'])
  setClassById('details', type)
  setDisplay(type, content)
}

export const setDisplay = (type, content = '') => {
  const d = $i('display')

  console.debug('Setting display type', type, 'with content', content)

  switch (type) {
    default:
    case 'empty':
      state.searchContent.displayContent = '<div class="dText">Nothing here but empty space, for now...</div>'
      break
    case 'gear':
      // state.searchContent.displayContent = '<div class="dText">Remnants of tribbles line strewn about, but where have they gone...</div>'
      state.searchContent.displayContent = `<img src="${content}" />`
      state.searchContent.displayImage = content
      break
    case 'other':
      // eslint-disable-next-line
      const inner = `<img src="${content}" style="max-width: 260px; max-height: 260px;" />` || 'Something ancient and long forgotten hangs in the void...'

      state.searchContent.displayContent = `<div class="dText">${inner}</div>`
      state.searchContent.displayImage = content
      break
    case 'clear':
      state.searchContent.displayContent = '<div class="dClear dText"></div>'
      break
    case 'tribble':
      state.searchContent.displayContent = `<img src="${content}" />`
      state.searchContent.displayImage = content
      break
    case 'space':
      state.searchContent.displayContent = `<img src="${content}" style="max-width: 260px; max-height: 260px;" />`
      state.searchContent.displayImage = content
      break
    case 'stuffed':
      state.searchContent.displayContent = `<img src="${content}" />`
      state.searchContent.displayImage = content
      break
  }

  state.searchContent.type = type
  d.innerHTML = state.searchContent.displayContent
}

export const setSigninData = (account) => {
  $i('cAcct').innerHTML = `Account: ${account}`
  modClassById(true, 'b', 'authd')
  setOverlay(false)
}

export const getGearUrl = (gear) => {
  return `https://js13k-2021-tribbles-gear.s3.us-west-2.amazonaws.com/${gear}.png?x-req="testing"`
}

// export const setGearData = async (gear) => {
//   const gearImage = getGearUrl(gear)

//   $i('display').innerHTML = `<img src="${gearImage}" />`
// }

export const setTribbleData = async (data, tribbleImg) => {
  const md = data.metadata
  const ipfsMetaUrl = `http://ipfs.io/${ md.reference.replace('://', '/')}`
  // const ipfsMeta = await fetch(ipfsMetaUrl)
  // const ipfsImgUrl = ipfsMetaUrl.replace('metadata.json', `${data.token_id}.png`)
  const claimable = data.owner_id === 'need-find-tribbles-js13k.testnet'

  if (claimable) {
    $i('claim').disabled = false
    $i('ownership').innerHTML = 'currently unowned!'
  }
  else {
    $i('claim').disabled = true
    $i('ownership').innerHTML = `owned by ${data.owner_id}`
  }
  $i('tid').innerHTML = data.token_id
  $i('ipfsmeta').href = ipfsMetaUrl
  // $i('ipfsimg').href = ipfsImgUrl
  // $i('display').innerHTML = `<img src="${tribbleImg}" />`
}

export const setDataFetching = (isFetching) => {
  modClassById(isFetching, 'panel', 'fetching')
}

export const setOverlay = (isShown) => {
  !isShown ? setClassById('cvWrap', '') : modClassById(true, 'cvWrap', 'overlaid')
}

export const showAbout = () => {
  setClassById('cvWrap', 'showAbout overlaid')
  // setOverlay(true)
}

export const showFoundTribble = () => {
  setClassById('cvWrap', 'showFoundTribble overlaid')
  // setOverlay(true)
}

export const showBackTribbles = () => {
  setClassById('cvWrap', 'showBackTribbles overlaid')
  // setOverlay(true)
}
