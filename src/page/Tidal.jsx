import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import ChartDataLabels from 'chartjs-plugin-datalabels'

import '@/style/Tidal.scss'
import { tidal1Month } from '@/config/apiList'

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

const getData = async () => {
  const res = await tidal1Month({ locationName: '屏東縣恆春鎮' })
  return res
}

const chartDataHandler = ({ data, showDay = SHOW_DAY_DAFAULT }) => {
  if (!data) return CHRAT_DATA_DAFAULT

  let list = []
  data.slice(0, showDay + 1).forEach((i) => {
    i.Time.forEach((item) => {
      list.push({
        x: new Date(item.DateTime),
        y: parseInt(item.TideHeights.AboveLocalMSL, 10),
      })
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
  const [chartData, setChartData] = useState(CHRAT_DATA_DAFAULT)
  const [showDay, setShowDay] = useState(SHOW_DAY_DAFAULT)

  const init = async () => {
    const apiResult = await getData()
    const list = apiResult.data.records.TideForecasts[0].Location.TimePeriods.Daily
    setApiData(list)
    const chartDataList = chartDataHandler({ data: list })
    setChartData(chartDataList)
  }

  useEffect(() => {
    init()
  }, [])

  const showDayHandler = (event) => {
    const newDay = parseInt(event.target.value, 10)
    setShowDay(newDay)
    const chartDataList = chartDataHandler({ data: tidalApiData, showDay: newDay })
    setChartData(chartDataList)
  }

  return (
    <div className="tidal-bg">
      <div className="tidal-info">
        <div className="left">地點：{}</div>
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
