import { useState, useEffect } from 'react'

import useApp from '@/contexts/app-context-use'
import { getTimePeriod } from '@/utils/time'
import type { ApiDataCollection } from '@/page/Home'

import '@/assets/style/Wallpaper.scss'

const Wallpaper = ({ apiDataCollection }: { apiDataCollection: ApiDataCollection }) => {
  const { dateTime } = useApp()
  const [timePeriod, setTimePeriod] = useState('')

  useEffect(() => {
    if (!apiDataCollection) return
    const { sun } = apiDataCollection
    setTimePeriod(getTimePeriod(sun, dateTime))
  }, [apiDataCollection, dateTime.minute()])
  return <div className={`time-period ${timePeriod}`}></div>
}

export default Wallpaper
