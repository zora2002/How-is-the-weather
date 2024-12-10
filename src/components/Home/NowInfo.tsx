import { useEffect, useState } from 'react'

import useApp from '@/contexts/app-context-use'
import DashboardDiv from '@/components/Home/DashboardDiv'
import Area404 from '@/components/Home/area404'
import DynamicIcon from '@/components/DynamicIcon'
import type { ApiDataCollection } from '@/page/Home'

const NowInfo = ({ apiDataCollection }: { apiDataCollection: ApiDataCollection }) => {
  const { dateTime, dashboard } = useApp()
  const [temperature, setTemperature] = useState('')
  const [rain, setRain] = useState('')
  const [describe, setDescribe] = useState('')
  const [icon, setIcon] = useState('1')

  const [is404, setIs404] = useState<boolean>(false)

  useEffect(() => {
    const { weather36HourEvery12Hour, weather3DayEvery3Hour } = apiDataCollection

    const api36Hour = weather36HourEvery12Hour?.location?.[0]?.weatherElement
    const api3Day = weather3DayEvery3Hour?.Locations?.[0]?.Location?.[0]?.WeatherElement
    setIs404(!Boolean(api36Hour) || !Boolean(api3Day))
    if (!api36Hour || !api3Day) return

    const wx = api36Hour?.find((i) => i.elementName === 'Wx') // 天氣現象
    setDescribe(wx.time[0].parameter.parameterName)
    setIcon(wx.time[0].parameter.parameterValue)

    const t = api3Day?.find((i) => i.ElementName === '溫度')
    setTemperature(t.Time[0]?.ElementValue[0]?.Temperature)

    const pop3h = api3Day?.find((i) => i.ElementName === '3小時降雨機率')
    setRain(pop3h.Time[0]?.ElementValue[0].ProbabilityOfPrecipitation)
  }, [apiDataCollection])

  if (is404) {
    return (
      <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="now-info">
        <Area404 />
      </DashboardDiv>
    )
  }

  return (
    <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="now-info">
      <div className="icon">
        <DynamicIcon icon={icon} hour={dateTime.hour()} />
      </div>
      <div className="data">
        <div className="temperature">{temperature}℃</div>
        <div className="describe">{describe}</div>
        <div className="rain">{rain}%</div>
      </div>
      <div className="time">{dateTime.format('MMM DD HH:mm')}</div>
    </DashboardDiv>
  )
}

export default NowInfo
