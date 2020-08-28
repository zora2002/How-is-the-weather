import { createStore } from 'redux'

const initialState = {
  location: { searchCity: localStorage.city || '臺中市', searchDistrict: localStorage.district || '西屯區' },
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_LOCATION':
      console.log(action)
      return {
        location: (state.location = { searchCity: action.data.searchCity, searchDistrict: action.data.searchDistrict }),
      }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
