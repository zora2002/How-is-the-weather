import { useState, useEffect } from 'react'

import useApp from '@/contexts/app-context-use'
import { isApi12hrFirstArrayHour } from '@/utils/time'
import DashboardDiv from '@/components/Home/DashboardDiv'
import Area404 from '@/components/Home/area404'
import DynamicIcon from '@/components/DynamicIcon'
import type { ApiDataCollection } from '@/page/Home'
import { SvgInfoList, setting2SVG, Svg2PathD } from '@/utils/svg'
import type { Weather7DayEvery12HourResponseData } from '@/ts-common/api-response'

import '@/assets/style/Home/WeekInfo.scss'
import dayjs from 'dayjs'

interface DateIcon {
  date: string
  icon: {
    day: string
    night: string
  }
}

interface DateTemp {
  date: string
  temp: {
    day: string
    night: string
  }
}

const checkArray = (
  list: Weather7DayEvery12HourResponseData['locations'][0]['location'][0]['weatherElement'][0]['time']
) => {
  return isApi12hrFirstArrayHour(dayjs(list[0].startTime).hour()) ? list : list.slice(1, list?.length)
}

const WeekInfo = ({ apiDataCollection }: { apiDataCollection: ApiDataCollection }) => {
  const { dashboard } = useApp()
  const [isDay, setIsDay] = useState(true)

  const [dateIconList, setdateIconList] = useState<DateIcon[]>([])
  const [svgInfoList, setSvgInfoList] = useState<SvgInfoList>({ text: [], circle: [] })
  const [svg2PathD, setSvg2PathD] = useState<Svg2PathD>({ day: '', night: '' })
  const [rainList, setRainList] = useState({ day: [], night: [] })

  const [is404, setIs404] = useState<boolean>(false)

  useEffect(() => {
    const { weather7DayEvery12Hour } = apiDataCollection
    const api7Day = weather7DayEvery12Hour?.locations?.[0]?.location?.[0].weatherElement
    setIs404(!Boolean(api7Day))
    if (!api7Day) return

    // up-list
    const wx = api7Day?.find((i) => i.elementName === 'Wx') // 平均溫度
    const checkedWx = checkArray([...wx?.time])
    // date
    let dateIcon: DateIcon[] = []
    checkedWx?.forEach((i, index, arr) => {
      if (index % 2 === 1) return
      const info = {
        day: i,
        night: arr[index + 1],
      }
      dateIcon.push({
        date: dayjs(i.startTime).format('MM/DD'),
        icon: {
          day: info.day.elementValue[1].value,
          night: info.night.elementValue[1].value,
        },
      })
    })
    setdateIconList(dateIcon)

    // svg
    const t = api7Day?.find((i) => i.elementName === 'T') // 平均溫度
    const checkedT = checkArray([...t.time])
    let dateTemp: DateTemp[] = []
    checkedT?.forEach((i, index, arr) => {
      if (index % 2 === 1) return
      const info = {
        day: i,
        night: arr[index + 1],
      }
      dateTemp.push({
        date: dayjs(i.startTime).format('MM/DD'),
        temp: {
          day: info.day.elementValue[0].value,
          night: info.night.elementValue[0].value,
        },
      })
    })
    const svgResult = setting2SVG(
      dateTemp?.map((i) => i.temp.day),
      dateTemp?.map((i) => i.temp.night),
      7,
      120,
      100
    )
    setSvgInfoList(svgResult.svgInfoList)
    setSvg2PathD(svgResult.svg2PathD)

    // rain
    const poP12h = api7Day?.find((i) => i.elementName === 'PoP12h') // 12小時降雨機率
    let checkedPoP12h = checkArray([...poP12h.time])
    let countRainList = {
      day: [],
      night: [],
    }
    checkedPoP12h.map((i, index) =>
      index % 2 === 1
        ? countRainList.day.push(i.elementValue[0].value)
        : countRainList.night.push(i.elementValue[0].value)
    )
    setRainList(countRainList)
  }, [apiDataCollection])

  if (is404) {
    return (
      <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="week-info">
        <Area404 />
      </DashboardDiv>
    )
  }

  return (
    <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="week-info">
      <ul className="up-list">
        {dateIconList.map((i, index) => (
          <li key={index}>
            <div>{i.date}</div>
            <DynamicIcon icon={isDay ? i.icon.day : i.icon.night} isDay={isDay} />
          </li>
        ))}
      </ul>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 780 100"
        className="week-svg"
        onClick={() => {
          setIsDay(!isDay)
        }}
      >
        {svgInfoList.text?.map((i) => (
          <text key={i.key} x={i.x} y={i.y} fontSize="13" textAnchor="end" fill="#000000">
            {i.value}
          </text>
        ))}
        {svgInfoList.circle?.map((i) => <circle key={i.key} cx={i.cx} cy={i.cy} r="3" fill="#000000" />)}
        <path
          d={svg2PathD.day}
          transform="translate(0, 0)"
          fill="none"
          stroke={isDay ? '#000000' : '#AFAFAF'}
          strokeWidth="1"
        />
        <path
          d={svg2PathD.night}
          transform="translate(0, 0)"
          fill="none"
          stroke={!isDay ? '#000000' : '#AFAFAF'}
          strokeWidth="1"
        />
      </svg>
      <ul className="down-list">
        {rainList[isDay ? 'day' : 'night'].map((i, index) => (
          <li key={index}>{i === ' ' ? '-' : `${i}%`}</li>
        ))}
      </ul>
    </DashboardDiv>
  )
}

export default WeekInfo
