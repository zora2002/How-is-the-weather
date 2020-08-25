import React from 'react'
import '../../style/Home/TwentyFourHours.scss'
import { settingSVG } from '../../function/svg'

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
  return (
    <div className="twenty-four-hours">
      <ul className="up-list">
        {timeIconList.map((i, index) => (
          <li key={index}>
            <div>{i.time}</div>
            <img src={require(`../../img/icon/${i.icon}.svg`)} alt="" />
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
    </div>
  )
}

export default TwentyFourHours
