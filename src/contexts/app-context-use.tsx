import { useContext } from 'react'
import { AppContext } from '../contexts/app-context'

function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within a AppContextProvider')
  }
  return context
}

export default useApp
