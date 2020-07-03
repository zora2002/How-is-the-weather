import React from 'react'
import { changeStandardTime, getTimePeriod } from '../function/time'
import '../style/Wallpaper.scss'

const Wallpaper = ({ time, location }) => {
  const [timePeriod, setTimePeriod] = React.useState('')

  React.useEffect(() => {
    const calculateTimePeriod = () => {
      setTimePeriod(getTimePeriod(location.searchCity, changeStandardTime(time, 'hh:mm')))
    }

    calculateTimePeriod()

    return () => {}
  }, [location.searchCity, time])
  return <div className={`time-period ${timePeriod}`}></div>
}

export default Wallpaper
