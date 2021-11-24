import { createStore } from 'redux'

const initialState = {
  location: {
    searchCity: localStorage.city || '臺中市',
    searchDistrict: localStorage.district || '西屯區',
  },
  dashboard: {
    backgroundColorOpacity: 85,
  },
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_LOCATION':
      console.log(action)
      return {
        ...state,
        location: (state.location = {
          searchCity: action.data.searchCity,
          searchDistrict: action.data.searchDistrict,
        }),
      }
    case 'UPDATE_DASHBOARD':
      return {
        ...state,
        dashboard: (state.dashboard = {
          backgroundColorOpacity: action.data.backgroundColorOpacity,
        }),
      }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
