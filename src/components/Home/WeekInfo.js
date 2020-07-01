import React from 'react'
import '../../style/Home/WeekInfo.scss'
import { setting2SVG } from '../../function/svg'
import { isApi12hrFirstArrayHour, removeArrayFirstItem } from '../../function/time'

const WeekInfo = ({ apiCity1WeekForecast }) => {
  const [dateIconList, setdateIconList] = React.useState([])
  const [dayNightTime, setDayNightTime] = React.useState('day')
  const [svgInfoList, setSvgInfoList] = React.useState([])
  const [svgPathD, setSvgPathD] = React.useState({ day: '', night: '' })
  const [rainList, setRainList] = React.useState({ day: [], night: [] })

  React.useEffect(() => {
    const getTemperature = () => {
      console.log('api-7-WeekInfo.js/更新:' + new Date())

      // up-list
      const wx = apiCity1WeekForecast.find((i) => i.elementName === 'Wx') // 平均溫度
      let checkedWx = checkArray([...wx.time])
      // date
      let dateList = []
      checkedWx.map(
        (i, index) =>
          index % 2 === 0 && dateList.push(`${new Date(i.startTime).getMonth() + 1}/${new Date(i.startTime).getDate()}`)
      )
      // icon
      let iconList = {
        day: [],
        night: [],
      }
      checkedWx.map((i, index) =>
        index % 2 === 0 ? iconList.day.push(i.elementValue[1].value) : iconList.night.push(i.elementValue[1].value)
      )
      // combineList
      let combineList = []
      dateList.map((i, index) =>
        combineList.push({ date: i, icon: { day: iconList.day[index], night: iconList.night[index] } })
      )
      setdateIconList(combineList)

      // svg
      const t = apiCity1WeekForecast.find((i) => i.elementName === 'T') // 平均溫度
      let checkedT = checkArray([...t.time])
      let tempList = {
        day: [],
        night: [],
      }
      checkedT.map((i, index) =>
        index % 2 === 0 ? tempList.day.push(i.elementValue[0].value) : tempList.night.push(i.elementValue[0].value)
      )
      const svgResult = setting2SVG(tempList, 7, 120, 100)
      setSvgInfoList(svgResult.svgInfoListValue)
      setSvgPathD(svgResult.svgPathDValue)

      // rain
      const poP12h = apiCity1WeekForecast.find((i) => i.elementName === 'PoP12h') // 12小時降雨機率
      let checkedPoP12h = checkArray([...poP12h.time])
      let countRainList = {
        day: [],
        night: [],
      }
      checkedPoP12h.map((i, index) =>
        index % 2 === 0
          ? countRainList.day.push(i.elementValue[0].value)
          : countRainList.night.push(i.elementValue[0].value)
      )
      setRainList(countRainList)
    }
    apiCity1WeekForecast && getTemperature()

    return () => {}
  }, [apiCity1WeekForecast])

  const checkArray = (arrayList) => {
    return isApi12hrFirstArrayHour(arrayList[0]) ? arrayList : removeArrayFirstItem(arrayList)
  }

  const dayNightHandler = () => {
    const isDay = dayNightTime === 'day'
    const newTime = !isDay
    setDayNightTime(newTime ? 'day' : 'night')
  }

  return (
    <div className="week-info">
      <ul className="up-list">
        {dateIconList.map((i, index) => (
          <li key={index}>
            <div>{i.date}</div>
            <img src={require(`../../img/icon/${parseInt(i.icon[dayNightTime])}.svg`)} alt="" />
          </li>
        ))}
      </ul>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-15 0 780 100"
        className="week-svg"
        key={new Date().getTime()}
        onClick={dayNightHandler}
      >
        {svgInfoList.text}
        {svgInfoList.circle}
        <path
          key={'day' + new Date().getTime()}
          id=""
          dataname=""
          d={svgPathD.day === '' ? '' : `M${svgPathD.day}`}
          transform="translate(10, 0)"
          fill="none"
          stroke={dayNightTime === 'day' ? '#000000' : '#AFAFAF'}
          strokeWidth="1"
        />
        <path
          key={'night' + new Date().getTime()}
          id=""
          dataname=""
          d={svgPathD.night === '' ? '' : `M${svgPathD.night}`}
          transform="translate(10, 0)"
          fill="none"
          stroke={dayNightTime === 'night' ? '#000000' : '#AFAFAF'}
          strokeWidth="1"
        />
      </svg>
      <ul className="down-list">
        {rainList[dayNightTime].map((i, index) => (
          <li key={index}>{i}%</li>
        ))}
      </ul>
    </div>
  )
}

export default WeekInfo
