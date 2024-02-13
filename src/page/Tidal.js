import React, { useEffect, useState } from 'react'
import { tidal1Month } from '../config/apiList'
import 'chartjs-adapter-moment'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import '../style/Tidal.scss'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels)

const SHOW_DAY_DAFAULT = 3

const SELECT_LIST = [
  { value: 3, name: '3 days' },
  { value: 7, name: '7 days' },
  { value: 14, name: '14 days' },
  { value: 21, name: '21 days' },
  { value: 32, name: '1 month' },
]

const RGBA = {
  BLUE: '54, 162, 235',
  YELLOW: '255, 215, 0',
  GRAY: '80, 80, 80',
}

const setRgba = (color = RGBA.GRAY, opacity = 0.7) => `rgba(${color}, ${opacity})`

const chartOptions = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
      },
    },
    y: {
      grid: {
        borderDash: [2, 5],
      },
    },
  },
  datasets: {
    line: {
      // point
      pointBackgroundColor: [setRgba(RGBA.BLUE, 0.4), setRgba(RGBA.YELLOW, 0.4)],
      pointBorderColor: [setRgba(RGBA.BLUE, 0.4), setRgba(RGBA.YELLOW, 0.4)],
      pointBorderWidth: 1,
      pointRadius: 5,
      // line
      backgroundColor: setRgba(RGBA.GRAY, 0.4),
      borderCapStyle: 'round',
      borderColor: setRgba(RGBA.GRAY, 0.4),
      borderWidth: 1.5,
      // Interactions
      pointHoverBackgroundColor: [setRgba(RGBA.BLUE, 0.6), setRgba(RGBA.YELLOW, 0.6)],
      pointHoverRadius: 10,
      // cubicInterpolationMode
      cubicInterpolationMode: 'monotone',
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Level (cm): Above Local MSL',
    },
    datalabels: {
      align: 'top',
      color: [setRgba(RGBA.BLUE, 0.6), setRgba(RGBA.YELLOW, 1)],
      formatter: (value, context) => value.y,
    },
  },
}

const CHRAT_DATA_DAFAULT = {
  datasets: [
    {
      label: 'Tidal',
      data: [],
    },
  ],
}

const sortByDate = (data) => {
  data.forEach((i) => {
    i['startTimeInDateType'] = new Date(i.Date)
    i.Time.forEach((item) => {
      item['timeInDateType'] = new Date(item.DateTime)
    })
    i.Time.sort((a, b) => a.timeInDateType - b.timeInDateType)
  })
  data.sort((a, b) => a.startTimeInDateType - b.startTimeInDateType)

  return data
}

const getData = async () => {
  const res = await tidal1Month({ locationName: '屏東縣恆春鎮' })
  return res
}

const chartDataHandler = ({ sortData, showDay = SHOW_DAY_DAFAULT }) => {
  if (!sortData) return CHRAT_DATA_DAFAULT

  let list = []
  sortData.forEach((i, index) => {
    if (index > showDay) return
    i.Time.forEach((item) => {
      const info = {
        x: new Date(item.DateTime),
        y: parseInt(item.TideHeights.AboveLocalMSL, 10),
      }
      list.push(info)
    })
  })

  // 要深層解構
  let chartData = {
    ...CHRAT_DATA_DAFAULT,
    datasets: [...CHRAT_DATA_DAFAULT.datasets],
  }
  chartData.datasets[0].data = list

  return chartData
}

const Tidal = () => {
  const [tidalApiData, setApiData] = useState({})
  const [tidalApiSortData, setApiSortData] = useState([])
  const [chartData, setChartData] = useState(CHRAT_DATA_DAFAULT)
  const [showDay, setShowDay] = useState(SHOW_DAY_DAFAULT)

  useEffect(() => {
    const init = async () => {
      const apiResult = await getData()
      setApiData(apiResult)
      const sortApiResult = sortByDate(apiResult.data.records.TideForecasts[0].Location.TimePeriods.Daily)
      setApiSortData(sortApiResult)
      const chartDataList = chartDataHandler({ sortData: sortApiResult })
      setChartData(chartDataList)
    }
    init()
  }, [])

  useEffect(() => {
    const chartDataList = chartDataHandler({ sortData: tidalApiSortData, showDay: showDay })
    setChartData(chartDataList)
  }, [showDay, tidalApiSortData])

  const showDayHandler = (event) => {
    setShowDay(parseInt(event.target.value), 10)
  }

  return (
    <div className="tidal-bg">
      <div className="tidal-info">
        <div className="left">地點：{tidalApiSortData.locationName}</div>
        <select className="right" value={showDay} onChange={showDayHandler}>
          {SELECT_LIST.map((i) => {
            return (
              <option value={i.value} key={i.value}>
                {i.name}
              </option>
            )
          })}
        </select>
      </div>
      <div className="tidal-chart">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  )
}

export default Tidal
