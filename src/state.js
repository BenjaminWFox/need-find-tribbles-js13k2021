const initialState = {
  clickCheckInProgress: false,
  searchContent: {
    displayContent: 'Nothing here but empty space, for now...',
    displayImage: '',
  },
  gearContent: {
    tribble: new Image(),
    drawn: {
      hair: '',
      eyes: '',
      face: '',
      mouth: '',
      feet: '',
    },
  },
}

initialState.gearContent.tribble.crossOrigin = 'anonymous'
initialState.gearContent.tribble.src = 'https://js13k-2021-tribbles-gear.s3.us-west-2.amazonaws.com/stuffed-tribble.png?x-req="testing'

const state = state || {
  ...initialState,
}

export default state
