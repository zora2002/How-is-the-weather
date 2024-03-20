import dayjs from 'dayjs'

import { getApiCode } from '@/utils/helper'
import type {
  RunApiType,
  RunJsonApiType,
  Weather36HourEvery12HourData,
  Weather3DayEvery3HourData,
  Weather7DayEvery12HourData,
  SunData,
  MoonData,
  Tidal1MonthData,
} from '@/ts-common/api-function'
import type {
  Weather36HourEvery12HourResponseData,
  Weather3DayEvery3HourResponseData,
  Weather7DayEvery12HourResponseData,
  SunResponseData,
  MoonResponseData,
  Tidal1MonthResponseData,
} from '@/ts-common/api-response'
import type {
  Weather36HourEvery12HourRequestData,
  Weather3DayEvery3HourRequestData,
  Weather7DayEvery12HourRequestData,
  SunRequestData,
  MoonRequestData,
  Tidal1MonthRequestData,
} from '@/ts-common/api-request'
import { getInstance } from '@/utils/api-setting'

export const runApi: RunApiType = async ({ method, url, data, baseURL = import.meta.env.VITE_API_BASE_URL }) => {
  const instance = getInstance(window.location.pathname)

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      console.log(error)
      return Promise.reject(error)
    }
  )

  const axiosConfig = {
    method,
    baseURL,
    url,
    data,
    params: data,
  }
  if (method.toUpperCase() === 'GET') {
    delete axiosConfig.data
  }

  return instance({ ...axiosConfig }).then((res) => {
    return res.data
  })
}

export const runJsonApi: RunJsonApiType = async (url) => {
  const instance = getInstance(window.location.pathname)

  const axiosConfig = {
    method: 'GET',
    url,
  }

  return instance({ ...axiosConfig }).then((res) => res.data)
}

export const weather36HourEvery12HourData: Weather36HourEvery12HourData = async ({ location }) => {
  try {
    const res = await runApi<Weather36HourEvery12HourResponseData, Weather36HourEvery12HourRequestData>({
      method: 'POST',
      url: '/weather',
      data: {
        url: 'F-C0032-001',
        location: location.searchCity,
      },
    })
    return res?.records
  } catch (error) {
    console.log(error)
  }
}

export const weather3DayEvery3HourData: Weather3DayEvery3HourData = async ({ location }) => {
  try {
    const url = 'F-D0047-' + getApiCode(location.searchCity, 3)
    const res = await runApi<Weather3DayEvery3HourResponseData, Weather3DayEvery3HourRequestData>({
      method: 'POST',
      url: '/weather',
      data: {
        url,
        location: location.searchDistrict,
      },
    })
    return res?.records
  } catch (error) {
    console.log(error)
  }
}

export const weather7DayEvery12HourData: Weather7DayEvery12HourData = async ({ location }) => {
  try {
    const url = 'F-D0047-' + getApiCode(location.searchCity, 7)
    const res = await runApi<Weather7DayEvery12HourResponseData, Weather7DayEvery12HourRequestData>({
      method: 'POST',
      url: '/weather',
      data: {
        url,
        location: location.searchDistrict,
      },
    })
    return res?.records
  } catch (error) {
    console.log(error)
  }
}

export const sunData: SunData = async ({ location }) => {
  try {
    const res = await runApi<SunResponseData, SunRequestData>({
      method: 'POST',
      url: '/weather',
      data: {
        url: 'A-B0062-001',
        location: location.searchCity,
        sort: 'Date',
        timeFrom: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        timeTo: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      },
    })
    return res?.records
  } catch (error) {
    console.log(error)
  }
}

export const moonData: MoonData = async ({ location }) => {
  try {
    const res = await runApi<MoonResponseData, MoonRequestData>({
      method: 'POST',
      url: '/weather',
      data: {
        url: 'A-B0063-001',
        location: location.searchCity,
        sort: 'Date',
        timeFrom: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        timeTo: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      },
    })
    return res?.records
  } catch (error) {
    console.log(error)
  }
}

export const tidal1MonthData: Tidal1MonthData = async ({ tidalLocation }) => {
  try {
    const res = await runApi<Tidal1MonthResponseData, Tidal1MonthRequestData>({
      method: 'POST',
      url: '/weather',
      data: {
        url: 'F-A0021-001',
        location: tidalLocation,
        sort: 'Date,DateTime',
      },
    })
    return res?.records
  } catch (error) {
    console.log(error)
  }
}
