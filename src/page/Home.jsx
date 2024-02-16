import React from 'react'
import dayjs from 'dayjs'

import '@/style/Home/Home.scss'
import '@/style/Home/NowInfo.scss'

import TwentyFourHours from '@/components/Home/TwentyFourHours'
import NowInfo from '@/components/Home/NowInfo'
import WeekInfo from '@/components/Home/WeekInfo'
import SunMoonTime from '@/components/Home/SunMoonTime'
import { city2Day1WeekForecast, country36HoursForecast } from '@/config/apiList'

const Home = ({ time, location }) => {
  const [hour, setHour] = React.useState(dayjs().format('HH'))
  const [apiCity2DayForecast, setApiCity2DayForecast] = React.useState(null)
  const [apiCity1WeekForecast, setApiCity1WeekForecast] = React.useState(null)
  const [apiCountry36HoursForecast, setApiCountry36HoursForecast] = React.useState(null)

  React.useEffect(() => {
    const getHour = () => {
      setHour(dayjs().format('HH'))
    }
    getHour()

    return () => {}
  }, [time])

  React.useEffect(() => {
    const getApiCity2DayForecast = () => {
      const params = {
        locationName: location.searchDistrict,
      }
      city2Day1WeekForecast(params, location.searchCity, 2)
        .then((response) => {
          const city = response.data.records.locations[0].location
          const district = city[0]
          const weatherElement = district.weatherElement
          setApiCity2DayForecast(weatherElement)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getApiCity2DayForecast()

    const getApiCity1WeekForecast = () => {
      const params = {
        locationName: location.searchDistrict,
      }
      city2Day1WeekForecast(params, location.searchCity, 7)
        .then((response) => {
          const city = response.data.records.locations[0].location
          const district = city[0]
          const weatherElement = district.weatherElement
          setApiCity1WeekForecast(weatherElement)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getApiCity1WeekForecast()

    const getApiCountry36HoursForecast = () => {
      const params = { locationName: location.searchCity }
      country36HoursForecast(params)
        .then((response) => {
          const city = response.data.records.location[0]
          const weatherElement = city.weatherElement
          setApiCountry36HoursForecast(weatherElement)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getApiCountry36HoursForecast()

    return () => {}
  }, [hour, location.searchCity, location.searchDistrict])

  return (
    <div className="dashboard">
      {apiCity2DayForecast && apiCity1WeekForecast && apiCountry36HoursForecast && (
        <>
          <div className="up-area">
            <TwentyFourHours apiCity2DayForecast={apiCity2DayForecast} />
            <NowInfo
              apiCity2DayForecast={apiCity2DayForecast}
              apiCountry36HoursForecast={apiCountry36HoursForecast}
              time={time}
            />
          </div>
          <div className="down-area">
            <SunMoonTime time={time} hour={hour} location={location} />
            <WeekInfo apiCity1WeekForecast={apiCity1WeekForecast} />
          </div>
        </>
      )}
    </div>
  )
}

export default Home
