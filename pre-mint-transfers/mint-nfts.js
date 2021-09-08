// Load the SDK for JavaScript
import LineByLineReader from 'line-by-line'
import fs from 'fs'
import { exec } from 'child_process'

/**
 * Run with node ./mint-nfts.js
 */
// In progress: mint_calls_1631124576652-7-8k.txt
// In progress: mint_calls_1631124613529-8-9k.txt
// In progress: mint_calls_1631124642952-9-End.txt
const lr = new LineByLineReader('mint_calls_1631124642952-9-End.txt')
const retryCallsArr = []
let lineNum = 0

lr.on('error', function (err) {
  // 'err' contains error object
})

lr.on('line', function (line) {
  lr.pause()
  const _line = lineNum

  lineNum += 1
  console.log('-- CALLING for', _line)
  console.log(line)

  exec(line, (err, stdout, stderr) => {

    console.log('-- STDOUT for', _line)
    console.log(stdout)

    console.log('-- STDERR for', _line)
    console.log(stderr)

    if (err !== null) {
      retryCallsArr.push(line)

      console.log('-- EXEC ERROR for', _line)
      console.log(`${err}`)
    }

    lr.resume()
  })
  // 'line' contains the current line without the trailing newline character.
})

lr.on('end', function () {
  console.log('We are finished!!')

  console.log(retryCallsArr)

  if (retryCallsArr.length) {
    const d = new Uint8Array(Buffer.from(retryCallsArr.join('\r\n')))

    fs.writeFile(`mint_calls_retry_${Date.now()}.txt`, d, () => {
      console.log('Done!')
    })
  }
  else {
    console.log('No errors! Huzzah!')
  }
})
