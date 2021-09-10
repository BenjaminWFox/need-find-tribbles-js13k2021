import fs from 'fs'
import Canvas from 'canvas'
import { fileNamesArr } from './tribble-filenames.js'
import { File } from 'nft.storage'

function rndIncl(min, max) { // min and max included
  return Math.floor((Math.random() * (max - min + 1)) + min);
}
const builtCombos = {};
const bodyDir = 'body';
const dirBase = '../../notfromterra-js13k2021/design/240';
const img = new Canvas.Image();
const canvas = Canvas.createCanvas(240, 240);
const ctx = canvas.getContext('2d');
const attrFiles = {
  eyes: fs.readdirSync(`${dirBase}/eyes`),
  face: fs.readdirSync(`${dirBase}/face`),
  feet: fs.readdirSync(`${dirBase}/feet`),
  hair: fs.readdirSync(`${dirBase}/hair`),
  mouth: fs.readdirSync(`${dirBase}/mouth`),
};
const base = `${dirBase}/${bodyDir}`;
const bodies = fs.readdirSync(base);

const getBody = () => {
  // Draw the outline:
  img.src = `${dirBase}/outline.png`;
  ctx.drawImage(img, 0, 0);

  const i = new Canvas.Image();
  const idx = rndIncl(0, bodies.length - 1);

  i.src = `${base}/${bodies[idx]}`;

  return { idx: idx, img: i};
};

const getAttr = (attr) => {
  const base = `${dirBase}/${attr}`;
  const attrFiles = fs.readdirSync(base);
  const fileIdx = rndIncl(0, attrFiles.length);

  return fileIdx
};

const getRandomTribble = async (tribbleId) => {
  const { idx, img } = getBody();
  ctx.drawImage(img, 0, 0);

  const attrIndexes = [];

  Object.entries(attrFiles).forEach(([k, v]) => {
    attrIndexes.push(getAttr(k))
  })

  /**
   * Eyes out for combo -7-8-5-8-7
   */
  const combo = `${idx}-${attrIndexes.join('-')}`

  console.log('Tribble', tribbleId, 'trying combo', combo)

  if (!builtCombos[combo]) {
    if (combo.indexOf('-7-8-5-8-7') !== -1) {
      console.warn('^^ Rare plain tribble!')
    }
  
    const promises = []

    builtCombos[combo] = tribbleId

    attrIndexes.forEach((index, i) => {
      const attrArrays = Object.entries(attrFiles)

      if (index <= attrArrays[i][1].length - 1) {
        promises.push(Canvas.loadImage(`${dirBase}/${attrArrays[i][0]}/${attrArrays[i][1][index]}`))
      }
    })

    return Promise.all(promises)
  }
  else {
    console.log('Tribble', tribbleId, 'combo failed, already seen', combo, 'on tribble', builtCombos[combo])

    return getRandomTribble(tribbleId)
  }
};

function dataURLtoFile(dataurl, filename) {

  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return { data: u8arr, file: new File([u8arr], filename, { type: mime }) }
}

async function start() {
  // let count = 0

  for (const str of fileNamesArr) {
    const filename = 'Tribble_R1_' + str + '.png'
    const layerImages = await getRandomTribble(str);

    layerImages.forEach(image => {
      ctx.drawImage(image, 0, 0)
    })
  
    const dataUrl = canvas.toDataURL();
    const {data, file} = dataURLtoFile(dataUrl, filename)

    fs.writeFile(`./out/${filename}`, data, () => {})

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // count += 1

    // if (count > 1000) break;
  }
}

start()
