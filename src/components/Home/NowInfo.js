import React from 'react'
import { changeStandardTime, isApi3hrFirstArrayHour } from '../../function/time'

const NowInfo = ({ apiCity2DayForecast, apiCountry36HoursForecast, time }) => {
  const country36HoursForecast = apiCountry36HoursForecast
  const [temperature, setTemperature] = React.useState('')
  const [rain, setRain] = React.useState('')
  const [describe, setDescribe] = React.useState('')
  const [icon, setIcon] = React.useState(1)

  React.useEffect(() => {
    const getTemperatureRain = () => {
      console.log('API-apiCity2DayForecast/更新:' + new Date())

      const t = apiCity2DayForecast.find((i) => i.elementName === 'T') // 溫度
      const tIndex = isApi3hrFirstArrayHour(t.time[0].dataTime) ? 0 : 1
      setTemperature(t.time[tIndex].elementValue[0].value)
      const pop6h = apiCity2DayForecast.find((i) => i.elementName === 'PoP6h') // 6小時降雨機率
      setRain(pop6h.time[0].elementValue[0].value)
    }
    apiCity2DayForecast && getTemperatureRain()

    return () => {}
  }, [apiCity2DayForecast])

  React.useEffect(() => {
    const getDescribe = () => {
      console.log('API-apiCountry36HoursForecast/更新:' + new Date())

      const wx = country36HoursForecast.find((i) => i.elementName === 'Wx') // 天氣現象
      setDescribe(wx.time[0].parameter.parameterName)
      setIcon(wx.time[0].parameter.parameterValue)
    }
    country36HoursForecast && getDescribe()

    return () => {}
  }, [country36HoursForecast])

  return (
    <div className="now-info">
      <div className="icon">
        <img src={require(`../../img/icon/${icon}.svg`)} alt="" />
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
