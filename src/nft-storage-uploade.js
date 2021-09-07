import { NFTStorage } from 'nft.storage'

const type = 'image/png'
const ext = 'png'
let uploadBtn
let submitBtn

function dataURLtoFile(dataurl, filename) {

  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

async function sendUploadedImageToNFTStorage(name, description, filename) {
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE3RTBEMTBCMEU0MmI5NmJhOTY5MDcwZUZFNDVBZkY0MDkzMDY5ODciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDc5Mzk4MTEwMiwibmFtZSI6ImJmLWpzMTNrLTIwMjEtYXBpa2V5In0.XhmhgIFuobjinEiRnb8ZtEEWvNu9SJEVjQ2J6I6tAZ8'
  const client = new NFTStorage({ token: apiKey })
  const imgEl = document.createElement('img')
  // Used for converting a dataUrl (like from a canvas) to bytes:
  //   const img = dataURLtoFile(data, filename)

  //   console.log('Generated:', img)
  console.log('Uploaded:', uploadBtn.files[0])

  imgEl.src = data

  document.body.appendChild(imgEl)

  const metadata = await client.store({
    name,
    description,
    image: uploadBtn.files[0],
  })

  // uploadFileToBlob(uploadBtn.files[0])
  // uploadFileToBlob(img)

  console.log(metadata.url)
}

window.onload = () => {
  console.log()
  uploadBtn = document.getElementById('upload')
  submitBtn = document.getElementById('submit')
  submitBtn.addEventListener('click', () => {
    // test(`Ghost${iter}`, 'A random pixel art!', `ghost${iter}.${ext}`, sprite.canvas.toDataURL(type, 1.0))
    sendUploadedImageToNFTStorage('BWFox', 'A generally happy, quirky fox!', `bwfox.${ext}`)
  })
}

/**
 * BWFox:
 * ipfs://bafyreigsmveupbm2xwjv7hcs7topse722hhqvcasa2adpuilskj3i6gpvq/metadata.json
 *
 * near call $ID nft_mint '{"token_id": "0", "token_owner_id": "'$ID'", "token_metadata": { "title": "BWFox", "description": "ipfs://bafyreigsmveupbm2xwjv7hcs7topse722hhqvcasa2adpuilskj3i6gpvq/metadata.json", media: "ipfs://bafyreigsmveupbm2xwjv7hcs7topse722hhqvcasa2adpuilskj3i6gpvq/metadata.json", "copies": 1}}' --accountId $ID --deposit 1
 *
 * near call $ID nft_mint '{"token_id": "0", "token_owner_id": "'$ID'", "token_metadata": { "title": "BWFox", "description": "ipfs://bafyreigsmveupbm2xwjv7hcs7topse722hhqvcasa2adpuilskj3i6gpvq/metadata.json", "copies": 1}}' --accountId $ID --deposit 1
 */
