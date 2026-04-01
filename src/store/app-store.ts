import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import dayjs, { Dayjs } from 'dayjs'

interface AppState {
  dateTime: Dayjs
  location: {
    searchCity: string
    searchDistrict: string
  }
  dashboard: {
    backgroundColorOpacity: number
  }
}

interface AppActions {
  setDateTime: (dt: Dayjs) => void
  setLocation: (city: string, district: string) => void
  setBackgroundColorOpacity: (value: number) => void
  startDateTimeTick: () => () => void
}

export const useAppStore = create<AppState & AppActions>()(
  immer((set) => ({
    dateTime: dayjs(),
    location: {
      searchCity: localStorage.city || '臺中市',
      searchDistrict: localStorage.district || '西屯區',
    },
    dashboard: {
      backgroundColorOpacity: 85,
    },
    setDateTime: (dt) =>
      set((s) => {
        s.dateTime = dt
      }),
    setLocation: (city, district) =>
      set((s) => {
        s.location.searchCity = city
        s.location.searchDistrict = district
        localStorage.city = city
        localStorage.district = district
      }),
    setBackgroundColorOpacity: (value) =>
      set((s) => {
        s.dashboard.backgroundColorOpacity = value
      }),
    startDateTimeTick: () => {
      const id = setInterval(() => {
        useAppStore.getState().setDateTime(dayjs())
      }, 60 * 1000)
      return () => clearInterval(id)
    },
  }))
)
