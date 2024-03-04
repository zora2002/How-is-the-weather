import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import useApp from '@/contexts/app-context-use'
import { isApi3hrFirstArrayHour } from '@/utils/time'
import DashboardDiv from '@/components/Home/DashboardDiv'
import DynamicIcon from '@/components/DynamicIcon'
import type { ApiDataCollection } from '@/page/Home'

const NowInfo = ({ apiDataCollection }: { apiDataCollection: ApiDataCollection }) => {
  const { dateTime, dashboard } = useApp()
  const [temperature, setTemperature] = useState('')
  const [rain, setRain] = useState('')
  const [describe, setDescribe] = useState('')
  const [icon, setIcon] = useState('1')

  useEffect(() => {
    const { weather36HourEvery12Hour, weather3DayEvery3Hour } = apiDataCollection

    const api36Hour = weather36HourEvery12Hour?.location?.[0]?.weatherElement
    const wx = api36Hour?.find((i) => i.elementName === 'Wx') // 天氣現象
    setDescribe(wx.time[0].parameter.parameterName)
    setIcon(wx.time[0].parameter.parameterValue)

    const api3Day = weather3DayEvery3Hour?.locations?.[0]?.location?.[0]?.weatherElement
    const t = api3Day?.find((i) => i.elementName === 'T') // 溫度
    const tIndex = isApi3hrFirstArrayHour(dateTime.hour(), dayjs(t.time[0].dataTime).hour()) ? 0 : 1
    setTemperature(t.time[tIndex]?.elementValue[0]?.value)

    const pop6h = api3Day?.find((i) => i.elementName === 'PoP6h') // 6小時降雨機率
    setRain(pop6h.time[0]?.elementValue[0].value)
  }, [apiDataCollection])

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
