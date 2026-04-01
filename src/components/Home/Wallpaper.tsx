import { useState, useEffect } from 'react'

import { useAppStore } from '@/store/app-store'
import { getTimePeriod } from '@/utils/time'
import type { ApiDataCollection } from '@/page/Home'


const Wallpaper = ({ apiDataCollection }: { apiDataCollection: ApiDataCollection }) => {
  const dateTime = useAppStore((s) => s.dateTime)
  const [timePeriod, setTimePeriod] = useState('')

  useEffect(() => {
    if (!apiDataCollection) return
    const { sun } = apiDataCollection
    setTimePeriod(getTimePeriod(sun, dateTime))
  }, [apiDataCollection, dateTime.minute()])
  return <div className={`time-period ${timePeriod}`}></div>
}

export default Wallpaper
