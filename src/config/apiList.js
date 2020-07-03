import axios from './setAxios'
import cityDistricts from './cityDistricts'

/**
 * 一般天氣預報-今明 36 小時天氣預報
 */
export function country36HoursForecast(params) {
  return axios.get('/v1/rest/datastore/F-C0032-001', { params: params })
}
/**
 * 鄉鎮天氣預報-縣市未來2天/1週天氣預報
 */
export function city2Day1WeekForecast(params, city, day) {
  let code = ''
  const index = cityDistricts.cities.findIndex((element) => element === city)
  if (index !== -1) {
    let number = 4 * index + (day === 2 ? 1 : 3)
    code = number < 10 ? '00' + number : '0' + number
  } else {
    console.log('查無此縣市： ' + city)
  }
  return axios.get('/v1/rest/datastore/F-D0047-' + code, { params: params })
}
