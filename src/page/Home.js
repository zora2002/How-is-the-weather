import React from 'react'
import '../style/Home/Home.scss'
import '../style/Home/NowInfo.scss'
import TwentyFourHours from '../components/Home/TwentyFourHours'
import NowInfo from '../components/Home/NowInfo'
import { changeStandardTime } from '../function/time'
import { city2Day1WeekForecast, country36HoursForecast } from '../config/apiList'

const searchCity = '臺中市'
const searchDistrict = '西屯區'

const Home = () => {
  const [time, setTime] = React.useState(new Date())
  const [hour, setHour] = React.useState(changeStandardTime(new Date(), 'hh'))
  const [apiCity2DayForecast, setApiCity2DayForecast] = React.useState(null)
  const [apiCity1WeekForecast, setApiCity1WeekForecast] = React.useState(null)
  const [apiCountry36HoursForecast, setApiCountry36HoursForecast] = React.useState(null)

  React.useEffect(() => {
    const getNowTime = setInterval(() => {
      setTime(new Date())
    }, 60 * 1000)

    const getHour = () => {
      setHour(changeStandardTime(new Date(), 'hh'))
    }
    getHour()

    return () => {
      clearInterval(getNowTime)
    }
  }, [time])

  React.useEffect(() => {
    const getApiCity2DayForecast = () => {
      const params = {}
      city2Day1WeekForecast(params, searchCity, 2)
        .then((response) => {
          const city = response.data.records.locations[0].location
          const district = city.find((i) => i.locationName === searchDistrict)
          const weatherElement = district.weatherElement
          setApiCity2DayForecast(weatherElement)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getApiCity2DayForecast()

    const getApiCountry36HoursForecast = () => {
      const params = { locationName: searchCity }
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
  }, [hour])

  return (
    <div className="dashboard">
      {apiCity2DayForecast && apiCountry36HoursForecast && (
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
            <div className="sun-moon-time"></div>
            <div className="week-info"></div>
          </div>
        </>
      )}
    </div>
  )
}

export default Home
