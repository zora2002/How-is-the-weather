import dayjs from 'dayjs'

export interface Location {
  searchCity: string,
  searchDistrict: string,
}

export interface AppState {
  dateTime: dayjs.Dayjs
  location: Location,
  dashboard: {
    backgroundColorOpacity: number,
  },
}

export type AppActions =
  | { type: 'setDateTime'; payload: dayjs.Dayjs }
  | { type: 'setLocation'; payload: { searchCity: string, searchDistrict: string } }
  | { type: 'setBackgroundColorOpacity'; payload: number }



export interface AppContextState extends AppState {
  dispatch: React.Dispatch<AppActions>
}
