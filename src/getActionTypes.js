export default actionType => {
  const REQUEST = `${actionType}__REQUEST`
  const SUCCESS = `${actionType}__SUCCESS`
  const FAILURE = `${actionType}__FAILURE`

  return {
    R: REQUEST,
    S: SUCCESS,
    F: FAILURE,
    REQUEST,
    SUCCESS,
    FAILURE,
  }
}
