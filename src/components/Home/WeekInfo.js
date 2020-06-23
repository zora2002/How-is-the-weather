import React from 'react'
import '../../style/Home/WeekInfo.scss'
import { setting2SVG } from '../../function/svg'

const WeekInfo = ({ apiCity1WeekForecast }) => {
  const city1WeekForecast = apiCity1WeekForecast
  const [dateIconList, setdateIconList] = React.useState([])
  const [dayNightTime, setDayNightTime] = React.useState('day')
  const [svgInfoList, setSvgInfoList] = React.useState([])
  const [svgPathD, setSvgPathD] = React.useState({ day: '', night: '' })
  const [rainList, setRainList] = React.useState({ day: [], night: [] })

  React.useEffect(() => {
    const getTemperature = () => {
      console.log('api-2-WeekInfo.js/更新:' + new Date())
      let needRemoveFirstOne = false
      let apiFirstArrayHour = 0

      // up-list
      const wx = city1WeekForecast.find((i) => i.elementName === 'Wx') // 平均溫度
      let checkedWx = [...wx.time]
      needRemoveFirstOne =
        new Date(checkedWx[0].startTime).getDate()[0] === new Date(checkedWx[0].startTime).getDate()[1]
      apiFirstArrayHour = parseInt(new Date(checkedWx[0].startTime).getHours())
      checkedWx = needRemoveFirstOne ? checkedWx : checkedWx.slice(1, checkedWx.length)
      // date
      let dateList = []
      checkedWx.map((i) => dateList.push(`${new Date(i.startTime).getMonth() + 1}/${new Date(i.startTime).getDate()}`))
      let singleDateList = []
      dateList.map((i, index) => index % 2 === 0 && singleDateList.push(i))
      // icon
      let iconList = {
        day: [],
        night: [],
      }
      if (apiFirstArrayHour === 6 || apiFirstArrayHour === 12) {
        checkedWx.map((i, index) =>
          index % 2 === 0 ? iconList.day.push(i.elementValue[1].value) : iconList.night.push(i.elementValue[1].value)
        )
      } else {
        checkedWx.map((i, index) =>
          index % 2 === 0 ? iconList.night.push(i.elementValue[1].value) : iconList.day.push(i.elementValue[1].value)
        )
      }
      // combineList
      let combineList = []
      singleDateList.map((i, index) =>
        combineList.push({ date: i, icon: { day: iconList.day[index], night: iconList.night[index] } })
      )
      setdateIconList(combineList)

      // svg
      const t = city1WeekForecast.find((i) => i.elementName === 'T') // 平均溫度
      let checkedT = [...t.time]
      checkedT = needRemoveFirstOne ? checkedT : checkedT.slice(1, checkedT.length)
      let tempList = {
        day: [],
        night: [],
      }
      if (apiFirstArrayHour === 6 || apiFirstArrayHour === 12) {
        checkedT.map((i, index) =>
          index % 2 === 0 ? tempList.day.push(i.elementValue[0].value) : tempList.night.push(i.elementValue[0].value)
        )
      } else {
        checkedT.map((i, index) =>
          index % 2 === 0 ? tempList.night.push(i.elementValue[0].value) : tempList.day.push(i.elementValue[0].value)
        )
      }
      const svgResult = setting2SVG(tempList, 7, 120, 100)
      setSvgInfoList(svgResult.svgInfoListValue)
      setSvgPathD(svgResult.svgPathDValue)

      // svg
      const poP12h = city1WeekForecast.find((i) => i.elementName === 'PoP12h') // 平均溫度
      let checkedPoP12h = [...poP12h.time]
      checkedPoP12h = needRemoveFirstOne ? checkedPoP12h : checkedPoP12h.slice(1, checkedPoP12h.length)
      let countRainList = {
        day: [],
        night: [],
      }
      if (apiFirstArrayHour === 6 || apiFirstArrayHour === 12) {
        checkedPoP12h.map((i, index) =>
          index % 2 === 0
            ? countRainList.day.push(i.elementValue[0].value)
            : countRainList.night.push(i.elementValue[0].value)
        )
      } else {
        checkedPoP12h.map((i, index) =>
          index % 2 === 0
            ? countRainList.night.push(i.elementValue[0].value)
            : countRainList.day.push(i.elementValue[0].value)
        )
      }
      setRainList(countRainList)
    }
    city1WeekForecast && getTemperature()

    return () => {}
  }, [city1WeekForecast])

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
