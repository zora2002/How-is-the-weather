import monthInEnglish from '../config/monthInEnglish'
import sun from '../doc/sun.json'
/**
 * standardToYMDhm 標準時間轉換
 * @param  {String} time
 * @param  {String} type
 */
export function changeStandardTime(time, type) {
  let YYYY = time.getFullYear() // 年
  let MM = time.getMonth() + 1 // 月
  MM = MM < 10 ? '0' + MM : MM
  let DD = time.getDate()
  DD = DD < 10 ? '0' + DD : DD
  let hh = time.getHours()
  hh = hh < 10 ? '0' + hh : hh
  let mm = time.getMinutes()
  mm = mm < 10 ? '0' + mm : mm
  let ss = time.getSeconds()
  ss = ss < 10 ? '0' + ss : ss
  let result = ''
  if (type === 'hh:mm') {
    result = `${hh}:${mm}`
  } else if (type === 'hh') {
    result = hh
  } else if (type === 'MM/DD hh:mm') {
    result = `${MM}/${DD} ${hh}:${mm}`
  } else if (type === 'MonthEnglish/DD hh:mm') {
    result = `${monthInEnglish[MM]} ${DD} ${hh}:${mm}`
  } else if (type === 'YYYY-MM-DD') {
    result = `${YYYY}-${MM}-${DD}`
  } else if (type === 'YYYY-MM-DD hh:mm:ss') {
    result = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
  } else {
    result = 'type參數錯誤'
  }
  return result
}

/**
 * minutesGap 同一天兩個時間的分鐘差(00:00~23:59)
 * @param  {String} time1 hh:mm
 * @param  {String} time2 hh:mm
 */
export function minutesGap(time1, time2) {
  let time1mm = splitTime(time1).hh
  let time1ss = splitTime(time1).mm
  let time2mm = splitTime(time2).hh
  let time2ss = splitTime(time2).mm
  return Math.abs(time1mm * 60 + time1ss - (time2mm * 60 + time2ss))
}

/**
 * splitTime 時間轉成整數分鐘和整數秒鐘(00:00~23:59)
 * @param  {String} time hh:mm
 */
export function splitTime(time) {
  const split = time.split(':')
  const hh = parseInt(split[0], 10)
  const mm = parseInt(split[1], 10)
  return { hh: hh, mm: mm }
}

// /**
//  * TimeAddOrSubtract10m 時間加減十分鐘(00:00~23:59)
//  * @param  {String} time hh:mm
//  * @param  {String} math add, sub
//  */
// export function TimeAddOrSubtract10m(time, math) {
//   console.log(time)
//   const hh = splitTime(time).hh * 60
//   const mm = splitTime(time).mm
//   time = hh + mm
//   let newTime = ''
//   if (math === 'add' || math === 'sub') {
//     newTime = time + (math === 'add' ? 10 : -10)
//   } else {
//     console.log('運算式錯誤')
//   }
//   return newTime
// }

/**
 * getTimePeriod 取得今日個時段列表
 * @param  {String} city 縣市
 */
export function getTimePeriod(city, time) {
  let sunriseList = sun.cwbopendata.dataset.locations.location
  const cityIndex = sunriseList.findIndex((i) => i.locationName === city)
  sunriseList = sunriseList[cityIndex].time
  const date = changeStandardTime(new Date(), 'YYYY-MM-DD')
  const dateIndex = sunriseList.findIndex((i) => i.dataTime === date)
  const data = sunriseList[dateIndex]
  const splitDayTwilight = {
    start: splitTime(data.parameter[0].parameterValue),
    end: splitTime(data.parameter[1].parameterValue),
  }
  const dayTwilight = {
    start: splitDayTwilight.start.hh * 60 + splitDayTwilight.start.mm,
    end: splitDayTwilight.end.hh * 60 + splitDayTwilight.end.mm,
  }
  const splitNightTwilight = {
    start: splitTime(data.parameter[5].parameterValue),
    end: splitTime(data.parameter[7].parameterValue),
  }
  const nightTwilight = {
    start: splitNightTwilight.start.hh * 60 + splitNightTwilight.start.mm,
    end: splitNightTwilight.end.hh * 60 + splitNightTwilight.end.mm,
  }

  time = splitTime(time).hh * 60 + splitTime(time).mm
  const timePeriodList = [
    [
      0,
      dayTwilight.start - 10,
      dayTwilight.start,
      dayTwilight.end + 1,
      dayTwilight.end + 11,
      9 * 60,
      12 * 60,
      13 * 60,
      16 * 60,
      nightTwilight.start - 10,
      nightTwilight.start,
      nightTwilight.end + 1,
      nightTwilight.end + 11,
      23 * 60,
      24 * 60,
    ],
    [
      'midnight',
      'dawn',
      'dayTwilight',
      'sunrise',
      'morning',
      'daytime',
      'noon',
      'afternoon',
      'evening',
      'sunset',
      'nightTwilight',
      'dusk',
      'night',
      'midnight',
    ],
  ]
  let timePeriodIndex = null
  for (let i = 0; i < timePeriodList[0].length - 1; i++) {
    if (timePeriodList[0][i] <= time && time < timePeriodList[0][i + 1]) {
      timePeriodIndex = i
    }
  }
  console.log(timePeriodList[1][timePeriodIndex])
  return timePeriodList[1][timePeriodIndex]
}
// 當前氣溫要選[0]還是[1]
export function isApiFirstArrayHour(apiFirstArrayHour) {
  const now = new Date()
  const hh = now.getHours()
  apiFirstArrayHour = new Date(apiFirstArrayHour).getHours()
  if (apiFirstArrayHour === 21 && (hh === 0 || hh === 1 || hh === 2)) {
    return false
  } else if (apiFirstArrayHour === 0 && (hh === 21 || hh === 22 || hh === 23)) {
    return true
  } else {
    return apiFirstArrayHour >= hh
  }
}
