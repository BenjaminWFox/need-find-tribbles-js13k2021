// Load the SDK for JavaScript
import LineByLineReader from 'line-by-line'
import fs from 'fs'
import { exec } from 'child_process'

const lr = new LineByLineReader('mint_calls_1631123304633.txt')
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
  })

  setTimeout(() => {
    lr.resume()
  }, 2000)
  // 'line' contains the current line without the trailing newline character.
})

lr.on('end', function () {
  console.log('We are finished!!')

  console.log(retryCallsArr)

  const d = new Uint8Array(Buffer.from(retryCallsArr.join('\r\n')))

  fs.writeFile(`mint_calls_retry_${Date.now()}.txt`, d, () => {
    console.log('Done!')
  })
})
