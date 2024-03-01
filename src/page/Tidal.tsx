import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import ChartDataLabels from 'chartjs-plugin-datalabels'

import { Tidal1MonthResponseData } from '@/ts-common/api-response'
import { tidal1MonthData } from '@/utils/api-list'

import '@/assets/style/Tidal.scss'

type TidalApiData = Tidal1MonthResponseData['TideForecasts'][0]['Location']['TimePeriods']['Daily']
type ChartDataTType = 'line'
type ChartDataTData = { x: Date; y: number }[]
type ChartInfo = ChartData<ChartDataTType, ChartDataTData>

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

const chartOptions: ChartOptions<'line'> = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
      },
    },
    y: {
      grid: {
        tickBorderDash: [2, 5],
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
      formatter: (value, context) => {
        return value.y
      },
    },
  },
}

const CHRAT_DATA_DAFAULT: ChartInfo = {
  datasets: [
    {
      label: 'Tidal',
      data: [],
    },
  ],
}

const chartInfoHandler = ({ data, showDay }: { data: TidalApiData; showDay: number }): ChartInfo => {
  if (!data) return CHRAT_DATA_DAFAULT

  let chartData = {
    ...CHRAT_DATA_DAFAULT,
    datasets: [...CHRAT_DATA_DAFAULT.datasets],
  }
  chartData.datasets[0].data = data
    .slice(0, showDay + 1)
    ?.map((i) =>
      i.Time?.map((t) => ({
        x: new Date(t.DateTime),
        y: t.TideHeights.AboveLocalMSL,
      }))
    )
    .flat()

  return chartData
}

const Tidal = () => {
  const [tidalApiData, setApiData] = useState<TidalApiData>([])
  const [chartInfo, setChartInfo] = useState<ChartInfo>(CHRAT_DATA_DAFAULT)
  const [showDay, setShowDay] = useState<number>(SHOW_DAY_DAFAULT)

  useEffect(() => {
    const apiDatHandler = async () => {
      try {
        const res = await tidal1MonthData({ tidalLocation: '屏東縣恆春鎮' })
        const list = res?.TideForecasts[0]?.Location?.TimePeriods?.Daily
        setApiData(list)
        const chartDataList = chartInfoHandler({ data: list, showDay: SHOW_DAY_DAFAULT })
        setChartInfo(chartDataList)
      } catch (error) {
        console.log(error)
      }
    }

    apiDatHandler()
  }, [])

  const showDayHandler = (event) => {
    const newDay = parseInt(event.target.value, 10)
    setShowDay(newDay)
    const chartDataList = chartInfoHandler({ data: tidalApiData, showDay: newDay })
    setChartInfo(chartDataList)
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
        <Line options={chartOptions} data={chartInfo} />
      </div>
    </div>
  )
}

export default Tidal
