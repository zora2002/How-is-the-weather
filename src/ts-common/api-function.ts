import type { ResponseStructure, Weather36HourEvery12HourResponseData, Weather3DayEvery3HourResponseData, Weather7DayEvery12HourResponseData, SunResponseData, MoonResponseData, Tidal1MonthResponseData } from '@/ts-common/api-response'
import { Location } from '@/contexts/app-context.interface'

export interface RunApiType {
  <T0, T1 = undefined, T2 = undefined>({
    method,
    baseURL,
    url,
    data,
    params,
    headersContentType
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    baseURL?: string
    url: string
    data?: T1
    params?: T2
    headersContentType?: 'application/json' | 'multipart/form-data'
  }): Promise<ResponseStructure<T0>>
}

export interface RunJsonApiType {
  <T>(url: string): Promise<T>
}

export interface Weather36HourEvery12HourData {
  ({ location }: {
    location: Location
  }): Promise<Weather36HourEvery12HourResponseData>
}

export interface Weather3DayEvery3HourData {
  ({ location }: {
    location: Location
  }): Promise<Weather3DayEvery3HourResponseData>
}

export interface Weather7DayEvery12HourData {
  ({ location }: {
    location: Location
  }): Promise<Weather7DayEvery12HourResponseData>
}

export interface SunData {
  ({ location }: {
    location: Location
  }): Promise<SunResponseData>
}

export interface MoonData {
  ({ location }: {
    location: Location
  }): Promise<MoonResponseData>
}

export interface Tidal1MonthData {
  ({ tidalLocation }: {
    tidalLocation: string
  }): Promise<Tidal1MonthResponseData>
}
