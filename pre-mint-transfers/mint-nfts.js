// Load the SDK for JavaScript
import LineByLineReader from 'line-by-line'
import { exec } from 'child_process'

const lr = new LineByLineReader('mint_calls.txt')

lr.on('error', function (err) {
  // 'err' contains error object
})

lr.on('line', function (line) {
  lr.pause()
  console.log(line)

  exec(line, (err, stdout, stderr) => {
    console.log(stdout)

    console.log(stderr)

    if (err !== null) {
      console.log(`exec error: ${err}`)
    }
  })

  setTimeout(() => {
    lr.resume()
  }, 2000)
  // 'line' contains the current line without the trailing newline character.
})

lr.on('end', function () {
  console.log('We are finished!!')
})
