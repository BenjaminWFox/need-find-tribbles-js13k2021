export function randomIntInclusive(min, max) { // min and max included
  return Math.floor((Math.random() * (max - min + 1)) + min)
}

export function randomIntFromTuple(arr) { // min and max included
  return Math.floor((Math.random() * (arr[1] - arr[0] + 1)) + arr[0])
}
