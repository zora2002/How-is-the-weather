import React from 'react'
import { changeStandardTime, getTimePeriod } from '../function/time'
import '../style/Wallpaper.scss'

const searchCity = '臺中市'

const Wallpaper = ({ time }) => {
  const [timePeriod, setTimePeriod] = React.useState('')

  React.useEffect(() => {
    const calculateTimePeriod = () => {
      setTimePeriod(getTimePeriod(searchCity, changeStandardTime(time, 'hh:mm')))
    }

    calculateTimePeriod()

    return () => {}
  }, [time])
  return <div className={`time-period ${timePeriod}`}></div>
}

export default Wallpaper
