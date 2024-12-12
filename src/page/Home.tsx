import { useState, useEffect } from 'react'

import useApp from '@/contexts/app-context-use'
import type { Location } from '@/contexts/app-context.interface'
import TwentyFourHours from '@/components/Home/TwentyFourHours'
import NowInfo from '@/components/Home/NowInfo'
import WeekInfo from '@/components/Home/WeekInfo'
import SunMoonTime from '@/components/Home/SunMoonTime'
import {
  weather36HourEvery12HourData,
  weather3DayEvery3HourData,
  weather7DayEvery12HourData,
  sunData,
  moonData,
} from '@/utils/api-list'
import { getTimePeriod } from '@/utils/time'
import type {
  Weather36HourEvery12HourResponseData,
  Weather3DayEvery3HourResponseData,
  Weather7DayEvery12HourResponseData,
  SunResponseData,
  MoonResponseData,
} from '@/ts-common/api-response'

import '@/assets/style/Home.scss'
import '@/assets/style/Wallpaper.scss'

export interface ApiDataCollection {
  weather36HourEvery12Hour: Weather36HourEvery12HourResponseData
  weather3DayEvery3Hour: Weather3DayEvery3HourResponseData
  weather7DayEvery12Hour: Weather7DayEvery12HourResponseData
  sun: SunResponseData
  moon: MoonResponseData
}

const getAllApiData = async (location: Location) => {
  try {
    const weather36HourEvery12Hour = await weather36HourEvery12HourData({ location })
    const weather3DayEvery3Hour = await weather3DayEvery3HourData({ location })
    const weather7DayEvery12Hour = await weather7DayEvery12HourData({ location })
    const sun = await sunData({ location })
    const moon = await moonData({ location })

    return {
      weather36HourEvery12Hour,
      weather3DayEvery3Hour,
      weather7DayEvery12Hour,
      sun,
      moon,
    }
  } catch (error) {
    console.log(error)
  }
}

const Home = () => {
  const { dateTime, location } = useApp()
  const [apiDataCollection, setApiDataCollection] = useState<ApiDataCollection>(null)
  const [timePeriod, setTimePeriod] = useState('')

  useEffect(() => {
    const apiDataCollectionHandler = async () => {
      try {
        const res = await getAllApiData(location)
        setApiDataCollection({ ...res })
      } catch (error) {
        console.log(error)
      }
    }

    apiDataCollectionHandler()
  }, [dateTime.hour(), location.searchDistrict])

  useEffect(() => {
    if (!apiDataCollection) return
    const { sun } = apiDataCollection
    setTimePeriod(getTimePeriod(sun, dateTime))
  }, [apiDataCollection, dateTime.minute()])

  return (
    <>
      {apiDataCollection ? (
        <div className={`dashboard time-period ${timePeriod}`}>
          <TwentyFourHours apiDataCollection={apiDataCollection} />
          <NowInfo apiDataCollection={apiDataCollection} />
          <SunMoonTime apiDataCollection={apiDataCollection} />
          <WeekInfo apiDataCollection={apiDataCollection} />
        </div>
      ) : (
        <div className="loader-bg">
          <div className="loader"></div>
        </div>
      )}
    </>
  )
}

export default Home
