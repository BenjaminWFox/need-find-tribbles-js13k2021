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

export const modClassById = (doAdd, id, classStrOrArr) => {
  if (doAdd) {
    $i(id).classList.add(classStrOrArr)
  }
  else {
    if (typeof classStrOrArr !== 'string') {
      classStrOrArr.forEach((str) => {
        $i(id).classList.remove(str)
      })
    }
    else {
      $i(id).classList.remove(classStrOrArr)
    }
  }
}

/**
 *
 * @param {Enum} content clear | empty | other | gear | tribble
 */
export const setDetails = (content) => {
  console.log('Update content', content)
  modClassById(false, 'details', ['clear', 'empty', 'other', 'gear', 'tribble'])
  modClassById(true, 'details', content)
  setDisplay(content)
}

export const setDisplay = (content) => {
  const d = $i('display')

  switch (content) {
    default:
    case 'empty':
      d.innerHTML = '<div class="dText">Nothing here but empty space, for now...</div>'
      break
    case 'gear':
      d.innerHTML = '<div class="dText">Remnants of tribbles line strewn about, but where have they gone...</div>'
      break
    case 'other':
      d.innerHTML = '<div class="dText">Something ancient and long forgotten hangs in the void...</div>'
      break
    case 'clear':
      d.innerHTML = '<div class="dClear dText"></div>'
      break
  }
}

export const setSigninData = (account) => {
  $i('cAcct').innerHTML = `Account: ${account}`
  modClassById(true, 'b', 'authd')
  setOverlay(false)
}

export const setGearData = async (gear) => {
  const gearImage = `https://js13k-2021-tribbles-gear.s3.us-west-2.amazonaws.com/${gear}.png`

  $i('display').innerHTML = `<img src="${gearImage}" />`
}

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
  $i('display').innerHTML = `<img src="${tribbleImg}" />`
}

export const setDataFetching = (isFetching) => {
  modClassById(isFetching, 'panel', 'fetching')
}

export const setOverlay = (isShown) => {
  modClassById(isShown, 'cvWrap', 'overlaid')
}
