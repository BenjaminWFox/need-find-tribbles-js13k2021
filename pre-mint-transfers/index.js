// Load the SDK for JavaScript
import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'
import { argv } from 'process'
import { NFTStorage, File } from 'nft.storage'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'

const result = dotenv.config()

if (result.error) {
  throw result.error
}

process.env = result.parsed
const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })

// Set the Region
AWS.config.update({ region: 'us-west-2' })
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

// CONSTANTS
const DESC = 'Need to Find the Tribbles - NFT Search - js13k 2021 Decentralized Category'
const NEAR_ID = process.env.TOKEN_OWNER
const [nodePath, indexPath, filesPath] = argv

let pending = 0
const execCallsArray = []

const buildNftCallObject = (nftData) => {
  const nftCall = {
    token_id: '',
    token_owner_id: NEAR_ID,
    token_metadata: {
      title: '',
      description: DESC,
      media: '',
      media_hash: '',
      copies: 1,
      issued_at: '',
      expires_at: '',
      starts_at: '',
      updated_at: '',
      extra: '',
      reference: '',
      reference_hash: '',
    },
  }

  nftCall.token_id = nftData.filename
  nftCall.token_metadata.title = nftData.title
  nftCall.token_metadata.media = nftData.previewUrl
  nftCall.token_metadata.issued_at = new Date().toUTCString()
  nftCall.token_metadata.reference = nftData.metadataUrl

  const execCall = `near call ${NEAR_ID} nft_mint '${JSON.stringify(nftCall)}' --accountId ${NEAR_ID} --deposit .01`

  execCallsArray.push(execCall)
  pending -= 1

  if (pending === 0) {
    pending = null
    const d = new Uint8Array(Buffer.from(execCallsArray.join('\r\n')))

    fs.writeFile(`mint_calls_${Date.now()}.txt`, d, () => {
      console.log('Done!')
    })
  }

  // exec(execCall, (err, stdout, stderr) => {
  //   console.log(stdout)

  //   console.log(stderr)

  //   if (err !== null) {
  //     console.log(`exec error: ${err}`)
  //   }
  // })
}

const nftstorageUpload = async (file, nftData) => {
  const metadata = await client.store({
    name: nftData.title,
    description: DESC,
    image: file,
  })

  console.log('NFT.storage Upload Success!')
  console.log(metadata)

  nftData.metadataUrl = metadata.url

  buildNftCallObject(nftData)
}

const awsUpload = (filepath) => {
  const uploadParams = { Bucket: process.env.AWS_BUCKET, Key: '', Body: '', ContentType: 'image/png' }
  const fileStream = fs.createReadStream(filepath)
  let fileObject

  uploadParams.Body = fileStream
  uploadParams.Key = path.basename(filepath)

  fileStream.on('data', (chunk) => {
    fileObject = new File([chunk], uploadParams.Key, { type: 'image/png' })
  })

  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.log(err)

      pending -= 1
    }
    else {
      console.log('AWS Upload Success! Moving to NFT.storage ...')
      const { Location, Key } = data

      console.log(data)

      // Data objects
      const nftData = {
        title: Key.replace('.png', ''),
        previewUrl: Location,
        metadataUrl: '',
        filename: Key.replace('.png', ''),
      }

      nftstorageUpload(fileObject, nftData)
    }
  })
}

const processFiles = async () => {
  let filesArr

  try {
    filesArr = fs.readdirSync(filesPath)
  }
  catch (e) {
    console.error('There was a problem finding the files to process.')
  }

  // for (let i = 0; i < filesArr.length; i++) {
  for (let i = 2; i < 20; i++) {
    const file = filesArr[i]

    if (file.indexOf('.png') !== -1) {
      console.log('Run upload for', file)
      pending += 1

      awsUpload(`${filesPath}/${file}`)
    }
    else {
      console.log('Skipping', file)
    }
  }

}

processFiles()
