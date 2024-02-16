import React from 'react'
import dayjs from 'dayjs'

import { isApi3hrFirstArrayHour } from '@/utils/time'
import DashboardDiv from '@/assets/style/Home/DashboardDiv'
import store from '@/store'

const checkIconTimeType = () => {
  const hour = parseInt(dayjs().format('HH'))
  return hour > 5 && hour < 18 ? 'day' : 'night'
}

function DynamicIcon({ icon }) {
  const [image, setImage] = React.useState(null)

  import(`../../img/icon/${checkIconTimeType()}/${icon}.svg`)
    .then((image) => {
      setImage(image.default)
    })
    .catch((error) => {
      console.error('Error loading image:', error)
    })

  return image ? <img src={image} alt="Dynamic Image" /> : <div>Loading...</div>
}

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

  const backgroundColorOpacity = store.getState().dashboard.backgroundColorOpacity

  return (
    <DashboardDiv $backgroundColorOpacity={backgroundColorOpacity} className="now-info">
      <div className="icon">
        <DynamicIcon icon={icon} />
      </div>
      <div className="data">
        <div className="temperature">{temperature}℃</div>
        <div className="describe">{describe}</div>
        <div className="rain">{rain}%</div>
      </div>
      <div className="time">{dayjs().format('MMM DD HH:mm')}</div>
    </DashboardDiv>
  )
}

export default NowInfo
