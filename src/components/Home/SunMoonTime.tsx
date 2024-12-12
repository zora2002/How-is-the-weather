import { useState, useEffect } from 'react'

import useApp from '@/contexts/app-context-use'
import DashboardDiv from '@/components/Home/DashboardDiv'
import Area404 from '@/components/Home/Area404'
import type { ApiDataCollection } from '@/page/Home'
import { CENTER, SUN_R, MOON_R, infoHandler, translateHandler, Info } from '@/utils/sun-moon-helper'

const SunMoonTime = ({ apiDataCollection }: { apiDataCollection: ApiDataCollection }) => {
  const { dateTime, dashboard } = useApp()
  const [info, setInfo] = useState<Info | null>()
  const [sunTrans, setSunTrans] = useState<string>('translate(0 0)')
  const [moonTrans, setMoonTrans] = useState('translate(0 0)')

  const [is404, setIs404] = useState<boolean>(false)

  useEffect(() => {
    const { sun, moon } = apiDataCollection

    setIs404(!Boolean(sun) || !Boolean(moon))
    if (!sun || !moon) return

    const info = infoHandler(dateTime, sun, moon)
    setInfo(info)
  }, [apiDataCollection])

  useEffect(() => {
    if (!info) return
    const { sunTrans, moonTrans } = translateHandler(dateTime, info)
    setSunTrans(`translate(${sunTrans.x} ${sunTrans.y})`)
    setMoonTrans(`translate(${moonTrans.x} ${moonTrans.y})`)
  }, [info, dateTime.minute()])

  if (is404) {
    return (
      <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="card sun-moon-time">
        <Area404 />
      </DashboardDiv>
    )
  }

  return (
    <DashboardDiv $backgroundColorOpacity={dashboard.backgroundColorOpacity} className="card sun-moon-time">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
        <g id="日月時間" transform="translate(0 0)">
          <g
            id="line"
            data-name="line"
            transform="translate(0 0) "
            fill="none"
            stroke="#707070"
            strokeWidth="1"
            strokeDasharray="10"
          >
            <circle cx={CENTER.X} cy={CENTER.Y} r={MOON_R} stroke="#707070" />
            <circle cx={CENTER.X} cy={CENTER.Y} r={SUN_R} stroke="#707070" />
          </g>
          <circle id="sun" cx="0" cy="0" r="25" fill="rgb(254, 217, 127)" transform={sunTrans} />
          <path
            id="moon"
            data-name="moon"
            d="M28.4,0a27.213,27.213,0,1,1-13.14,51.048S31.383,44.469,31.21,27.213,16.8,2.542,18.158,1.977A26.934,26.934,0,0,1,28.4,0Z"
            transform={moonTrans}
            fill="rgb(174, 174, 174)"
          />
          <path
            id="cat"
            data-name="cat"
            d="M-65.778,180.3c-2.845-.79-9.515-2.033-8-6.306s7.663-7.539,11.38-12.326a16.1,16.1,0,0,0,1.568-2.392,19.966,19.966,0,0,1-10.1-3.216c-6.476-4.313,1.621-21.957,1.621-21.957s-4.1-4.337,0-11.309c-.224-1.186.439-4.8,1.2-4.788s2.887,3.663,2.887,3.663a13.971,13.971,0,0,0,3.69.531,12.487,12.487,0,0,0,3.565-.531s1.59-3.641,2.334-3.663,2.335,3.407,2.075,4.788a10.653,10.653,0,0,1,.7,11.309c2.237,6.528,8.042,17.645,2.893,21.957a13.954,13.954,0,0,1-6.076,2.833,6.711,6.711,0,0,1-1.226,2.775c-2.914,4.091-13.791,9.167-13.13,12.91.535,3.031,6.185,1.436,8,2.8,1.566,1.172.035,3.085-2.239,3.086A4.259,4.259,0,0,1-65.778,180.3Z"
            transform="translate(310 110)"
            fill="#707070"
            stroke="#707070"
            strokeWidth="1"
          />
          <text x={CENTER.X + SUN_R + 20} y={CENTER.Y} fontSize="20" textAnchor="end" fill="#000000">
            {info?.sun.today.rice.format('HH:mm')}
          </text>
          <text x={CENTER.X - SUN_R + 20} y={CENTER.Y} fontSize="20" textAnchor="end" fill="#000000">
            {info?.sun.today.set.format('HH:mm')}
          </text>
          <text x={CENTER.X + MOON_R + 20} y={CENTER.Y} fontSize="20" textAnchor="end" fill="#000000">
            {info?.moon.today.rice.format('HH:mm')}
          </text>
          <text x={CENTER.X - MOON_R + 20} y={CENTER.Y} fontSize="20" textAnchor="end" fill="#000000">
            {info?.moon.today.set.format('HH:mm')}
          </text>
        </g>
      </svg>
    </DashboardDiv>
  )
}

export default SunMoonTime
