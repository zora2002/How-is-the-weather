import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import AllRoutes from '@/routes'
import { useAppStore } from '@/store/app-store'
import { cancelPreviousPageRequests } from './utils/api-setting'

import 'react-toastify/dist/ReactToastify.css'
import '@/assets/style/App.scss'

let previousPath = ''
let currentPath = ''

export default function App() {
  const location = useLocation()
  const startDateTimeTick = useAppStore((s) => s.startDateTimeTick)

  useEffect(() => {
    return startDateTimeTick()
  }, [])

  useEffect(() => {
    if (!previousPath && !currentPath) {
      previousPath = location.pathname
      currentPath = location.pathname
    } else {
      previousPath = currentPath
      currentPath = location.pathname
    }
    if (previousPath !== currentPath) {
      cancelPreviousPageRequests(previousPath)
    }
  }, [location.pathname])

  return <AllRoutes />
}
