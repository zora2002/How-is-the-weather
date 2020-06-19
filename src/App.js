import React from 'react'
import './App.scss'
import SideBar from './components/SideBar'
import Home from './page/Home'
import { changeStandardTime, getTimePeriod } from './function/time'

const searchCity = '臺中市'
const searchDistrict = '西屯區'

const App = () => {
  const [time, setTime] = React.useState(new Date())
  const [timePeriod, setTimePeriod] = React.useState('')

  React.useEffect(() => {
    const getNowTime = setInterval(() => {
      setTime(new Date())
    }, 60 * 1000)

    const calculateTimePeriod = () => {
      setTimePeriod(getTimePeriod(searchCity, changeStandardTime(time, 'hh:mm')))
    }

    calculateTimePeriod()

    return () => {
      clearInterval(getNowTime)
    }
  }, [time])
  return (
    <div className={`App time-period ${timePeriod}`}>
      <SideBar />
      <Home />
    </div>
  )
}

export default App
