import { APP_LOADING as APP_INITIALISING_ROUTE } from '../constants/routes'

export function requireAppInitialised (store) {
  return (nextState, replace) => {
    if (!store.getState().app.initialised) {
      replace({
        pathname: APP_INITIALISING_ROUTE,
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }
}
