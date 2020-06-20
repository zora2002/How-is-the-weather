import React from 'react'
import '../../style/Home/TwentyFourHours.scss'
import { settingSVG } from '../../function/svg'

const TwentyFourHours = ({ apiCity2Day1WeekForecast }) => {
  const city2Day1WeekForecast = apiCity2Day1WeekForecast
  const [svgInfoList, setSvgInfoList] = React.useState([])
  const [svgPathD, setSvgPathD] = React.useState('')

  React.useEffect(() => {
    const getTemperature = () => {
      console.log('api-2-24/更新:' + new Date(), city2Day1WeekForecast)

      if (city2Day1WeekForecast) {
        const t = city2Day1WeekForecast.find((i) => i.elementName === 'T') // 溫度
        let list = []
        t.time.map((i) => list.push(i.elementValue[0].value))

        const svgResult = settingSVG(list.slice(0, 10), 10, 80, 60)
        setSvgInfoList(svgResult.svgInfoListValue)
        setSvgPathD(svgResult.svgPathDValue)
      }
    }
    getTemperature()

    return () => {}
  }, [city2Day1WeekForecast])
  return (
    <div className="twenty-four-hours">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 100" className="twenty" key={new Date().getTime()}>
        {svgInfoList.text}
        {svgInfoList.circle}
        <path
          id=""
          dataname=""
          d={svgPathD === '' ? '' : `M${svgPathD}`}
          transform="translate(10, 0)"
          fill="none"
          stroke="#707070"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}

export default TwentyFourHours
