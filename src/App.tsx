import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import AllRoutes from '@/routes'
import { AppContextProvider } from './contexts/app-context'
import { cancelPreviousPageRequests } from './utils/api-setting'

import '@/App.scss'

let previousPath = ''
let currentPath = ''

export default function App() {
  const location = useLocation()

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

  return (
    <AppContextProvider>
      <AllRoutes />
    </AppContextProvider>
  )
}
