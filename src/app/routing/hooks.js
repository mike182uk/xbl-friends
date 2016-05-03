import { APP_LOADING as APP_LOADING_ROUTE } from '../constants/routes'

export function requireAppLoaded (store) {
  return (nextState, replace) => {
    if (!store.getState().app.loaded) {
      replace({
        pathname: APP_LOADING_ROUTE,
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }
}
