export default class ReduxApi {
  apiClient = null
  reqBaseConfig = {}

  constructor(reqBaseConfig) {
    this.reqBaseConfig = { ...reqBaseConfig }
  }

  middleware = ({ dispatch, getState }) => next => action => {
    const { request, type, ...reset } = action
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    if (typeof request !== 'function') {
      return next(action)
    }

    const apiClient = this.getApiClient()
    // eslint-disable-next-line
    const $ = require('./getActionTypes').default
    dispatch({
      ...reset,
      type: $(type).R,
    })

    return action
      .request(apiClient)
      .then(response => {
        if (response.ok) {
          return next({
            type: $(type).S,
            ...reset,
            response: response.clone(),
          })
        }

        throw new Error('Server response wasn\'t OK')
      })
      .catch(error =>
        next({
          type: $(type).F,
          ...reset,
          data: error,
        }))
  }

  getApiClient = () => {
    if (this.apiClient) {
      return this.apiClient
    }
    // eslint-disable-next-line
    const ApiClient = require('./apiClient').default
    this.apiClient = new ApiClient(this.reqBaseConfig)

    return this.apiClient
  }
}
