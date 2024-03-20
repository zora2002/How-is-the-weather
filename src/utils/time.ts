import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'

import { SunResponseData } from '@/ts-common/api-response'

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export function timeToMinutes(time: dayjs.Dayjs) {
  if (!time) return 0
  return time.hour() * 60 + time.minute()
}

export function getTimePeriod(apiData: SunResponseData, dateTime: dayjs.Dayjs) {
  const todayInfo = apiData?.locations?.location[0].time.find((i) => i.Date === dateTime.format('YYYY-MM-DD'))
  const { BeginCivilTwilightTime, SunRiseTime, SunTransitTime, SunSetTime, EndCivilTwilightTime } = todayInfo

  const formatType = 'HH:mm'
  const timePeriods = [
    { name: 'midnight', begin: dayjs('00:00', formatType) },
    { name: 'dawn', begin: dayjs(BeginCivilTwilightTime, formatType).subtract(60, 'm') },
    { name: 'dayTwilight', begin: dayjs(BeginCivilTwilightTime, formatType) },
    { name: 'sunrise', begin: dayjs(SunRiseTime, formatType) },
    { name: 'morning', begin: dayjs(SunRiseTime, formatType).add(31, 'm') },
    { name: 'daytime', begin: dayjs(SunRiseTime, formatType).add(61, 'm') },
    { name: 'noon', begin: dayjs(SunTransitTime, formatType).subtract(30, 'm') },
    { name: 'afternoon', begin: dayjs(SunTransitTime, formatType).add(31, 'm') },
    { name: 'evening', begin: dayjs(SunSetTime, formatType).subtract(60, 'm') },
    { name: 'sunset', begin: dayjs(SunSetTime, formatType).subtract(30, 'm') },
    { name: 'nightTwilight', begin: dayjs(SunSetTime, formatType).add(1, 'm') },
    { name: 'dusk', begin: dayjs(EndCivilTwilightTime, formatType).add(1, 'm') },
    { name: 'night', begin: dayjs(EndCivilTwilightTime, formatType).add(61, 'm') },
    { name: 'midnight', begin: dayjs('23:00', formatType), end: dayjs('23:59', formatType) },
  ]

  const now = dayjs(dateTime, formatType)

  let period = timePeriods?.find((i, index, arr) => {
    const begin = i.begin
    const end = index === arr.length - 1 ? i.end : arr[index + 1].begin.subtract(1, 'm')
    return now.isBetween(begin, end, 'm', '[]')
  })

  return period.name
}

/**
 * isApi3hrFirstArrayHour 當前氣溫要選[0]還是[1](3小時間距)
 */
export function isApi3hrFirstArrayHour(nowHour: number, apiFirstHour: number) {
  if ((apiFirstHour === 21 && (nowHour === 0 || nowHour === 1 || nowHour === 2)) || nowHour > apiFirstHour + 2) {
    return false
  } else if ((apiFirstHour === 0 && (nowHour === 21 || nowHour === 22 || nowHour === 23)) || nowHour < apiFirstHour) {
    return true
  } else if (apiFirstHour <= nowHour || nowHour <= apiFirstHour + 2) {
    return true
  } else {
    console.log('isApi3hrFirstArrayHour捕捉到遺漏情境', nowHour, apiFirstHour)
  }
}

/**
 * isApi12hrFirstArrayHour 要選[0]還是[1](12小時間距)
 */
export function isApi12hrFirstArrayHour(apiFirstHour: number) {
  if (apiFirstHour === 6 || apiFirstHour === 12) {
    return true
  } else if (apiFirstHour === 0 || apiFirstHour === 18) {
    return false
  } else {
    console.log('isApi12hrFirstArrayHour捕捉到遺漏情境', apiFirstHour)
  }
}
