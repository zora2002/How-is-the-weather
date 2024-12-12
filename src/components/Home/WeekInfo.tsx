import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

import useApp from '@/contexts/app-context-use'
import { isApi12hrFirstArrayHour } from '@/utils/time'
import DashboardDiv from '@/components/Home/DashboardDiv'
import Area404 from '@/components/Home/Area404'
import DynamicIcon from '@/components/DynamicIcon'
import type { ApiDataCollection } from '@/page/Home'
import { SvgInfoList, setting2SVG, Svg2PathD } from '@/utils/svg'
import type { Weather7DayEvery12HourResponseData } from '@/ts-common/api-response'

interface DateIcon {
  date: {
    m: string
    d: string
  }
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
  list: Weather7DayEvery12HourResponseData['Locations'][0]['Location'][0]['WeatherElement'][0]['Time']
) => {
  return isApi12hrFirstArrayHour(dayjs(list[0].StartTime).hour()) ? list : list.slice(1, list?.length)
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
    const api7Day = weather7DayEvery12Hour?.Locations?.[0]?.Location?.[0].WeatherElement
    setIs404(!Boolean(api7Day))
    if (!api7Day) return

    // up-list
    const wx = api7Day?.find((i) => i.ElementName === '天氣現象')
    const checkedWx = checkArray([...wx?.Time])
    // date
    let dateIcon: DateIcon[] = []
    checkedWx?.forEach((i, index, arr) => {
      if (index % 2 === 1) return
      const info = {
        day: i,
        night: arr[index + 1],
      }
      dateIcon.push({
        date: {
          m: dayjs(i.StartTime).format('MMM'),
          d: dayjs(i.StartTime).format('DD')
        },
        icon: {
          day: info.day.ElementValue[0].WeatherCode,
          night: info.night.ElementValue[0].WeatherCode,
        },
      })
    })
    setdateIconList(dateIcon)

    // svg
    const t = api7Day?.find((i) => i.ElementName === '平均溫度')
    const checkedT = checkArray([...t.Time])
    let dateTemp: DateTemp[] = []
    checkedT?.forEach((i, index, arr) => {
      if (index % 2 === 1) return
      const info = {
        day: i,
        night: arr[index + 1],
      }
      dateTemp.push({
        date: dayjs(i.StartTime).format('MM/DD'),
        temp: {
          day: info.day.ElementValue[0].Temperature,
          night: info.night.ElementValue[0].Temperature,
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
    const poP12h = api7Day?.find((i) => i.ElementName === '12小時降雨機率')
    let checkedPoP12h = checkArray([...poP12h.Time])
    let countRainList = {
      day: [],
      night: [],
    }
    checkedPoP12h.forEach((i, index) =>
      (index + 1) % 2 === 1
        ? countRainList.day.push(i.ElementValue[0].ProbabilityOfPrecipitation)
        : countRainList.night.push(i.ElementValue[0].ProbabilityOfPrecipitation)
    )
    setRainList(countRainList)
  }, [apiDataCollection])

  if (is404) {
    return (
      <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="card week-info">
        <Area404 />
      </DashboardDiv>
    )
  }

  return (
    <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="card week-info">
      <ul className="date-icon-list">
        {dateIconList.map((i, index) => (
          <li key={index}>
            <span>{i.date.m}</span>
            <span>{i.date.d}</span>
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
      <ul className="percent-list">
        {rainList[isDay ? 'day' : 'night'].map((i, index) => (
          <li key={index}>{i === ' ' ? '-' : `${i}%`}</li>
        ))}
      </ul>
    </DashboardDiv>
  )
}

export default WeekInfo
