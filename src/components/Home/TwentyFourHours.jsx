import React from 'react'
import '../../style/Home/TwentyFourHours.scss'
// import { settingSVG } from '../../function/svg'
import store from '../../store'
import DashboardDiv from '../../style/Home/DashboardDiv'

export function settingSVG(tempList, xlineNum, xEveryWidth, yTotalHeight) {
  const originTempList = [...tempList]
  // X軸間距
  let xline = []
  for (let i = 0; i < xlineNum; i++) {
    xline.push(i * xEveryWidth)
  }
  // console.log(xline)

  // 氣溫列表字串轉數字，並取得各值與最大值的差
  tempList = tempList.map((i) => parseInt(i))
  tempList = tempList.map((i) => Math.abs(i - Math.max(...tempList)))
  // console.log(tempList)

  // 取得最大的差
  const diffTemp = Math.max(...tempList) - Math.min(...tempList)
  // console.log(diffTemp)

  // 最大的差:yTotalHeight(svg高度) => 比例套在各值，得出每個氣溫的svg高度
  tempList = tempList.map((i) => i * Math.round(yTotalHeight / diffTemp))
  // console.log(tempList)

  let svgInfoListValue = {
    text: [],
    circle: [],
  }
  let svgPathDValue = ''

  for (let i = 0; i < xline.length; i++) {
    svgInfoListValue.text.push(
      <text
        key={`text-${xline[i]}-${i}`}
        x={xline[i] + 10 + 10}
        y={tempList[i] - 10 + 30}
        fontSize="14"
        textAnchor="end"
        fill="#000000"
      >
        {originTempList[i]}
      </text>
    )
    svgInfoListValue.circle.push(
      <circle key={`circle-${xline[i]}-${i}`} cx={xline[i] + 10} cy={tempList[i] + 30} r="3" fill="#000000" />
    )
    svgPathDValue += `${xline[i]},${tempList[i] + 30},`
  }
  // console.log(svgInfoListValue)

  return {
    svgInfoListValue: svgInfoListValue,
    svgPathDValue: svgPathDValue,
  }
}

const checkIconTimeType = (time) => {
  const unit = time.slice(-1)
  if (unit === '號') return 'night'
  const timeInNum = parseInt(time.slice(0, 2))
  return timeInNum > 5 && timeInNum < 18 ? 'day' : 'night'
}

function DynamicIcon({ icon, time }) {
  const [image, setImage] = React.useState(null)

  import(`../../img/icon/${checkIconTimeType(time)}/${icon}.svg`)
    .then((image) => {
      setImage(image.default)
    })
    .catch((error) => {
      console.error('Error loading image:', error)
    })

  return image ? <img src={image} alt="Dynamic Image" /> : <></>
}

const TwentyFourHours = ({ apiCity2DayForecast }) => {
  const city2Day1WeekForecast = apiCity2DayForecast
  const [timeIconList, setTimeIconList] = React.useState([])
  const [rainList, setRainList] = React.useState([])
  const [svgInfoList, setSvgInfoList] = React.useState([])
  const [svgPathD, setSvgPathD] = React.useState('')

  React.useEffect(() => {
    const getTemperature = () => {
      console.log('API-apiCity2DayForecast/更新:' + new Date())

      // up-list
      const t = city2Day1WeekForecast.find((i) => i.elementName === 'T') // 溫度
      let countTimeList = []
      t.time.map((i, index) => index < 10 && countTimeList.push(i.dataTime.split(':')[0]))
      countTimeList = countTimeList.map((i) => (i.split(' ')[1] === '00' ? i.split(' ')[0] : i.split(' ')[1]))
      countTimeList = countTimeList.map((i) => (i.length === 2 ? `${i}時` : `${i.split('-')[2]}號`))

      const wx = city2Day1WeekForecast.find((i) => i.elementName === 'Wx') // 天氣現象
      let countIconList = []
      wx.time.map((i, index) => index < 10 && countIconList.push(parseInt(i.elementValue[1].value)))

      let combineList = []
      countTimeList.map((i, index) => combineList.push({ time: i, icon: countIconList[index] }))
      setTimeIconList(combineList)

      // svg
      let temperatureList = []
      t.time.map((i) => temperatureList.push(i.elementValue[0].value))
      const svgResult = settingSVG(temperatureList.slice(0, 10), 10, 80, 60)
      setSvgInfoList(svgResult.svgInfoListValue)
      setSvgPathD(svgResult.svgPathDValue)

      // down-list
      const poP6h = city2Day1WeekForecast.find((i) => i.elementName === 'PoP6h') // 6小時降雨機率
      let countRainList = Array(10)
      poP6h.time.map((i, index) => index < 5 && (countRainList[2 * index] = i) && (countRainList[2 * index + 1] = i))
      countRainList = countRainList.map((i) => i.elementValue[0].value)
      setRainList(countRainList)
    }
    city2Day1WeekForecast && getTemperature()

    return () => {}
  }, [city2Day1WeekForecast])

  const backgroundColorOpacity = store.getState().dashboard.backgroundColorOpacity

  return (
    <DashboardDiv $backgroundColorOpacity={backgroundColorOpacity} className="twenty-four-hours">
      <ul className="up-list">
        {timeIconList.map((i, index) => (
          <li key={index}>
            <div>{i.time}</div>
            <DynamicIcon icon={i.icon} time={i.time} />
          </li>
        ))}
      </ul>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-15 0 780 100"
        className="twentyfour-svg"
        key={new Date().getTime()}
      >
        {svgInfoList.text}
        {svgInfoList.circle}
        <path
          id=""
          dataname=""
          d={svgPathD === '' ? '' : `M${svgPathD}`}
          transform="translate(10, 0)"
          fill="none"
          stroke="#000000"
          strokeWidth="1"
        />
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
