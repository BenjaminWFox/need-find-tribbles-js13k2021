export const modClassById = (doAdd, id, classStrOrArr) => {
  if (doAdd) {
    document.getElementById(id).classList.add(classStrOrArr)
  }
  else {
    document.getElementById(id).classList.remove(classStrOrArr)
  }
}

export const setSigninData = (account) => {

}

export const setTribbleData = () => {

}
