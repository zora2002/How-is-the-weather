import React from 'react'
import '../../style/Home/SunMoonTime.scss'
import { getSunMoonData, changeStandardTime, timeToMinutes } from '../../function/time'
import store from '../../store'
import DashboardDiv from '../../style/Home/DashboardDiv'

const center = { x: 250, y: 250 }
const sunR = 200
const moonR = 100
const moonOffset = { x: 35, y: 28 }

const mooveTypeHandler = (riseToday, setToday) => {
  if (riseToday && setToday) {
    const setSubtractRise = timeToMinutes(setToday) - timeToMinutes(riseToday)
    return setSubtractRise > 0 ? 'A' : 'C'
  } else if (!riseToday && setToday) {
    return 'D'
  } else if (riseToday && !setToday) {
    return 'B'
  } else {
    console.log('Something is wrong in "mooveTypeHandler"...')
  }
}

const nowAngle = (totalTime, nowTime) => {
  return (180 * nowTime) / totalTime
}

const translateHandler = (nowTime, riseYesterday, setYesterday, riseToday, setToday, riseTomorrow, setTomorrow) => {
  const mooveType = mooveTypeHandler(riseToday, setToday)

  const nowTimeTotalMin = timeToMinutes(nowTime)

  const riseYesterdayTotalMin = timeToMinutes(riseYesterday)
  const surplusRiseYesterdayTotalMin = 24 * 60 - riseYesterdayTotalMin
  const setYesterdayTotalMin = timeToMinutes(setYesterday)
  const surplusSetYesterdayTotalMin = 24 * 60 - setYesterdayTotalMin

  const riseTotalMin = timeToMinutes(riseToday)
  const surplusRiseTotalMin = 24 * 60 - riseTotalMin
  const setTotalMin = timeToMinutes(setToday)
  const surplusSetTotalMin = 24 * 60 - setTotalMin

  const riseTomorrowTotalMin = timeToMinutes(riseTomorrow)
  const setTomorrowTotalMin = timeToMinutes(setTomorrow)

  let angle = 0
  if (mooveType === 'A') {
    if (nowTime === riseToday) {
      angle = 0
    } else if (nowTime === setToday) {
      angle = 180
    } else {
      if (nowTimeTotalMin < riseTotalMin) {
        // position-A-1
        console.log('position-A-1')
        angle =
          180 + nowAngle(surplusSetYesterdayTotalMin + riseTotalMin, surplusSetYesterdayTotalMin + nowTimeTotalMin)
      } else if (riseTotalMin < nowTimeTotalMin && nowTimeTotalMin < setTotalMin) {
        // position-A-2
        console.log('position-A-2')
        angle = nowAngle(setTotalMin - riseTotalMin, nowTimeTotalMin - riseTotalMin)
      } else {
        // position-A-3
        console.log('position-A-3')
        angle = 180 + nowAngle(surplusSetTotalMin + riseTomorrowTotalMin, nowTimeTotalMin - setTotalMin)
      }
    }
  } else if (mooveType === 'B') {
    if (nowTime === riseToday) {
      angle = 0
    } else {
      if (nowTimeTotalMin < riseTotalMin) {
        // position-B-1
        console.log('position-B-1')
        angle =
          180 + nowAngle(surplusSetYesterdayTotalMin + riseTotalMin, surplusSetYesterdayTotalMin + nowTimeTotalMin)
      } else {
        // position-B-2
        console.log('position-B-2')
        angle = nowAngle(surplusRiseTotalMin + setTomorrowTotalMin, nowTimeTotalMin - riseTotalMin)
      }
    }
  } else if (mooveType === 'C') {
    if (nowTime === riseToday) {
      angle = 0
    } else if (nowTime === setToday) {
      angle = 180
    } else {
      if (nowTimeTotalMin < setTotalMin) {
        // position-C-1
        console.log('position-C-1')
        angle = nowAngle(surplusRiseYesterdayTotalMin + setTotalMin, surplusRiseYesterdayTotalMin + nowTimeTotalMin)
      } else if (setTotalMin < nowTimeTotalMin && nowTimeTotalMin < riseTotalMin) {
        // position-C-2
        console.log('position-C-2')
        angle = 180 + nowAngle(riseTotalMin - setTotalMin, nowTimeTotalMin - setTotalMin)
      } else {
        // position-C-3
        console.log('position-C-3')
        angle = nowAngle(surplusRiseTotalMin + setTomorrowTotalMin, nowTimeTotalMin - riseTotalMin)
      }
    }
  } else if (mooveType === 'D') {
    if (nowTime === setToday) {
      angle = 180
    } else {
      if (nowTimeTotalMin < setTotalMin) {
        // position-D-1
        console.log('position-D-1')
        angle = nowAngle(surplusRiseYesterdayTotalMin + setTotalMin, surplusRiseYesterdayTotalMin + nowTimeTotalMin)
      } else {
        // position-D-2
        console.log('position-D-2')
        angle = 180 + nowAngle(surplusSetTotalMin + riseTomorrowTotalMin, nowTimeTotalMin - setTotalMin)
      }
    }
  } else {
    console.log('Something is wrong in "translateHandler"...')
  }
  angle = -angle
  const radians = angle * (Math.PI / 180)
  return { x: Math.cos(radians), y: Math.sin(radians) }
}

const SunMoonTime = ({ time, hour, location }) => {
  const nowTime = changeStandardTime(time, 'hh:mm')
  const nowHour = hour

  const [sunsetYesterday, setSunsetYesterday] = React.useState('')
  const [sunrise, setSunrise] = React.useState('')
  const [sunset, setSunset] = React.useState('')
  const [sunriseTomorrow, setSunriseTomorrow] = React.useState('')
  const [sunTrans, setSunTrans] = React.useState('translate(0 0)')

  const [moonriseYesterday, setMoonriseYesterday] = React.useState('')
  const [moonsetYesterday, setMoonsetYesterday] = React.useState('')
  const [moonrise, setMoonrise] = React.useState('')
  const [moonset, setMoonset] = React.useState('')
  const [moonriseTomorrow, setMoonriseTomorrow] = React.useState('')
  const [moonsetTomorrow, setMoonsetTomorrow] = React.useState('')
  const [moonTrans, setMoonTrans] = React.useState('translate(0 0)')

  React.useEffect(() => {
    const sunTimeList = getSunMoonData('sun', location.searchCity, changeStandardTime(new Date(), 'YYYY-MM-DD'))
      .parameter
    setSunrise(sunTimeList.find((i) => i.parameterName === '日出時刻').parameterValue)
    setSunset(sunTimeList.find((i) => i.parameterName === '日沒時刻').parameterValue)
    const sunTimeYesterdayList = getSunMoonData(
      'sun',
      location.searchCity,
      changeStandardTime(new Date(), 'YYYY-MM-DD-1')
    ).parameter
    setSunsetYesterday(sunTimeYesterdayList.find((i) => i.parameterName === '日沒時刻').parameterValue)
    const sunTimeTomorrowList = getSunMoonData(
      'sun',
      location.searchCity,
      changeStandardTime(new Date(), 'YYYY-MM-DD+1')
    ).parameter
    setSunriseTomorrow(sunTimeTomorrowList.find((i) => i.parameterName === '日出時刻').parameterValue)

    const moonTimeList = getSunMoonData('moon', location.searchCity, changeStandardTime(new Date(), 'YYYY-MM-DD'))
      .parameter
    setMoonrise(moonTimeList.find((i) => i.parameterName === '月出時刻').parameterValue)
    setMoonset(moonTimeList.find((i) => i.parameterName === '月沒時刻').parameterValue)
    const moonTimeYesterdayList = getSunMoonData(
      'moon',
      location.searchCity,
      changeStandardTime(new Date(), 'YYYY-MM-DD-1')
    ).parameter
    setMoonriseYesterday(moonTimeYesterdayList.find((i) => i.parameterName === '月出時刻').parameterValue)
    setMoonsetYesterday(moonTimeYesterdayList.find((i) => i.parameterName === '月沒時刻').parameterValue)
    const moonTimeTomorrowList = getSunMoonData(
      'moon',
      location.searchCity,
      changeStandardTime(new Date(), 'YYYY-MM-DD+1')
    ).parameter
    setMoonriseTomorrow(moonTimeTomorrowList.find((i) => i.parameterName === '月出時刻').parameterValue)
    setMoonsetTomorrow(moonTimeTomorrowList.find((i) => i.parameterName === '月沒時刻').parameterValue)

    return () => {}
  }, [location.searchCity, nowHour])

  React.useEffect(() => {
    const setPosition = () => {
      if (sunrise && sunset && sunriseTomorrow) {
        const sun = translateHandler(nowTime, '', sunsetYesterday, sunrise, sunset, sunriseTomorrow, '')
        setSunTrans(`translate(${center.x + sun.x * sunR} ${center.y + sun.y * sunR})`)
        const moon = translateHandler(
          nowTime,
          moonriseYesterday,
          moonsetYesterday,
          moonrise,
          moonset,
          moonriseTomorrow,
          moonsetTomorrow
        )
        setMoonTrans(
          `translate(${center.x - moonOffset.x + moon.x * moonR} ${center.y - moonOffset.y + moon.y * moonR})`
        )
      }
    }

    setPosition()

    return () => {}
  }, [
    moonrise,
    moonriseTomorrow,
    moonriseYesterday,
    moonset,
    moonsetTomorrow,
    moonsetYesterday,
    nowTime,
    sunrise,
    sunriseTomorrow,
    sunset,
    sunsetYesterday,
  ])

  const backgroundColorOpacity = store.getState().dashboard.backgroundColorOpacity

  return (
    <DashboardDiv backgroundColorOpacity={backgroundColorOpacity} className="sun-moon-time">
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
    </DashboardDiv>
  )
}

export default SunMoonTime
