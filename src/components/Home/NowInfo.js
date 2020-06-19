import React from 'react'
import { changeStandardTime } from '../../function/time'
import { city2Day1WeekForecast, country36HoursForecast } from '../../config/apiList'

const searchCity = '臺中市'
const searchDistrict = '西屯區'

const NowInfo = () => {
  const [time, setTime] = React.useState(new Date())
  const [hour, setHour] = React.useState(changeStandardTime(new Date(), 'hh'))
  const [temperature, setTemperature] = React.useState('')
  const [rain, setRain] = React.useState('')
  const [describe, setDescribe] = React.useState('')
  const [icon, setIcon] = React.useState(require('../../img/sunny_and_cloudy.svg'))

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
    const getTemperatureRain = () => {
      const params = {}
      city2Day1WeekForecast(params, searchCity, 2)
        .then((response) => {
          const city = response.data.records.locations[0].location
          const district = city.find((i) => i.locationName === searchDistrict)
          const weatherElement = district.weatherElement

          const t = weatherElement.find((i) => i.elementName === 'T') // 溫度
          setTemperature(t.time[0].elementValue[0].value)
          const pop6h = weatherElement.find((i) => i.elementName === 'PoP6h') // 6小時降雨機率
          setRain(pop6h.time[0].elementValue[0].value)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getTemperatureRain()

    const getDescribe = () => {
      const params = {
        locationName: searchCity,
      }
      country36HoursForecast(params)
        .then((response) => {
          const city = response.data.records.location[0]
          const weatherElement = city.weatherElement
          const wx = weatherElement.find((i) => i.elementName === 'Wx') // 天氣現象
          setDescribe(wx.time[0].parameter.parameterName)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    getDescribe()

    return () => {}
  }, [hour])

  return (
    <div className="now-info">
      <div className="icon">
        <img src={icon} alt="" />
      </div>
      <div className="data">
        <div className="temperature">{temperature}℃</div>
        <div className="describe">{describe}</div>
        <div className="rain">{rain}%</div>
      </div>
      <div className="time">{changeStandardTime(time, 'MonthEnglish/DD hh:mm')}</div>
    </div>
  )
}

export default NowInfo
