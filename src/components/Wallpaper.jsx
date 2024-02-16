import React from 'react'
import dayjs from 'dayjs'

import { getTimePeriod } from '@/function/time'
import '@/style/Wallpaper.scss'
import { sunriceSunsetTime } from '@/config/apiList'

const Wallpaper = ({ time, location }) => {
  const [timePeriod, setTimePeriod] = React.useState('')

  React.useEffect(() => {
    const calculateTimePeriod = async () => {
      const sun = await sunriceSunsetTime({ locationName: location.searchCity })
      setTimePeriod(getTimePeriod(sun, dayjs().format('HH:mm')))
    }

    calculateTimePeriod()

    return () => {}
  }, [location.searchCity, time])
  return <div className={`time-period ${timePeriod}`}></div>
}

export default Wallpaper
