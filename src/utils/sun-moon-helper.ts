import dayjs from 'dayjs'

import type { SunResponseData, MoonResponseData } from '@/ts-common/api-response'
import { timeToMinutes } from '@/utils/time'

interface RiceSet {
  date: string
  rice: dayjs.Dayjs
  set: dayjs.Dayjs
}

type RiceSetInfo = Record<'yesterday' | 'today' | 'tomorrow', RiceSet>
export type Info = Record<'sun' | 'moon', RiceSetInfo>

export const CENTER = { X: 250, Y: 250 }
export const SUN_R = 200
export const MOON_R = 100
const MOON_OFFSET = { X: 35, Y: 28 }

enum MooveType {
  RiceEarly = 'A',
  OnlyRice = 'B',
  SetEarly = 'C',
  OnlySet = 'D',
}

enum ZoneType {
  AfterTodayBeforSet = 'a',
  AfterRiceBeforeToday = 'b',
  AfterSetBeforeToday = 'c',
  AfterTodayBeforeRice = 'd',
  AfetrRiceBeforeSet = 'ab',
  AfetrSetBeforeRice = 'cd',
}

const sunInfoHandler = (date: string, apiSunData: SunResponseData): RiceSet => {
  const info = apiSunData?.locations?.location[0].time
  const riceTime = info?.find((i) => i.Date === date).SunRiseTime
  const setTime = info?.find((i) => i.Date === date).SunSetTime
  return {
    date,
    rice: dayjs(`${date} ${riceTime}`),
    set: dayjs(`${date} ${setTime}`),
  }
}

const moonInfoHandler = (date: string, apiMoonData: MoonResponseData): RiceSet => {
  const info = apiMoonData?.locations?.location[0].time
  const riceTime = info.find((i) => i.Date === date).MoonRiseTime
  const setTime = info.find((i) => i.Date === date).MoonSetTime
  return {
    date,
    rice: dayjs(`${date} ${riceTime}`),
    set: dayjs(`${date} ${setTime}`),
  }
}

export const infoHandler = (
  dateTime: dayjs.Dayjs,
  apiSunData: SunResponseData,
  apiMoonData: MoonResponseData
): Info => {
  const yesterday = dateTime.subtract(1, 'day').format('YYYY-MM-DD')
  const today = dateTime.format('YYYY-MM-DD')
  const tomorrow = dateTime.add(1, 'day').format('YYYY-MM-DD')

  const info: Info = {
    sun: {
      yesterday: sunInfoHandler(yesterday, apiSunData),
      today: sunInfoHandler(today, apiSunData),
      tomorrow: sunInfoHandler(tomorrow, apiSunData),
    },
    moon: {
      yesterday: moonInfoHandler(yesterday, apiMoonData),
      today: moonInfoHandler(today, apiMoonData),
      tomorrow: moonInfoHandler(tomorrow, apiMoonData),
    },
  }

  return info
}

const mooveTypeHandler = (today: RiceSetInfo['today']): MooveType => {
  const { rice, set } = today
  if (rice && set) return timeToMinutes(set) > timeToMinutes(rice) ? MooveType.RiceEarly : MooveType.SetEarly
  if (!rice && set) return MooveType.OnlySet
  if (rice && !set) return MooveType.OnlyRice
  console.error('Something is wrong in "mooveTypeHandler"...')
}

const zoneTypeHandler = (mooveType: MooveType, dateTime: dayjs.Dayjs, today: RiceSetInfo['today']): ZoneType => {
  const { set, rice } = today

  switch (mooveType) {
    case MooveType.RiceEarly:
      if (dateTime.isBefore(rice)) return ZoneType.AfterTodayBeforSet
      if (dateTime.isBetween(rice, set, null, '()')) return ZoneType.AfetrRiceBeforeSet
      if (dateTime.isAfter(set)) return ZoneType.AfterSetBeforeToday
      break
    case MooveType.OnlyRice:
      if (dateTime.isBefore(rice)) return ZoneType.AfterTodayBeforeRice
      if (dateTime.isAfter(rice)) return ZoneType.AfterRiceBeforeToday
      break
    case MooveType.SetEarly:
      if (dateTime.isBefore(set)) return ZoneType.AfterTodayBeforSet
      if (dateTime.isBetween(set, rice, null, '()')) return ZoneType.AfetrSetBeforeRice
      if (dateTime.isAfter(rice)) return ZoneType.AfterRiceBeforeToday
      break
    case MooveType.OnlySet:
      if (dateTime.isBefore(rice)) return ZoneType.AfterTodayBeforSet
      if (dateTime.isAfter(set)) return ZoneType.AfterSetBeforeToday
      break
    default:
      break
  }

  console.error('Something is wrong in "zoneTypeHandler"...')
}

const nowAngle = (totalTime: number, nowTime: number) => {
  return (180 * nowTime) / totalTime
}

const angleHandler = (zoneType: ZoneType, dateTime: dayjs.Dayjs, riceSetInfo: RiceSetInfo): number => {
  const { yesterday, today, tomorrow } = riceSetInfo

  const nowInMinutes = timeToMinutes(dateTime)

  const todayRiceInMinutes = timeToMinutes(today.rice)
  const todaySetInMinutes = timeToMinutes(today.set)

  if (dateTime === today.rice) return 0
  if (dateTime === today.set) return 180

  switch (zoneType) {
    case ZoneType.AfterTodayBeforSet:
      const diffYesterdayRice = dayjs(today.date).diff(yesterday.rice, 'm')
      return nowAngle(diffYesterdayRice + todaySetInMinutes, diffYesterdayRice + nowInMinutes)
    case ZoneType.AfterRiceBeforeToday:
      return nowAngle(
        dayjs(tomorrow.date).diff(today.rice, 'm') + timeToMinutes(tomorrow.set),
        nowInMinutes - todayRiceInMinutes
      )
    case ZoneType.AfterSetBeforeToday:
      return (
        180 +
        nowAngle(
          dayjs(tomorrow.date).diff(today.set, 'm') + timeToMinutes(tomorrow.rice),
          nowInMinutes - todaySetInMinutes
        )
      )
    case ZoneType.AfterTodayBeforeRice:
      const diffYesterdaySet = dayjs(today.date).diff(yesterday.set, 'm')
      return 180 + nowAngle(diffYesterdaySet + todayRiceInMinutes, diffYesterdaySet + nowInMinutes)
    case ZoneType.AfetrRiceBeforeSet:
      return nowAngle(todaySetInMinutes - todayRiceInMinutes, nowInMinutes - todayRiceInMinutes)
    case ZoneType.AfetrSetBeforeRice:
      return 180 + nowAngle(todayRiceInMinutes - todaySetInMinutes, nowInMinutes - todaySetInMinutes)
    default:
      console.log('Something is wrong in "angleHandler"...')
      break
  }
}

const XYHandler = (dateTime: dayjs.Dayjs, riceSetInfo: RiceSetInfo) => {
  const { today } = riceSetInfo

  const mooveType = mooveTypeHandler(today)
  const zoneType = zoneTypeHandler(mooveType, dateTime, today)
  const angle = angleHandler(zoneType, dateTime, riceSetInfo)
  const angleChangeSvgRule = -angle
  const radians = angleChangeSvgRule * (Math.PI / 180)
  return { x: Math.cos(radians), y: Math.sin(radians) }
}

export const translateHandler = (dateTime: dayjs.Dayjs, info: Info) => {
  const sun = XYHandler(dateTime, info.sun)
  const sunTrans = {
    x: CENTER.X + sun.x * SUN_R,
    y: CENTER.Y + sun.y * SUN_R,
  }
  const moon = XYHandler(dateTime, info.moon)
  const moonTrans = {
    x: CENTER.X - MOON_OFFSET.X + moon.x * MOON_R,
    y: CENTER.Y - MOON_OFFSET.Y + moon.y * MOON_R,
  }
  return { info, sunTrans, moonTrans }
}
