const initialState = {
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

initialState.gearContent.tribble.src = 'https://js13k-2021-tribbles-gear.s3.us-west-2.amazonaws.com/stuffed-tribble.png'

const state = state || {
  ...initialState,
}

export default state
