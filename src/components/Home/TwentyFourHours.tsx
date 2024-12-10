import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import useApp from '@/contexts/app-context-use'
import DashboardDiv from '@/components/Home/DashboardDiv'
import Area404 from '@/components/Home/area404'
import DynamicIcon from '../DynamicIcon'
import type { ApiDataCollection } from '@/page/Home'
import { SvgInfoList, setting1SVG, svg1PathD } from '@/utils/svg'

import '@/assets/style/Home/TwentyFourHours.scss'

const SHOW_AMOUNT = 10

const TwentyFourHours = ({ apiDataCollection }: { apiDataCollection: ApiDataCollection }) => {
  const { dashboard } = useApp()

  const [timeIconList, setTimeIconList] = useState<{ time: string; icon: string }[]>([])
  const [svgInfoList, setSvgInfoList] = useState<SvgInfoList>({ text: [], circle: [] })
  const [svg1PathD, setSvg1PathD] = useState<svg1PathD>('')
  const [rainList, setRainList] = useState<string[]>([])

  const [is404, setIs404] = useState<boolean>(false)

  useEffect(() => {
    const infoHandler = () => {
      const { weather3DayEvery3Hour } = apiDataCollection
      const api3Day = weather3DayEvery3Hour?.Locations?.[0]?.Location?.[0]?.WeatherElement
      setIs404(!Boolean(api3Day))
      if (!api3Day) return

      // up-list
      const wx = api3Day?.find((i) => i.ElementName === '天氣現象')
      const timeIcon = wx?.Time?.slice(0, SHOW_AMOUNT)?.map((i) => {
        return {
          time:
            dayjs(i.StartTime).hour() === 0
              ? `${dayjs(i.StartTime).format('DD')}號`
              : `${dayjs(i.StartTime).format('HH')}時`,
          icon: i.ElementValue[0].WeatherCode,
        }
      })
      setTimeIconList(timeIcon)

      // svg
      const t = api3Day?.find((i) => i.ElementName === '溫度')
      const temperature = t?.Time?.slice(0, SHOW_AMOUNT)?.map((i) => i.ElementValue[0].Temperature)
      const { svgInfoList, svg1PathD } = setting1SVG(temperature, SHOW_AMOUNT, 80, 60)
      setSvgInfoList(svgInfoList)
      setSvg1PathD(svg1PathD)

      // down-list
      const pop3h = api3Day?.find((i) => i.ElementName === '3小時降雨機率')
      let rain = pop3h?.Time?.slice(0, SHOW_AMOUNT).map((i) => i.ElementValue[0].ProbabilityOfPrecipitation)
      setRainList(rain)
    }
    infoHandler()
  }, [apiDataCollection])

  if (is404) {
    return (
      <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="twenty-four-hours">
        <Area404 />
      </DashboardDiv>
    )
  }

  return (
    <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="twenty-four-hours">
      <ul className="up-list">
        {timeIconList.map((i, index) => (
          <li key={index}>
            <div>{i.time}</div>
            <DynamicIcon icon={i.icon} hour={i.time.slice(-1) === '號' ? 0 : parseInt(i.time.slice(0, 2))} />
          </li>
        ))}
      </ul>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 100" className="twentyfour-svg">
        {svgInfoList.text?.map((i) => (
          <text key={i.key} x={i.x} y={i.y} fontSize="14" textAnchor="end" fill="#000000">
            {i.value}
          </text>
        ))}
        {svgInfoList.circle?.map((i) => <circle key={i.key} cx={i.cx} cy={i.cy} r="3" fill="#000000" />)}
        <path d={svg1PathD} transform="translate(0, 0)" fill="none" stroke="#000000" strokeWidth="1" />
      </svg>
      <ul className="down-list">
        {rainList.map((i, index) => (
          <li key={index}>{i}%</li>
        ))}
      </ul>
    </DashboardDiv>
  )
}

export default TwentyFourHours
