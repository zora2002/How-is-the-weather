import axios from './setAxios'
import cityDistricts from './cityDistricts'
const weatheBaseURL = 'https://opendata.cwb.gov.tw/api'
/**
 * 一般天氣預報-今明 36 小時天氣預報
 * @param  {String} params 搜尋縣市或區域
 */
export function country36HoursForecast(params) {
  return axios.get('/v1/rest/datastore/F-C0032-001', { baseURL: weatheBaseURL, params: params })
}
/**
 * 鄉鎮天氣預報-縣市未來2天/1週天氣預報
 * @param  {String} params 搜尋縣市或區域
 * @param  {String} city 縣市
 * @param  {Number} day 2天或7天
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
  return axios.get('/v1/rest/datastore/F-D0047-' + code, { baseURL: weatheBaseURL, params: params })
}

/**
 * 座標轉行政區資料
 * @param  {String} longitude 經度
 * @param  {String} latitude 緯度
 */
export function wgs84ToCityDistrict(longitude, latitude) {
  // https://data.moi.gov.tw/MoiOD/Data/DataDetail.aspx?oid=CA6D10B1-C474-41DB-8B53-28E7E4E18977
  return axios.get(`https://api.nlsc.gov.tw/other/TownVillagePointQuery/${longitude}/${latitude}/4326`)
}

/**
 * 潮汐預報-未來 1 個月潮汐預報
 * @param  {String} locationName 地點 https://opendata.cwb.gov.tw/opendatadoc/MMC/A0021-001.pdf
 */
export function tidal1Month({ locationName }) {
  return axios.get('/v1/rest/datastore/F-A0021-001', { baseURL: weatheBaseURL, params: { locationName } })
}
