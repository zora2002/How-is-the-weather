import { useEffect, createContext, ReactNode } from 'react'
import { useImmerReducer } from 'use-immer'
import dayjs from 'dayjs'

import type { AppState, AppActions, AppContextState } from '@/contexts/app-context.interface'

const appContextDefaultValue: AppState = {
  dateTime: dayjs(),
  location: {
    searchCity: '臺中市',
    searchDistrict: '西屯區',
  },
  dashboard: {
    backgroundColorOpacity: 85,
  },
}

const AppContext = createContext<AppContextState | undefined>(undefined)

function reducer(draft: AppState, action: AppActions) {
  switch (action.type) {
    case 'setDateTime':
      draft.dateTime = action.payload
      break
    case 'setLocation':
      draft.location.searchCity = action.payload.searchCity
      draft.location.searchDistrict = action.payload.searchDistrict
      localStorage.city = action.payload.searchCity
      localStorage.district = action.payload.searchDistrict
      break
    case 'setBackgroundColorOpacity':
      draft.dashboard.backgroundColorOpacity = action.payload
      break
  }
}

function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useImmerReducer<AppState, AppActions>(reducer, appContextDefaultValue)

  useEffect(() => {
    const getNowTime = setInterval(() => {
      dispatch({ type: 'setDateTime', payload: dayjs() })
    }, 60 * 1000)

    return () => {
      clearInterval(getNowTime)
    }
  }, [state.dateTime])

  const defaultState: AppContextState = {
    ...state,
    dispatch,
  }

  return <AppContext.Provider value={defaultState}> {children} </AppContext.Provider>
}

export { AppContextProvider, AppContext }
