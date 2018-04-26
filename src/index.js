export default class ReduxApiMiddleware {
  constructor({ actionPrefix, ...reset }) {
    this.actionPrefix = actionPrefix
    this.reqBaseConfig = { ...reset }
  }

  reqBaseConfig = {}
  actionPrefix = null

  middleware = ({ dispatch, getState }) => next => (action) => {
    const { request, type, ...reset } = action
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    if (typeof request !== 'function') {
      return next(action)
    }

    const { apiClient, $ } = this.getApiClient()
    dispatch({
      ...reset,
      type: $(type).R,
    })

    return action
      .request(apiClient)
      .then((response) => {
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

  apiClient = null
  $ = null
  getApiClient = () => {
    const { apiClient, $ } = this
    if (apiClient && $) {
      return {
        apiClient,
        $,
      }
    }
    // eslint-disable-next-line
    const ApiClient = require('./apiClient').default
    this.$ = ApiClient.requestTypes(this.actionPrefix)
    this.apiClient = new ApiClient(this.reqBaseConfig)

    return {
      apiClient: this.apiClient,
      $: this.$,
    }
  }
}
