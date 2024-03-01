import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import useApp from '@/contexts/app-context-use'
import DashboardDiv from '@/components/Home/DashboardDiv'
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

  useEffect(() => {
    const infoHandler = () => {
      const { weather3DayEvery3Hour } = apiDataCollection
      const api3Day = weather3DayEvery3Hour?.locations?.[0]?.location?.[0]?.weatherElement

      // up-list
      const wx = api3Day.find((i) => i.elementName === 'Wx') // 天氣現象
      const timeIcon = wx?.time?.slice(0, SHOW_AMOUNT)?.map((i) => {
        return {
          time:
            dayjs(i.startTime).hour() === 0
              ? `${dayjs(i.startTime).format('DD')}號`
              : `${dayjs(i.startTime).format('HH')}時`,
          icon: i.elementValue[1].value,
        }
      })
      setTimeIconList(timeIcon)

      // svg
      const t = api3Day.find((i) => i.elementName === 'T') // 溫度
      const temperature = t?.time?.slice(0, SHOW_AMOUNT)?.map((i) => i.elementValue[0].value)
      const { svgInfoList, svg1PathD } = setting1SVG(temperature, SHOW_AMOUNT, 80, 60)
      setSvgInfoList(svgInfoList)
      setSvg1PathD(svg1PathD)

      // down-list
      const poP6h = api3Day.find((i) => i.elementName === 'PoP6h') // 6小時降雨機率
      let rain = poP6h?.time?.flatMap((i) => [i.elementValue[0].value, i.elementValue[0].value]).slice(0, SHOW_AMOUNT)
      setRainList(rain)
    }
    infoHandler()
  }, [apiDataCollection])

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
