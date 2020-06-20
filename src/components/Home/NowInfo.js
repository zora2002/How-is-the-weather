import React from 'react'
import { changeStandardTime } from '../../function/time'

const NowInfo = ({ apiCity2Day1WeekForecast, apiCountry36HoursForecast, time }) => {
  const city2Day1WeekForecast = apiCity2Day1WeekForecast
  const country36HoursForecast = apiCountry36HoursForecast
  const [temperature, setTemperature] = React.useState('')
  const [rain, setRain] = React.useState('')
  const [describe, setDescribe] = React.useState('')
  const [icon, setIcon] = React.useState(require('../../img/sunny_and_cloudy.svg'))

  React.useEffect(() => {
    const getTemperatureRain = () => {
      console.log('api-2-現在/更新:' + new Date(), city2Day1WeekForecast)

      if (city2Day1WeekForecast) {
        const t = city2Day1WeekForecast.find((i) => i.elementName === 'T') // 溫度
        setTemperature(t.time[0].elementValue[0].value)
        const pop6h = city2Day1WeekForecast.find((i) => i.elementName === 'PoP6h') // 6小時降雨機率
        setRain(pop6h.time[0].elementValue[0].value)
      }
    }
    getTemperatureRain()

    return () => {}
  }, [city2Day1WeekForecast])

  React.useEffect(() => {
    const getDescribe = () => {
      console.log('api-36-現在/更新:' + new Date(), country36HoursForecast)

      if (country36HoursForecast) {
        const wx = country36HoursForecast.find((i) => i.elementName === 'Wx') // 天氣現象
        setDescribe(wx.time[0].parameter.parameterName)
      }
    }
    getDescribe()

    return () => {}
  }, [country36HoursForecast])

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
