import React from 'react'
import '@/style/Home/WeekInfo.scss'
import { isApi12hrFirstArrayHour, removeArrayFirstItem } from '@/utils/time'
import store from '@/store'
import DashboardDiv from '@/style/Home/DashboardDiv'

function setting2SVG(tempList, xlineNum, xEveryWidth, yTotalHeight) {
  const originTempList = { ...tempList }
  let mixlist = tempList.day.concat(tempList.night)

  // X軸間距
  let xline = []
  for (let i = 0; i < xlineNum; i++) {
    xline.push(i * xEveryWidth)
  }
  // console.log(xline)

  // 氣溫列表字串轉數字，並取得各值與最大值的差
  mixlist = mixlist.map((i) => parseInt(i))

  tempList.day = tempList.day.map((i) => Math.abs(i - Math.max(...mixlist)))
  tempList.night = tempList.night.map((i) => Math.abs(i - Math.max(...mixlist)))

  mixlist = mixlist.map((i) => Math.abs(i - Math.max(...mixlist)))
  // console.log(mixlist)

  // 取得最大的差
  const diffTemp = Math.max(...mixlist) - Math.min(...mixlist)
  // console.log(diffTemp)

  // 最大的差:yTotalHeight(svg高度) => 比例套在各值，得出每個氣溫的svg高度
  tempList.day = tempList.day.map((i) => i * Math.round(yTotalHeight / diffTemp))
  tempList.night = tempList.night.map((i) => i * Math.round(yTotalHeight / diffTemp))

  let svgInfoListValue = {
    text: [],
    circle: [],
  }
  let svgPathDValue = {
    day: [],
    night: [],
  }

  for (let i = 0; i < xline.length; i++) {
    // day
    svgInfoListValue.text.push(
      <text
        key={`text-day-${xline[i]}-${i}`}
        x={xline[i] + 10 + 10}
        y={tempList.day[i] - 10 + 10}
        fontSize="13"
        textAnchor="end"
        fill="#000000"
      >
        {originTempList.day[i]}
      </text>
    )
    svgInfoListValue.circle.push(
      <circle key={`circle-day-${xline[i]}-${i}`} cx={xline[i] + 10} cy={tempList.day[i] + 10} r="3" fill="#000000" />
    )
    svgPathDValue.day += `${xline[i]},${tempList.day[i] + 10},`

    // night
    svgInfoListValue.text.push(
      <text
        key={`text-night-${xline[i]}-${i}`}
        x={xline[i] + 10 + 10}
        y={tempList.night[i] - 10 + 10}
        fontSize="13"
        textAnchor="end"
        fill="#000000"
      >
        {originTempList.night[i]}
      </text>
    )
    svgInfoListValue.circle.push(
      <circle
        key={`circle-night-${xline[i]}-${i}`}
        cx={xline[i] + 10}
        cy={tempList.night[i] + 10}
        r="3"
        fill="#000000"
      />
    )
    svgPathDValue.night += `${xline[i]},${tempList.night[i] + 10},`
  }

  return {
    svgInfoListValue: svgInfoListValue,
    svgPathDValue: svgPathDValue,
  }
}

function DynamicIcon({ dayNightTime, icon }) {
  const [image, setImage] = React.useState(null)

  import(`../../img/icon/${dayNightTime}/${parseInt(icon[dayNightTime])}.svg`)
    .then((image) => {
      setImage(image.default)
    })
    .catch((error) => {
      console.error('Error loading image:', error)
    })

  return image ? <img src={image} alt="Dynamic Image" /> : <div>Loading...</div>
}

const WeekInfo = ({ apiCity1WeekForecast }) => {
  const [dateIconList, setdateIconList] = React.useState([])
  const [dayNightTime, setDayNightTime] = React.useState('day')
  const [svgInfoList, setSvgInfoList] = React.useState([])
  const [svgPathD, setSvgPathD] = React.useState({ day: '', night: '' })
  const [rainList, setRainList] = React.useState({ day: [], night: [] })

  React.useEffect(() => {
    const getTemperature = () => {
      console.log('API-apiCity1WeekForecast/更新:' + new Date())

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

  const backgroundColorOpacity = store.getState().dashboard.backgroundColorOpacity

  return (
    <DashboardDiv $backgroundColorOpacity={backgroundColorOpacity} className="week-info">
      <ul className="up-list">
        {dateIconList.map((i, index) => (
          <li key={index}>
            <div>{i.date}</div>
            <DynamicIcon dayNightTime={dayNightTime} icon={i.icon} />
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
          <li key={index}>{i === ' ' ? '-' : `${i}%`}</li>
        ))}
      </ul>
    </DashboardDiv>
  )
}

export default WeekInfo
