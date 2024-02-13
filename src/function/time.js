import dayjs from 'dayjs'

/**
 * minutesGap 同一天兩個時間的分鐘差(00:00~23:59)
 * @param  {String} time1 hh:mm
 * @param  {String} time2 hh:mm
 */
export function minutesGap(time1, time2) {
  let time1hh = splitTime(time1).hh
  let time1mm = splitTime(time1).mm
  let time2hh = splitTime(time2).hh
  let time2mm = splitTime(time2).mm
  return Math.abs(time1hh * 60 + time1mm - (time2hh * 60 + time2mm))
}

/**
 * timeToMinutes 時間轉成分鐘數
 * @param  {String} time1 hh:mm
 */
export function timeToMinutes(time) {
  if (time) {
    let timehh = splitTime(time).hh
    let timemm = splitTime(time).mm
    return timehh * 60 + timemm
  } else {
    return `時間格式錯誤: ${time}`
  }
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
 * getSunMoonData 取得某天的日月出沒時間
 * @param  {} apiData
 * @param  {String} date YYYY-MM-DD
 */
export function getSunMoonData(apiData, date) {
  let list = apiData.data.records.locations.location[0].time
  const dateIndex = list.findIndex((i) => i.Date === date)
  const data = list[dateIndex]
  return data
}

/**
 * getTimePeriod 取得今日個時段列表
 * @param  {} apiData
 * @param  {String} time 現在幾點幾分hh:mm
 */
export function getTimePeriod(apiData, time) {
  const data = getSunMoonData(apiData, dayjs().format('YYYY-MM-DD'))
  const splitDayTwilight = {
    start: splitTime(data.BeginCivilTwilightTime),
    end: splitTime(data.SunRiseTime),
  }
  const dayTwilight = {
    start: splitDayTwilight.start.hh * 60 + splitDayTwilight.start.mm,
    end: splitDayTwilight.end.hh * 60 + splitDayTwilight.end.mm,
  }
  const splitNightTwilight = {
    start: splitTime(data.SunSetTime),
    end: splitTime(data.EndCivilTwilightTime),
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

/**
 * isApi3hrFirstArrayHour 當前氣溫要選[0]還是[1](3小時間距)
 * @param  {String} api3hrFirstArrayHour YYYY-MM-DD hh:mm:ss
 */
export function isApi3hrFirstArrayHour(apiFirstArrayHour) {
  const now = new Date()
  const nowHour = now.getHours()
  apiFirstArrayHour = new Date(apiFirstArrayHour).getHours()
  if (
    (apiFirstArrayHour === 21 && (nowHour === 0 || nowHour === 1 || nowHour === 2)) ||
    nowHour > apiFirstArrayHour + 2
  ) {
    return false
  } else if (
    (apiFirstArrayHour === 0 && (nowHour === 21 || nowHour === 22 || nowHour === 23)) ||
    nowHour < apiFirstArrayHour
  ) {
    return true
  } else if (apiFirstArrayHour <= nowHour || nowHour <= apiFirstArrayHour + 2) {
    return true
  } else {
    console.log('isApi3hrFirstArrayHour', `apiFirstArrayHour: ${apiFirstArrayHour}`, `nowHour: ${nowHour}`)
  }
}

/**
 * isApi12hrFirstArrayHour 要選[0]還是[1](12小時間距)
 * @param  {String} api3hrFirstArrayHour YYYY-MM-DD hh:mm:ss
 */
export function isApi12hrFirstArrayHour(array1) {
  const array1Hour = new Date(array1.startTime).getHours()
  if (array1Hour === 6 || array1Hour === 12) {
    return true
  } else if (array1Hour === 0 || array1Hour === 18) {
    return false
  } else {
    console.log('isApi12hrFirstArrayHour捕捉到遺漏情境', `array1: ${array1}`, `array1Hour: ${array1Hour}`)
  }
}

export function removeArrayFirstItem(arrayList) {
  return arrayList.slice(1, arrayList.length)
}
