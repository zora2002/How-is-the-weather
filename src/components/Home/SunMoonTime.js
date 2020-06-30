import React from 'react'
import '../../style/Home/SunMoonTime.scss'
import { getSunMoonData, minutesGap, changeStandardTime, splitTime } from '../../function/time'

const searchCity = '臺中市'

const center = { x: 250, y: 250 }
const sunR = 200
const moonR = 100
const moonOffset = { x: 35, y: 28 }

const translateHandler = (nowTime, rise, set, riseTomorrow) => {
  const nowTimeTotalMin = splitTime(nowTime).hh * 60 + splitTime(nowTime).mm
  const riseTotalMin = splitTime(rise).hh * 60 + splitTime(rise).mm
  const setTotalMin = splitTime(set).hh * 60 + splitTime(set).mm
  const riseTomorrowTotalMin = splitTime(riseTomorrow).hh * 60 + splitTime(riseTomorrow).mm

  let angle = 0
  if (riseTotalMin < setTotalMin) {
    if (riseTotalMin <= nowTimeTotalMin && nowTimeTotalMin <= setTotalMin) {
      if (nowTimeTotalMin === setTotalMin) {
        angle = -180
      } else if (nowTimeTotalMin === riseTotalMin) {
        angle = -0
      } else {
        angle = -(minutesGap(rise, nowTime) * 180) / minutesGap(rise, set)
      }
      console.log('position1', angle)
    } else {
      if (12 * 60 < nowTimeTotalMin && nowTimeTotalMin > setTotalMin) {
        angle = -180 + -(minutesGap(nowTime, set) * 180) / (minutesGap(set, '23:59') + riseTomorrowTotalMin)
        console.log('position2', angle)
      } else {
        angle =
          -180 +
          -((minutesGap(set, '23:59') + nowTimeTotalMin) * 180) / (minutesGap(set, '23:59') + riseTomorrowTotalMin)
        console.log('position3', angle)
      }
    }
  } else {
    if (setTotalMin <= nowTimeTotalMin && nowTimeTotalMin <= riseTotalMin) {
      if (nowTimeTotalMin === setTotalMin) {
        angle = -180
      } else if (nowTimeTotalMin === riseTotalMin) {
        angle = -0
      } else {
        angle = -180 + -(minutesGap(set, nowTime) * 180) / minutesGap(set, riseTomorrow)
      }
      console.log('position4', angle)
    } else {
      if (12 * 60 < nowTimeTotalMin && nowTimeTotalMin > riseTotalMin) {
        angle = -(minutesGap(nowTime, rise) * 180) / (minutesGap(rise, '23:59') + setTotalMin)
        console.log('position5', angle)
      } else {
        angle = -((minutesGap(rise, '23:59') + nowTimeTotalMin) * 180) / (minutesGap(rise, '23:59') + setTotalMin)
        console.log('position6', angle)
      }
    }
  }
  const radians = angle * (Math.PI / 180)
  return { x: Math.cos(radians), y: Math.sin(radians) }
}

const SunMoonTime = ({ time, hour }) => {
  const nowTime = changeStandardTime(time, 'hh:mm')
  const nowHour = hour
  const [sunrise, setSunrise] = React.useState('')
  const [sunset, setSunset] = React.useState('')
  const [sunriseTomorrow, setSunriseTomorrow] = React.useState('')
  const [sunTrans, setSunTrans] = React.useState('translate(0 0)')
  const [moonrise, setMoonrise] = React.useState('')
  const [moonset, setMoonset] = React.useState('')
  const [moonriseTomorrow, setMoonriseTomorrow] = React.useState('')
  const [moonTrans, setMoonTrans] = React.useState('translate(0 0)')

  React.useEffect(() => {
    const sunTimeList = getSunMoonData('sun', searchCity, changeStandardTime(new Date(), 'YYYY-MM-DD')).parameter
    setSunrise(sunTimeList.find((i) => i.parameterName === '日出時刻').parameterValue)
    setSunset(sunTimeList.find((i) => i.parameterName === '日沒時刻').parameterValue)
    const sunTimeTomorrowList = getSunMoonData('sun', searchCity, changeStandardTime(new Date(), 'YYYY-MM-DD+1'))
      .parameter
    setSunriseTomorrow(sunTimeTomorrowList.find((i) => i.parameterName === '日出時刻').parameterValue)

    const moonTimeList = getSunMoonData('moon', searchCity, changeStandardTime(new Date(), 'YYYY-MM-DD')).parameter
    setMoonrise(moonTimeList.find((i) => i.parameterName === '月出時刻').parameterValue)
    setMoonset(moonTimeList.find((i) => i.parameterName === '月沒時刻').parameterValue)
    const moonTimeTomorrowList = getSunMoonData('moon', searchCity, changeStandardTime(new Date(), 'YYYY-MM-DD+1'))
      .parameter
    setMoonriseTomorrow(moonTimeTomorrowList.find((i) => i.parameterName === '月出時刻').parameterValue)

    return () => {}
  }, [nowHour])

  React.useEffect(() => {
    const setPosition = () => {
      if (sunrise && sunset && sunriseTomorrow && moonrise && moonset && moonriseTomorrow) {
        const sun = translateHandler(nowTime, sunrise, sunset, sunriseTomorrow)
        setSunTrans(`translate(${center.x + sun.x * sunR} ${center.y + sun.y * sunR})`)
        const moon = translateHandler(nowTime, moonrise, moonset, moonriseTomorrow)
        setMoonTrans(
          `translate(${center.x - moonOffset.x + moon.x * moonR} ${center.y - moonOffset.y + moon.y * moonR})`
        )
      }
    }

    setPosition()

    return () => {}
  }, [moonrise, moonriseTomorrow, moonset, nowTime, sunrise, sunriseTomorrow, sunset])

  return (
    <div className="sun-moon-time">
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
            <circle cx={center.x} cy={center.y} r={moonR} stroke="#707070" />
            <circle cx={center.x} cy={center.y} r={sunR} stroke="#707070" />
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
          <text x={center.x + sunR + 20} y={center.y} fontSize="20" textAnchor="end" fill="#000000">
            {sunrise}
          </text>
          <text x={center.x - sunR + 20} y={center.y} fontSize="20" textAnchor="end" fill="#000000">
            {sunset}
          </text>
          <text x={center.x + moonR + 20} y={center.y} fontSize="20" textAnchor="end" fill="#000000">
            {moonrise}
          </text>
          <text x={center.x - moonR + 20} y={center.y} fontSize="20" textAnchor="end" fill="#000000">
            {moonset}
          </text>
        </g>
      </svg>
    </div>
  )
}

export default SunMoonTime
