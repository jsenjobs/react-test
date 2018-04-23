function reducer(state = new Date(), action) {
  switch(action.type) {
    case "TIME":
      return new Date()
    default:
      return new Date()
  }
}

export default reducer
